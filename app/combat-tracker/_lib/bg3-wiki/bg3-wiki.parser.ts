import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { CombatAction } from "@/app/_lib/types/combat-action.type";
import { BG3_WIKI_HOST } from "./bg3-wiki.images";

export { BG3_WIKI_HOST, isBg3WikiImage } from "./bg3-wiki.images";

/** A character read from the wiki: the id is the one of the edited character */
export type WikiCharacter = Omit<CombatCharacter, "id">;
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

  try {
    return decodeURIComponent(match[1]);
  } catch {
    // Malformed escape sequence, e.g. a bare "%"
    throw new Bg3WikiError(Bg3WikiErrorEnum.INVALID_URL);
  }
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

/** Footnotes and editor notes: they never hold the value itself */
const NOTE_TEMPLATES =
  /^(ref|note|efn|fn|sic|cn|tbd|verify|citation needed|cite.*)$/i;

/**
 * Keeps what a template displays: its last unnamed argument.
 * "{{SAI|Darkvision}}" -> "Darkvision", "{{ref|footnote}}" -> "",
 * "{{SAI|[[Darkvision|Dark vision]]}}" -> "[[Darkvision|Dark vision]]".
 */
const renderTemplate = (template: string): string => {
  // Pipes inside [[Link|Label]] don't separate arguments
  const [name, ...args] = splitTopLevelParams(template.slice(2, -2));
  if (NOTE_TEMPLATES.test(name.trim())) {
    return "";
  }
  // Named arguments ("size=20") are options, not displayed text
  const unnamedArgs = args.filter((arg) => !/^[^=[\]]*=/.test(arg));
  return unnamedArgs.at(-1)?.trim() ?? "";
};

/** Replaces {{templates}} by their text, innermost first (nested ones too). */
const stripTemplates = (value: string): string => {
  let previous;
  do {
    previous = value;
    value = value.replace(/\{\{[^{}]*\}\}/g, renderTemplate);
  } while (value !== previous);
  return value;
};

/**
 * "[[Elf|Elven]]" -> "Elven", "[[Druid]]" -> "Druid",
 * "Fighter{{ref|footnote}}" -> "Fighter", strips HTML comments and <ref>s.
 */
export const stripWikiMarkup = (value: string): string =>
  stripTemplates(value)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<ref[^>]*\/>|<ref[^>]*>[\s\S]*?<\/ref>/g, "")
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1")
    .replace(/'{2,}/g, "")
    .trim();

/**
 * Honour value if any, otherwise Tactician, otherwise the plain field.
 * A value that is only markup (comment, footnote...) counts as missing.
 */
export const getHighestDifficultyValue = (
  fields: Record<string, string>,
  field: string,
): string | undefined => {
  for (const prefix of DIFFICULTY_PREFIXES) {
    const value = stripWikiMarkup(fields[`${prefix}${field}`] ?? "");
    if (value) {
      return value;
    }
  }
  return undefined;
};

/**
 * Bosses keep their fight stats on a "/Combat" subpage, the main page only
 * describes them: the subpage's fields win, with all their difficulty
 * variants (a main page "h hp" must not beat a subpage "hp").
 */
export const mergeCombatInfobox = (
  pageFields: Record<string, string>,
  combatFields: Record<string, string>,
): Record<string, string> => {
  // "e hp" (Explorer), "t hp" (Tactician), "h hp" (Honour) -> "hp"
  const baseName = (field: string) => field.replace(/^[eth] /, "");
  const combatBaseNames = new Set(Object.keys(combatFields).map(baseName));
  return {
    ...Object.fromEntries(
      Object.entries(pageFields).filter(
        ([field]) => !combatBaseNames.has(baseName(field)),
      ),
    ),
    ...combatFields,
  };
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
 * Spell slots are keyed by their level, like the ones added manually:
 * "spell2" -> "2", other resources keep their name ("wldshp").
 */
export const normalizeResourceName = (name: string): string =>
  name.trim().replace(/^spell(\d+)$/i, "$1");

/** "spell1:4, spell2:3, wldshp:2" -> { "1": 4, "2": 3, "wldshp": 2 } */
export const parseResources = (
  value: string | undefined,
): Record<string, number> => {
  const resources: Record<string, number> = {};
  for (const entry of splitList(value)) {
    const [rawName, rawCount] = entry.split(":").map((part) => part.trim());
    if (!rawName) {
      continue;
    }
    // "chaoat" alone is a single use
    resources[normalizeResourceName(rawName)] = rawCount
      ? toNumber(rawCount)
      : 1;
  }
  return resources;
};

/**
 * Image file names from the infobox, best first: the portrait (small,
 * square), then the in-game render.
 * "Portrait Kagha.png" -> "File:Portrait Kagha.png"
 */
export const getImageFileCandidates = (
  fields: Record<string, string>,
): string[] =>
  ["portrait", "in game"]
    .map((field) => fields[field])
    .filter((fileName): fileName is string => !!fileName)
    .map((fileName) => `File:${fileName.replace(/^(File|Image):/i, "")}`);

/**
 * "Minthara, Baenre Paladin" -> "https://bg3.wiki/wiki/Minthara,_Baenre_Paladin"
 * "Who? What?" -> "https://bg3.wiki/wiki/Who%3F_What%3F"
 * Everything is escaped ("?", "#", "&" would break the link) except the
 * characters MediaWiki keeps readable in its own links.
 */
export const buildWikiLink = (pageTitle: string): string => {
  const path = encodeURIComponent(pageTitle.replaceAll(" ", "_")).replace(
    /%(2C|3A|2F)/gi,
    (escaped) => decodeURIComponent(escaped),
  );
  return `https://${BG3_WIKI_HOST}/wiki/${path}`;
};

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

/** Builds the character from the fields returned by parseInfobox */
export const buildCharacterFromInfobox = (
  fields: Record<string, string>,
  pageTitle: string,
  {
    imageUrl,
    actions = [],
  }: { imageUrl?: string; actions?: CombatAction[] } = {},
): WikiCharacter => {
  const get = (field: string) => getHighestDifficultyValue(fields, field);

  const hp = toNumber(get("hp"));
  const shortDescription = buildShortDescription(get);
  const spellSlotsLeft = parseResources(get("resources"));
  const passives = [
    ...splitList(get("passives")),
    ...splitList(get("resistances")),
  ];

  return {
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
    ...(actions.length ? { actions } : {}),
  };
};
