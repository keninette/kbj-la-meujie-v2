import {
  CombatAction,
  CombatActionDamage,
} from "@/app/_lib/types/combat-action.type";
import { AbilityEnum } from "@/app/_lib/enums/ability.enum";
import {
  DAMAGE_TYPES,
  DamageTypeEnum,
} from "@/app/_lib/enums/damage-type.enum";
import {
  buildWikiLink,
  normalizeResourceName,
  splitTopLevelParams,
  stripWikiMarkup,
  toFileTitle,
} from "./bg3-wiki.parser";

/**
 * A "{{Feature box|Moonbeam}}" from a character page: the page of an action
 * the character can use, with optional overrides for this character.
 */
export type FeatureBox = {
  page: string;
  item?: string;
  cost?: string;
  recharge?: string;
};

/** A row of the wiki's "actions" Cargo table, as exported in JSON */
export type WikiActionRow = {
  page: string;
  name?: string | null;
  type?: string | null;
  cost?: string | null;
  "spell level"?: number | string | null;
  "damage 1"?: string | null;
  "damage 1 type"?: string | null;
  "damage 2"?: string | null;
  "damage 2 type"?: string | null;
  "damage 3"?: string | null;
  "damage 3 type"?: string | null;
  "damage 4"?: string | null;
  "damage 4 type"?: string | null;
  save?: string | null;
  "is concentration"?: number | boolean | null;
  recharge?: string | null;
  brief?: string | null;
  description?: string | null;
  "hotbar icon"?: string | null;
};

/** Fields of the "actions" table read by WikiActionRow */
export const ACTION_FIELDS = [
  "_pageName=page",
  "name",
  "type",
  "cost",
  "spell_level",
  "damage_1",
  "damage_1_type",
  "damage_2",
  "damage_2_type",
  "damage_3",
  "damage_3_type",
  "damage_4",
  "damage_4_type",
  "save",
  "is_concentration",
  "recharge",
  "brief",
  "description",
  "hotbar_icon",
].join(",");

/**
 * A row of the wiki's "weapons" Cargo table: the damage of a "Main Hand
 * Attack" made with it. Its damage includes the enchantment ("1d8 + 1").
 */
export type WikiWeaponRow = {
  page: string;
  damage?: string | null;
  "damage type"?: string | null;
  "versatile damage"?: string | null;
  "extra damage"?: string | null;
  "extra damage type"?: string | null;
  "extra damage 2"?: string | null;
  "extra damage 2 type"?: string | null;
  finesse?: number | boolean | null;
  "melee or ranged"?: string | null;
};

/** Fields of the "weapons" table read by WikiWeaponRow */
export const WEAPON_FIELDS = [
  "_pageName=page",
  "damage",
  "damage_type",
  "versatile_damage",
  "extra_damage",
  "extra_damage_type",
  "extra_damage_2",
  "extra_damage_2_type",
  "finesse",
  "melee_or_ranged",
].join(",");

/** The damage of an action dealing the damage of the weapon it is made with */
const WEAPON_DAMAGE = "weapon";

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

/** "Off-Hand_Attack_(Melee)" and "off-Hand Attack (Melee)" are the same page */
const normalizePageName = (page: string): string =>
  capitalize(page.replaceAll("_", " ").replace(/\s+/g, " ").trim());

/**
 * Compares page names without case: character pages may write them in
 * lowercase ("main hand attack") while the actions table has the real title
 * ("Main Hand Attack"), and the wiki has no redirect for these
 */
const isSamePage = (page: string, otherPage: string): boolean =>
  normalizePageName(page).toLowerCase() ===
  normalizePageName(otherPage).toLowerCase();

/**
 * The "Attacks and actions" section when the page has one (feature boxes
 * elsewhere may describe other things), else the whole page.
 */
const getActionsSection = (wikitext: string): string => {
  const heading = wikitext.match(/^(=+)\s*Attacks and actions\s*\1\s*$/im);
  if (!heading || heading.index === undefined) {
    return wikitext;
  }
  const level = heading[1].length;
  const rest = wikitext.slice(heading.index + heading[0].length);
  // Ends at the next heading of the same or a higher level
  const next = rest.search(
    new RegExp(`^={1,${level}}[^=].*={1,${level}}\\s*$`, "m"),
  );
  return next === -1 ? rest : rest.slice(0, next);
};

