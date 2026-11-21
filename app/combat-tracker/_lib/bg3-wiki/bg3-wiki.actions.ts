"use server";

import { CombatAction } from "@/app/_lib/types/combat-action.type";
import { CombatPassive } from "@/app/_lib/types/combat-passive.type";
import { AbilityEnum } from "@/app/_lib/enums/ability.enum";
import {
  BG3_WIKI_HOST,
  Bg3WikiError,
  Bg3WikiErrorEnum,
  buildCharacterFromInfobox,
  extractPageTitleFromUrl,
  getImageFileCandidates,
  getInfoboxList,
  mergeCombatInfobox,
  parseInfobox,
  parseTemplate,
  toFileTitle,
  WikiCharacter,
} from "./bg3-wiki.parser";
import {
  ACTION_FIELDS,
  buildCombatActions,
  buildPagesWhere,
  extractFeatureBoxes,
  findCombatSubpage,
  findWeaponItems,
  getActionIconFile,
  uniqueFeatureBoxes,
  WEAPON_FIELDS,
  WikiActionRow,
  WikiWeaponRow,
} from "./bg3-wiki-combat-actions.parser";
import {
  buildPassiveFromPage,
  buildPassives,
  buildResistancePassives,
  PASSIVE_PAGE_TEMPLATE,
} from "./bg3-wiki-passives.parser";
import {
  getResistanceIconFile,
  parseResistance,
  Resistance,
} from "@/app/combat-tracker/_lib/bg3-resistances";

type WikiParseResponse = {
  parse?: { title: string; wikitext: string };
  error?: { code: string; info: string };
};

type WikiImageInfoResponse = {
  query?: {
    normalized?: { from: string; to: string }[];
    redirects?: { from: string; to: string }[];
    pages?: {
      title: string;
      missing?: boolean;
      imageinfo?: { url: string }[];
    }[];
  };
};

export type CreateCharacterFromWikiResult =
  | { character: WikiCharacter; error?: never }
  | { character?: never; error: Bg3WikiErrorEnum };

export type CreatePassiveFromWikiResult =
  | { passive: CombatPassive; error?: never }
  | { passive?: never; error: Bg3WikiErrorEnum };

const USER_AGENT = "kbj-la-meujie-combat-tracker";

/** The API accepts at most 50 titles per request for anonymous users */
const MAX_TITLES_PER_REQUEST = 50;

const fetchJson = async <T>(url: URL): Promise<T> => {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Bg3WikiError(Bg3WikiErrorEnum.FETCH_FAILED);
  }
  return response.json();
};

const callWikiApi = <T>(params: Record<string, string>): Promise<T> => {
  const apiUrl = new URL(`https://${BG3_WIKI_HOST}/w/api.php`);
  apiUrl.search = new URLSearchParams({
    ...params,
    format: "json",
    formatversion: "2",
  }).toString();
  return fetchJson<T>(apiUrl);
};

/**
 * Reads the wiki's Cargo tables. The API's cargoquery needs an account,
 * the export page doesn't.
 */
const callCargoExport = <T>(params: Record<string, string>): Promise<T> => {
  const exportUrl = new URL(`https://${BG3_WIKI_HOST}/w/index.php`);
  exportUrl.search = new URLSearchParams({
    title: "Special:CargoExport",
    format: "json",
    ...params,
  }).toString();
  return fetchJson<T>(exportUrl);
};

type WikiQueryPage = NonNullable<
  NonNullable<WikiImageInfoResponse["query"]>["pages"]
>[number];

/**
 * Queries pages by title, 50 at a time, all batches at once, and follows the
 * redirects. Gives for each requested title the page it leads to, if found.
 * Never throws: a failed batch only leaves its titles out.
 */
const queryPagesByTitle = async (
  titles: string[],
  params: Record<string, string> = {},
): Promise<Map<string, WikiQueryPage>> => {
  const uniqueTitles = [...new Set(titles)];
  const batches: string[][] = [];
  for (let i = 0; i < uniqueTitles.length; i += MAX_TITLES_PER_REQUEST) {
    batches.push(uniqueTitles.slice(i, i + MAX_TITLES_PER_REQUEST));
  }

  const results = await Promise.all(
    batches.map(async (batch) => {
      try {
        const data = await callWikiApi<WikiImageInfoResponse>({
          ...params,
          action: "query",
          titles: batch.join("|"),
          redirects: "1",
        });

        // The API may rename titles ("File:Portrait_Kagha.png" -> "File:Portrait Kagha.png"),
        // then follow redirects ("File:Kagha portrait.png" -> "File:Portrait Kagha.png")
        const toMap = (renames: { from: string; to: string }[] = []) =>
          new Map(renames.map(({ from, to }) => [from, to]));
        const normalizedTitles = toMap(data.query?.normalized);
        const redirectedTitles = toMap(data.query?.redirects);
        const pagesByTitle = new Map(
          (data.query?.pages ?? [])
            .filter((page) => !page.missing)
            .map((page) => [page.title, page]),
        );

        return batch.flatMap((title) => {
          const normalized = normalizedTitles.get(title) ?? title;
          const page = pagesByTitle.get(
            redirectedTitles.get(normalized) ?? normalized,
          );
          return page ? [[title, page] as const] : [];
        });
      } catch (error) {
        console.error(error);
        return [];
      }
    }),
  );

  return new Map(results.flat());
};

