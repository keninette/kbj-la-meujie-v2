import { CombatCharacter } from "@/app/_lib/types/combat-character.type";

export const BG3_WIKI_HOST = "bg3.wiki";
const INFOBOX_NAME = "Infobox creature";

/**
 * Difficulty prefixes used by the {{Infobox creature}} template, from the
 * most to the least preferred: Honour ("h "), then Tactician ("t "),
 * then the plain field (Balanced, or a value shared by every difficulty).
 */
const DIFFICULTY_PREFIXES = ["h ", "t ", ""];

export enum Bg3WikiErrorEnum {
  INVALID_URL = "invalidUrl",
  PAGE_NOT_FOUND = "pageNotFound",
  NO_INFOBOX = "noInfobox",
  FETCH_FAILED = "fetchFailed",
}

export class Bg3WikiError extends Error {
  constructor(public readonly code: Bg3WikiErrorEnum) {
    super(code);
  }
}

/**
 * "https://bg3.wiki/wiki/Kagha" -> "Kagha"
 * "https://bg3.wiki/wiki/Minthara%2C_Baenre_Paladin" -> "Minthara,_Baenre_Paladin"
 */
export const extractPageTitleFromUrl = (rawUrl: string): string => {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    throw new Bg3WikiError(Bg3WikiErrorEnum.INVALID_URL);
  }

  const isWikiHost =
    url.hostname === BG3_WIKI_HOST || url.hostname === `www.${BG3_WIKI_HOST}`;
  const match = url.pathname.match(/^\/wiki\/(.+)$/);
  if (!isWikiHost || !match) {
    throw new Bg3WikiError(Bg3WikiErrorEnum.INVALID_URL);
  }

  return decodeURIComponent(match[1]);
};

/**
 * Returns the content between "{{Infobox creature" and its matching "}}",
 * taking nested templates into account.
 */
