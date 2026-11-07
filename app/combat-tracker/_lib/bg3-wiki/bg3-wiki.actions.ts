"use server";

import { CombatAction } from "@/app/_lib/types/combat-action.type";
import {
  BG3_WIKI_HOST,
  Bg3WikiError,
  Bg3WikiErrorEnum,
  buildCharacterFromInfobox,
  extractPageTitleFromUrl,
  getImageFileCandidates,
  mergeCombatInfobox,
  parseInfobox,
  WikiCharacter,
} from "./bg3-wiki.parser";
import {
  ACTION_FIELDS,
  buildActionsWhere,
  buildCombatActions,
  extractFeatureBoxes,
  findCombatSubpage,
  getActionIconFile,
  WikiActionRow,
} from "./bg3-wiki-combat-actions.parser";

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

/**
 * URLs of the image files that exist on the wiki, by requested file name.
 * Never throws: a missing picture should never prevent an import.
 */
const findImageUrls = async (
  fileNames: string[],
): Promise<Map<string, string>> => {
  const urls = new Map<string, string>();
  const uniqueNames = [...new Set(fileNames)];

  for (let i = 0; i < uniqueNames.length; i += MAX_TITLES_PER_REQUEST) {
    const batch = uniqueNames.slice(i, i + MAX_TITLES_PER_REQUEST);
    try {
      const data = await callWikiApi<WikiImageInfoResponse>({
        action: "query",
        titles: batch.join("|"),
        prop: "imageinfo",
        iiprop: "url",
        // A file name may redirect to the actual picture
        redirects: "1",
      });

      // The API may rename titles ("File:Portrait_Kagha.png" -> "File:Portrait Kagha.png"),
      // then follow redirects ("File:Kagha portrait.png" -> "File:Portrait Kagha.png")
      const toMap = (renames: { from: string; to: string }[] = []) =>
        new Map(renames.map(({ from, to }) => [from, to]));
      const normalizedTitles = toMap(data.query?.normalized);
      const redirectedTitles = toMap(data.query?.redirects);
      const resolveTitle = (name: string) => {
        const normalized = normalizedTitles.get(name) ?? name;
        return redirectedTitles.get(normalized) ?? normalized;
      };
      const urlsByTitle = new Map(
        (data.query?.pages ?? [])
          .filter((page) => !page.missing && page.imageinfo?.[0]?.url)
          .map((page) => [page.title, page.imageinfo![0].url]),
      );

      for (const name of batch) {
        const url = urlsByTitle.get(resolveTitle(name));
        if (url) {
          urls.set(name, url);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return urls;
};

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
 * Actions listed on the first page having some ("Attacks and actions"),
 * with their details from the actions table.
 * Never throws: the character is still imported without its actions.
 */
const fetchActions = async (wikitexts: string[]): Promise<CombatAction[]> => {
  try {
    const boxes =
      wikitexts.map(extractFeatureBoxes).find((found) => found.length) ?? [];
    if (!boxes.length) {
      return [];
    }

    const rows = await callCargoExport<WikiActionRow[]>({
      tables: "actions",
      fields: ACTION_FIELDS,
      where: buildActionsWhere(boxes.map((box) => box.page)),
      limit: "500",
    });
    const iconUrls = await findImageUrls(
      rows.map(getActionIconFile).filter((file): file is string => !!file),
    );

    return buildCombatActions(boxes, rows, iconUrls);
  } catch (error) {
    console.error(error);
    return [];
  }
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
    const fields = combatWikitext
      ? mergeCombatInfobox(parseInfobox(wikitext), parseInfobox(combatWikitext))
      : parseInfobox(wikitext);
    const [imageUrl, actions] = await Promise.all([
      findImageUrl(getImageFileCandidates(fields)),
      fetchActions(combatWikitext ? [wikitext, combatWikitext] : [wikitext]),
    ]);

    return {
      character: buildCharacterFromInfobox(fields, title, {
        imageUrl,
        actions,
      }),
    };
  } catch (error) {
    if (error instanceof Bg3WikiError) {
      return { error: error.code };
    }
    console.error(error);
    return { error: Bg3WikiErrorEnum.FETCH_FAILED };
  }
};