/**
 * URLs of the image files that exist on the wiki, by requested file name.
 * Never throws: a missing picture should never prevent an import.
 */
const findImageUrls = async (
  fileNames: string[],
): Promise<Map<string, string>> => {
  const pages = await queryPagesByTitle(fileNames, {
    prop: "imageinfo",
    iiprop: "url",
  });
  return new Map(
    [...pages].flatMap(([fileName, page]) => {
      const url = page.imageinfo?.[0]?.url;
      return url ? [[fileName, url] as const] : [];
    }),
  );
};

/**
 * Title of the page each title leads to: "Firebolt" -> "Fire Bolt".
 * Titles that don't exist are left out.
 */
const resolveRedirects = async (
  titles: string[],
): Promise<Map<string, string>> =>
  new Map(
    [...(await queryPagesByTitle(titles))].map(([title, page]) => [
      title,
      page.title,
    ]),
  );

/** URL of the first image file that exists on the wiki */
const findImageUrl = async (
  fileNames: string[],
): Promise<string | undefined> => {
  const urls = await findImageUrls(fileNames);
  return fileNames.map((name) => urls.get(name)).find(Boolean);
};

/**
 * Fetches the wikitext of a wiki page.
 * Throws a Bg3WikiError when the page or the request is invalid.
 */
const fetchWikiPageByTitle = async (
  pageTitle: string,
): Promise<{ wikitext: string; title: string }> => {
  let data: WikiParseResponse;
  try {
    data = await callWikiApi<WikiParseResponse>({
      action: "parse",
      page: pageTitle,
      prop: "wikitext",
      redirects: "1",
    });
  } catch {
    throw new Bg3WikiError(Bg3WikiErrorEnum.FETCH_FAILED);
  }

  if (data.error || !data.parse) {
    throw new Bg3WikiError(
      data.error?.code === "missingtitle"
        ? Bg3WikiErrorEnum.PAGE_NOT_FOUND
        : Bg3WikiErrorEnum.FETCH_FAILED,
    );
  }

  return data.parse;
};

/**
 * Wikitext of the "/Combat" subpage bosses keep their fight stats and
 * actions on, if any.
 * Never throws: the character is still imported from its main page.
 */