/**
 * Content of each feature box ("Main Hand Attack|item=dagger"), including the
 * ones holding nested templates ("item={{SAI|Dagger}}").
 */
const findFeatureBoxContents = (text: string): string[] => {
  const contents: string[] = [];
  // "Feature box", "feature_box", and "Reaction box" for reactions
  for (const match of text.matchAll(
    /\{\{\s*(?:feature|reaction)[ _]box\s*\|/gi,
  )) {
    const start = match.index + match[0].length;
    let depth = 1;
    let i = start;
    while (i < text.length && depth > 0) {
      const pair = text.slice(i, i + 2);
      if (pair === "{{" || pair === "}}") {
        depth += pair === "{{" ? 1 : -1;
        i += 2;
      } else {
        i++;
      }
    }
    // An unclosed box is ignored
    if (depth === 0) {
      contents.push(text.slice(start, i - 2));
    }
  }
  return contents;
};

/** Lists the same action with the same item once, in order */
export const uniqueFeatureBoxes = (boxes: FeatureBox[]): FeatureBox[] => {
  const seen = new Set<string>();
  return boxes.filter((box) => {
    const key = `${box.page.toLowerCase()}|${box.item ?? ""}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * "{{Feature box|Main Hand Attack|item=dagger}}" (or "{{Reaction box|…}}")
 * -> { page: "Main Hand Attack", item: "dagger" }
 * Duplicates (same action, same item) are listed once.
 */
export const extractFeatureBoxes = (wikitext: string): FeatureBox[] => {
  const boxes: FeatureBox[] = [];

  for (const content of findFeatureBoxContents(getActionsSection(wikitext))) {
    // Pipes inside [[Link|Label]] or {{Templates|…}} don't separate params
    const [rawPage, ...params] = splitTopLevelParams(content);
    const page = normalizePageName(stripWikiMarkup(rawPage));
    if (!page) {
      continue;
    }

    const box: FeatureBox = { page };
    for (const param of params) {
      const separatorIndex = param.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }
      const name = param.slice(0, separatorIndex).trim().toLowerCase();
      const trimmedValue = stripWikiMarkup(param.slice(separatorIndex + 1));
      if (
        trimmedValue &&
        (name === "item" || name === "cost" || name === "recharge")
      ) {
        box[name] = trimmedValue;
      }
    }

    boxes.push(box);
  }

  return uniqueFeatureBoxes(boxes);
};

/**
 * Bosses list their actions on a subpage:
 * "{{Main|Minthara/Combat}}" -> "Minthara/Combat"
 */
export const findCombatSubpage = (wikitext: string): string | undefined =>
  wikitext.match(/\{\{\s*Main\s*\|\s*([^|{}]+\/Combat)\s*\}\}/i)?.[1].trim();

/**
 * Cargo query matching the given pages (actions or weapons), without case
 * (see isSamePage). Titles holding a double quote can't be written in the
 * query and are left out: undefined when none is left.
 */
export const buildPagesWhere = (pages: string[]): string | undefined => {
  const quoted = pages
    .filter((page) => !page.includes('"'))
    .map((page) => `"${page.toLowerCase()}"`);
  return quoted.length
    ? `LOWER(_pageName) IN (${quoted.join(",")})`
    : undefined;
};

/**
 * "action, spell2" -> ["action", "2"], keyed like the spell slots.
 * A resource used several times keeps its amount: "layonh:2" -> "layonh:2".
 * The movement, all of it or a part: "movement", "half movement" ->
 * "movement:half", "movement m:6" (or "movement:6") -> "movement:6".
 */
export const parseCosts = (cost: string | null | undefined): string[] =>
  (cost ?? "")
    .split(",")
    .map((entry) => {
      const [name, amount] = entry.split(":").map((part) => part.trim());
      if (/^half movement$/i.test(name)) {
        return "movement:half";
      }
      if (/^movement( m)?$/i.test(name)) {
        return amount ? `movement:${amount}` : "movement";
      }
      const key = normalizeResourceName(name ?? "");
      return key && amount && amount !== "1" ? `${key}:${amount}` : key;
    })
    .filter(Boolean);

const decodeHtmlEntities = (value: string): string => {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    // Joins the dice to their damage type icon: "1d8&NoBreak;<icon>Fire".
    // The icon is removed, so it becomes a space: "1d8 Fire"
    nobreak: " ",
  };
  let previous;
  // Some text is escaped twice ("&amp;#8239;")
  do {
    previous = value;
    value = value.replace(
      /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
      (entity, code: string) => {
        if (code.startsWith("#")) {
          const codePoint = /^#x/i.test(code)
            ? parseInt(code.slice(2), 16)
            : parseInt(code.slice(1), 10);
          // A malformed code is kept as written
          return codePoint <= 0x10ffff
            ? String.fromCodePoint(codePoint)
            : entity;
        }
        return named[code.toLowerCase()] ?? entity;
      },
    );
  } while (value !== previous);
  return value;
};

/**
 * Turns an exported description (escaped HTML, icon images, wiki links...)
 * into plain text:
 * "receive <span…>[[File:Disadvantage Icon.png|…]]</span>&#8239;[[Disadvantage]] on…"
 * -> "receive Disadvantage on…"
 */
export const cleanDescription = (value: string | null | undefined): string => {
  const text = decodeHtmlEntities(value ?? "")
    // Only actual tags: "HP < 50%, else >" is text
    .replace(/<\/?[a-z][a-z0-9-]*(?:\s[^<>]*)?\/?>/gi, "")
    // Icons, which may hold a link: "[[File:x.png|alt=[[Attack Roll]]]]"
    .replace(/\[\[\s*(?:File|Image):(?:[^[\]]|\[\[[^[\]]*\]\])*\]\]/gi, "");

  return stripWikiMarkup(text).replace(/\s+/g, " ").trim();
};

/**
 * "Fire" -> fire. A type we don't know ("Weapon", when the weapon isn't
 * found) is left out.
 */
export const parseDamageType = (
  value: string | null | undefined,
): DamageTypeEnum | undefined =>
  DAMAGE_TYPES.find((type) => type === value?.trim().toLowerCase());

const parseDamages = (row: WikiActionRow): CombatActionDamage[] =>
  ([1, 2, 3, 4] as const).flatMap((index) => {
    const dice = row[`damage ${index}`]?.trim();
    const type = parseDamageType(row[`damage ${index} type`]);
    return dice ? [type ? { dice, type } : { dice }] : [];
  });

/** "1d8 + 1" -> "1d8+1"; nothing when empty */
const toDice = (value: string | null | undefined): string | undefined =>
  value?.replace(/\s+/g, "") || undefined;

/**
 * The ability added to a weapon's damage: DEX for a ranged weapon, FOR for a
 * melee one, the best of both for a finesse one (both when the scores aren't
 * known)
 */
export const getWeaponAbilities = (
  weapon: WikiWeaponRow,
  abilities: Partial<Record<AbilityEnum, number>>,
): AbilityEnum[] => {
  if (weapon.finesse) {
    const strength = abilities[AbilityEnum.STRENGTH];
    const dexterity = abilities[AbilityEnum.DEXTERITY];
    if (strength === undefined || dexterity === undefined) {
      return [AbilityEnum.STRENGTH, AbilityEnum.DEXTERITY];
    }
    return [
      dexterity > strength ? AbilityEnum.DEXTERITY : AbilityEnum.STRENGTH,
    ];
  }
  return [
    weapon["melee or ranged"]?.toLowerCase() === "ranged"
      ? AbilityEnum.DEXTERITY
      : AbilityEnum.STRENGTH,
  ];
};

/**
 * What a weapon deals: its damage, with its two-handed one if versatile and
 * the ability added, then its extra damages (e.g. fire), without ability.
 * Nothing when the weapon has no damage.
 */
export const getWeaponDamages = (
  weapon: WikiWeaponRow,
  abilities: Partial<Record<AbilityEnum, number>>,
): CombatActionDamage[] => {
  const dice = toDice(weapon.damage);
  if (!dice) {
    return [];
  }
  const versatileDice = toDice(weapon["versatile damage"]);
  const extras = (
    [
      [weapon["extra damage"], weapon["extra damage type"]],
      [weapon["extra damage 2"], weapon["extra damage 2 type"]],
    ] as const
  ).flatMap(([extraDice, type]) => {
    const extra = toDice(extraDice);
    return extra
      ? [definedOnly({ dice: extra, type: parseDamageType(type) })]
      : [];
  });

  return [
    definedOnly({
      dice,
      versatileDice,
      abilities: getWeaponAbilities(weapon, abilities),
      type: parseDamageType(weapon["damage type"]),
    }),
    ...extras,
  ];
};

const parseSpellLevel = (
  value: WikiActionRow["spell level"],
): number | undefined => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }
  if (value === "cantrip") {
    return 0;
  }
  const level = Number(value);
  return Number.isNaN(level) ? undefined : level;
};

/** Missing optional values are left out rather than stored as undefined */
const definedOnly = <T extends object>(value: T): T =>
  Object.fromEntries(
    Object.entries(value).filter(
      ([, field]) => field !== undefined && field !== false,
    ),
  ) as T;

export const buildCombatAction = (
  box: FeatureBox,
  row: WikiActionRow,
  iconUrl?: string,
  /** The damages of the box's item, which replace a "weapon" damage */
  weaponDamages: CombatActionDamage[] = [],
): CombatAction => {
  const damages = parseDamages(row).flatMap((damage) =>
    damage.dice.toLowerCase() === WEAPON_DAMAGE && weaponDamages.length
      ? weaponDamages
      : [damage],
  );
  return definedOnly({
    name: row.name || box.page,
    type: row.type || undefined,
    // The character page may override the generic cost and recharge
    costs: parseCosts(box.cost ?? row.cost),
    spellLevel: parseSpellLevel(row["spell level"]),
    damages: damages.length ? damages : undefined,
    save: row.save || undefined,
    isConcentration: !!row["is concentration"],
    recharge: box.recharge ?? (row.recharge || undefined),
    item: box.item ? capitalize(box.item) : undefined,
    description:
      cleanDescription(row.description) ||
      cleanDescription(row.brief) ||
      undefined,
    iconUrl,
    wikiLink: buildWikiLink(row.page),
  });
};

/** "Cure Wounds Unfaded Icon.webp" -> "File:Cure Wounds Unfaded Icon.webp" */
export const getActionIconFile = (row: WikiActionRow): string | undefined =>
  row["hotbar icon"] ? toFileTitle(row["hotbar icon"]) : undefined;

/**
 * One action per feature box, in the page's order. A box whose page isn't in
 * the actions table (a passive, a typo...) is left out. An attack made with
 * a weapon of the weapons table deals its damage, with the character's best
 * ability for a finesse one.
 */
export const buildCombatActions = (
  boxes: FeatureBox[],
  rows: WikiActionRow[],
  {
    iconUrls = new Map(),
    weapons = [],
    abilities = {},
  }: {
    iconUrls?: Map<string, string>;
    weapons?: WikiWeaponRow[];
    abilities?: Partial<Record<AbilityEnum, number>>;
  } = {},
): CombatAction[] =>
  boxes.flatMap((box) => {
    const pageRows = rows.filter((row) => isSamePage(row.page, box.page));
    // A page may store several rows: prefer the one named after it
    const row =
      pageRows.find((r) => r.name && isSamePage(r.name, box.page)) ??
      pageRows[0];
    if (!row) {
      return [];
    }
    const iconFile = getActionIconFile(row);
    const weapon = box.item
      ? weapons.find((w) => isSamePage(w.page, box.item!))
      : undefined;
    return [
      buildCombatAction(
        box,
        row,
        iconFile ? iconUrls.get(iconFile) : undefined,
        weapon ? getWeaponDamages(weapon, abilities) : [],
      ),
    ];
  });

/** The items of the boxes dealing their weapon's damage: "Club", "Dagger"… */
export const findWeaponItems = (
  boxes: FeatureBox[],
  rows: WikiActionRow[],
): string[] =>
  boxes.flatMap((box) => {
    const dealsWeaponDamage = rows.some(
      (row) =>
        isSamePage(row.page, box.page) &&
        parseDamages(row).some(
          (damage) => damage.dice.toLowerCase() === WEAPON_DAMAGE,
        ),
    );
    return box.item && dealsWeaponDamage ? [box.item] : [];
  });