const extractInfoboxContent = (wikitext: string): string | null => {
  const start = wikitext.search(/\{\{\s*Infobox creature/i);
  if (start === -1) {
    return null;
  }

  let depth = 0;
  for (let i = start; i < wikitext.length - 1; i++) {
    const pair = wikitext.slice(i, i + 2);
    if (pair === "{{") {
      depth++;
      i++;
    } else if (pair === "}}") {
      depth--;
      i++;
      if (depth === 0) {
        return wikitext.slice(start + 2, i - 1);
      }
    }
  }

  return null;
};

/**
 * Splits the infobox on top-level "|" only, so that pipes inside
 * [[Link|Label]] or nested {{Templates|...}} are kept intact.
 */
const splitTopLevelParams = (content: string): string[] => {
  const params: string[] = [];
  let depth = 0;
  let current = "";

  for (let i = 0; i < content.length; i++) {
    const pair = content.slice(i, i + 2);
    if (pair === "{{" || pair === "[[") {
      depth++;
      current += pair;
      i++;
    } else if (pair === "}}" || pair === "]]") {
      depth--;
      current += pair;
      i++;
    } else if (content[i] === "|" && depth === 0) {
      params.push(current);
      current = "";
    } else {
      current += content[i];
    }
  }
  params.push(current);

  return params;
};

export const parseInfobox = (wikitext: string): Record<string, string> => {
  const content = extractInfoboxContent(wikitext);
  if (content === null) {
    throw new Bg3WikiError(Bg3WikiErrorEnum.NO_INFOBOX);
  }

  const [templateName, ...params] = splitTopLevelParams(content);
  if (templateName.trim().toLowerCase() !== INFOBOX_NAME.toLowerCase()) {
    throw new Bg3WikiError(Bg3WikiErrorEnum.NO_INFOBOX);
  }

  const fields: Record<string, string> = {};
  for (const param of params) {
    const separatorIndex = param.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }
    const key = param.slice(0, separatorIndex).trim().toLowerCase();
    const value = param.slice(separatorIndex + 1).trim();
    if (key && value) {
      fields[key] = value;
    }
  }

  return fields;
};

/** Removes {{templates}}, innermost first so nested ones go too. */
const stripTemplates = (value: string): string => {
  let previous;
  do {
    previous = value;
    value = value.replace(/\{\{[^{}]*\}\}/g, "");
  } while (value !== previous);
  return value;
};

/**
 * "[[Elf|Elven]]" -> "Elven", "[[Druid]]" -> "Druid",
 * "Fighter{{ref|footnote}}" -> "Fighter", strips HTML comments and <ref>s.
 */
const stripWikiMarkup = (value: string): string =>
  stripTemplates(value)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<ref[^>]*\/>|<ref[^>]*>[\s\S]*?<\/ref>/g, "")
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1")
    .replace(/'{2,}/g, "")
    .trim();

/** Honour value if any, otherwise Tactician, otherwise the plain field. */
export const getHighestDifficultyValue = (
  fields: Record<string, string>,
  field: string,
): string | undefined => {
  for (const prefix of DIFFICULTY_PREFIXES) {
    const value = fields[`${prefix}${field}`];
    if (value !== undefined) {
      return stripWikiMarkup(value);
    }
  }
  return undefined;
};

const toNumber = (value: string | undefined): number => {
  const parsed = parseInt(value ?? "", 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const splitList = (value: string | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

/**
 * "spell1:4, spell2:3, wldshp:2" -> { "1": 4, "2": 3, "wldshp": 2 }
 * Spell slots are keyed by their level, like the ones added manually.
 */
export const parseResources = (
  value: string | undefined,
): Record<string, number> => {
  const resources: Record<string, number> = {};
  for (const entry of splitList(value)) {
    const [rawName, rawCount] = entry.split(":").map((part) => part.trim());
    if (!rawName) {
      continue;
    }
    const name = rawName.replace(/^spell(\d+)$/i, "$1");
    resources[name] = toNumber(rawCount);
  }
  return resources;
};

/**
 * Image file names from the infobox, best first: the portrait (small,
 * square), then the in-game render.
 * "Portrait Kagha.png" -> "File:Portrait Kagha.png"
 */
export const getImageFileCandidates = (wikitext: string): string[] => {
  const fields = parseInfobox(wikitext);
  return ["portrait", "in game"]
    .map((field) => fields[field])
    .filter((fileName): fileName is string => !!fileName)
    .map((fileName) => `File:${fileName.replace(/^(File|Image):/i, "")}`);
};

/**
 * Images hosted by the wiki can go through Next's image optimisation
 * (allowed in next.config.ts). Any other URL typed by hand can't.
 */
export const isBg3WikiImage = (url: string): boolean =>
  url.startsWith(`https://${BG3_WIKI_HOST}/w/images/`);

/** "Minthara, Baenre Paladin" ->"https://bg3.wiki/wiki/Minthara,_Baenre_Paladin" */
export const buildWikiLink = (pageTitle: string): string =>
  `https://${BG3_WIKI_HOST}/wiki/${encodeURI(pageTitle.replaceAll(" ", "_"))}`;

/**
 * "subrace (or race) class level N", missing parts are skipped:
 * subrace "Wood elf", race "Elf", class "Druid", level "5"
 * -> "Wood elf Druid level 5"
 */
export const buildShortDescription = (
  get: (field: string) => string | undefined,
): string => {
  const level = get("level");
  return [
    get("subrace") || get("race"),
    get("class"),
    level ? `level ${level}` : undefined,
  ]
    .filter(Boolean)
    .join(" ");
};

export const buildCharacterFromWikitext = (
  wikitext: string,
  pageTitle: string,
  id: string,
  imageUrl?: string,
): CombatCharacter => {
  const fields = parseInfobox(wikitext);
  const get = (field: string) => getHighestDifficultyValue(fields, field);

  const hp = toNumber(get("hp"));
  const shortDescription = buildShortDescription(get);
  const spellSlotsLeft = parseResources(get("resources"));
  const passives = [
    ...splitList(get("passives")),
    ...splitList(get("resistances")),
  ];

  return {
    id,
    name: get("name") || pageTitle.replaceAll("_", " "),
    ...(shortDescription ? { shortDescription } : {}),
    ...(imageUrl ? { imageUrl } : {}),
    wikiLink: buildWikiLink(pageTitle),
    hp,
    maxHp: hp,
    isDying: false,
    isDead: false,
    isNpc: true,
    deathSaveThrowsLeft: 3,
    ac: toNumber(get("ac")),
    // Rolled manually by the game master
    initiativeScore: 0,
    ...(Object.keys(spellSlotsLeft).length ? { spellSlotsLeft } : {}),
    ...(passives.length ? { passives } : {}),
  };
};