const fetchCombatSubpage = async (
  wikitext: string,
): Promise<string | undefined> => {
  const subpage = findCombatSubpage(wikitext);
  if (!subpage) {
    return undefined;
  }
  try {
    return (await fetchWikiPageByTitle(subpage)).wikitext;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

/**
 * Infobox fields of a page, undefined when it has none: a boss may keep
 * them on its main page, its "/Combat" subpage, or both.
 */
const parseOptionalInfobox = (
  wikitext: string | undefined,
): Record<string, string> | undefined => {
  if (!wikitext) {
    return undefined;
  }
  try {
    return parseInfobox(wikitext);
  } catch (error) {
    if (!(error instanceof Bg3WikiError)) {
      throw error;
    }
    return undefined;
  }
};

/**
 * The weapons the actions are made with ("Club"), for their damage.
 * Never throws: the actions are still imported, dealing "weapon" damage.
 */
const fetchWeapons = async (items: string[]): Promise<WikiWeaponRow[]> => {
  const where = buildPagesWhere(items);
  if (!where) {
    return [];
  }
  try {
    return await callCargoExport<WikiWeaponRow[]>({
      tables: "weapons",
      fields: WEAPON_FIELDS,
      where,
      limit: "500",
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Actions listed on the first page having some ("Attacks and actions"),
 * with their details from the actions table, and the damage of the weapons
 * they're made with (the character's abilities choose the one of a finesse
 * weapon).
 * Never throws: the character is still imported without its actions.
 */
const fetchActions = async (
  wikitexts: string[],
  abilities: Partial<Record<AbilityEnum, number>>,
): Promise<CombatAction[]> => {
  try {
    const listedBoxes =
      wikitexts.map(extractFeatureBoxes).find((found) => found.length) ?? [];
    if (!listedBoxes.length) {
      return [];
    }
    // The actions table only knows the actual pages, not their redirects
    const pages = await resolveRedirects(listedBoxes.map((box) => box.page));
    const boxes = uniqueFeatureBoxes(
      listedBoxes.map((box) => ({
        ...box,
        page: pages.get(box.page) ?? box.page,
      })),
    );
    const where = buildPagesWhere(boxes.map((box) => box.page));
    if (!where) {
      return [];
    }

    const rows = await callCargoExport<WikiActionRow[]>({
      tables: "actions",
      fields: ACTION_FIELDS,
      where,
      limit: "500",
    });
    const [iconUrls, weapons] = await Promise.all([
      findImageUrls(
        rows.map(getActionIconFile).filter((file): file is string => !!file),
      ),
      fetchWeapons(findWeaponItems(boxes, rows)),
    ]);

    return buildCombatActions(boxes, rows, { iconUrls, weapons, abilities });
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * The infobox's resistances, as passives with their icon.
 * Never throws: findImageUrls doesn't.
 */
const fetchResistances = async (values: string[]): Promise<CombatPassive[]> => {
  const iconFiles = values
    .map(parseResistance)
    .filter((resistance): resistance is Resistance => !!resistance)
    .map(getResistanceIconFile);
  return buildResistancePassives(values, await findImageUrls(iconFiles));
};

/** The error to show; an unexpected one is logged */
const toErrorCode = (error: unknown): Bg3WikiErrorEnum => {
  if (error instanceof Bg3WikiError) {
    return error.code;
  }
  console.error(error);
  return Bg3WikiErrorEnum.FETCH_FAILED;
};

/**
 * Runs on the server: bg3.wiki doesn't allow cross-origin requests
 * from the browser.
 */
export const createCharacterFromWiki = async (
  url: string,
): Promise<CreateCharacterFromWikiResult> => {
  try {
    const { wikitext, title } = await fetchWikiPageByTitle(
      extractPageTitleFromUrl(url),
    );
    const combatWikitext = await fetchCombatSubpage(wikitext);
    const pageFields = parseOptionalInfobox(wikitext);
    const combatFields = parseOptionalInfobox(combatWikitext);
    if (!pageFields && !combatFields) {
      throw new Bg3WikiError(Bg3WikiErrorEnum.NO_INFOBOX);
    }
    const fields =
      pageFields && combatFields
        ? mergeCombatInfobox(pageFields, combatFields)
        : (combatFields ?? pageFields)!;
    const character = buildCharacterFromInfobox(fields, title);
    const [imageUrl, actions, resistances] = await Promise.all([
      findImageUrl(getImageFileCandidates(fields)),
      // The subpage is the one about the fight: its actions win. The
      // character's abilities choose the one of a finesse weapon.
      fetchActions(
        combatWikitext ? [combatWikitext, wikitext] : [wikitext],
        character.abilities ?? {},
      ),
      fetchResistances(getInfoboxList(fields, "resistances")),
    ]);
    const passives = [
      ...buildPassives(getInfoboxList(fields, "passives")),
      ...resistances,
    ];

    return {
      character: {
        ...character,
        ...(imageUrl ? { imageUrl } : {}),
        ...(actions.length ? { actions } : {}),
        ...(passives.length ? { passives } : {}),
      },
    };
  } catch (error) {
    return { error: toErrorCode(error) };
  }
};

/**
 * The passive of a wiki page. Runs on the server, like
 * createCharacterFromWiki. Only the page request may fail: a missing icon
 * never prevents the import.
 */
export const createPassiveFromWiki = async (
  url: string,
): Promise<CreatePassiveFromWikiResult> => {
  try {
    const { wikitext, title } = await fetchWikiPageByTitle(
      extractPageTitleFromUrl(url),
    );
    const fields = parseTemplate(wikitext, PASSIVE_PAGE_TEMPLATE);
    if (!fields) {
      throw new Bg3WikiError(Bg3WikiErrorEnum.NO_PASSIVE);
    }

    const passive = buildPassiveFromPage(title, fields);
    // A passive of our list already has its icon
    const iconUrl =
      !passive.bg3PassiveId && fields.icon
        ? await findImageUrl([toFileTitle(fields.icon)])
        : undefined;
    return { passive: iconUrl ? { ...passive, iconUrl } : passive };
  } catch (error) {
    return { error: toErrorCode(error) };
  }
};
