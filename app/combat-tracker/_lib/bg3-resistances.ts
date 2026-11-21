import {
  DAMAGE_TYPES,
  DamageTypeEnum,
} from "@/app/_lib/enums/damage-type.enum";

/**
 * Resistances, as written in the infobox: "<damage type> <keyword>", read
 * like the wiki's Template:Resistance does. "wording" and "iconSuffix" give
 * its name ("Resistant to Non-Magical Fire") and icon ("Fire Resistance NM.png").
 * The french wordings are in the "combatTracker" dictionary, under
 * "resistance.<id>": use getPassiveText() to read them.
 */
const RESISTANCE_KINDS = [
  {
    id: "vulnerable",
    keywords: ["vuln", "vulnerable", "vulnerability"],
    wording: "Vulnerable to",
    iconSuffix: "Vulnerability",
  },
  {
    id: "resistantNm",
    keywords: [
      "resist",
      "resistant",
      "resistance",
      "resist nm",
      "resistant nm",
      "resistance nm",
    ],
    wording: "Resistant to Non-Magical",
    iconSuffix: "Resistance NM",
  },
  {
    id: "resistantM",
    keywords: ["magical", "resist m", "resistant m", "resistance m"],
    wording: "Resistant to Magical",
    iconSuffix: "Resistance M",
  },
  {
    id: "resistantFull",
    keywords: [
      "double",
      "full",
      "resist double",
      "resistant double",
      "resistance double",
      "resist full",
      "resistant full",
      "resistance full",
    ],
    wording: "Resistant to all",
    iconSuffix: "Resistance Full",
  },
  {
    id: "immuneFull",
    keywords: ["immune", "immunity", "immune full", "immunity full"],
    wording: "Immune to all",
    iconSuffix: "Immunity",
  },
  {
    id: "immuneNm",
    keywords: ["immune nm", "immunity nm"],
    wording: "Immune to Non-Magical",
    iconSuffix: "Immunity NM",
  },
  {
    id: "immuneNmPlus",
    keywords: ["immune nm plus", "immunity nm plus"],
    wording: "Immune to Non-Magical and Resistant to Magical",
    iconSuffix: "Immunity NM Plus",
  },
] as const;

type ResistanceKind = (typeof RESISTANCE_KINDS)[number];

export type Resistance = { kind: ResistanceKind; type: DamageTypeEnum };

/** "fire" -> "Fire" */
const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

/**
 * "fire resistance nm" -> Resistant to Non-Magical Fire.
 * Undefined for an unknown damage type or keyword.
 */
export const parseResistance = (value: string): Resistance | undefined => {
  const [type, ...keyword] = value.trim().toLowerCase().split(/\s+/);
  const kind = RESISTANCE_KINDS.find((kind) =>
    (kind.keywords as readonly string[]).includes(keyword.join(" ")),
  );
  return kind && DAMAGE_TYPES.includes(type as DamageTypeEnum)
    ? { kind, type: type as DamageTypeEnum }
    : undefined;
};

/** Its name on the wiki: "Resistant to Non-Magical Fire" */
export const getResistanceName = ({ kind, type }: Resistance): string =>
  `${kind.wording} ${capitalize(type)}`;

/** Its icon: "File:Fire Resistance NM.png" */
export const getResistanceIconFile = ({ kind, type }: Resistance): string =>
  `File:${capitalize(type)} ${kind.iconSuffix}.png`;

/** The resistance a passive's name stands for, if any */
export const findResistanceByName = (name: string): Resistance | undefined =>
  RESISTANCE_KINDS.flatMap((kind) =>
    DAMAGE_TYPES.map((type) => ({ kind, type })),
  ).find((resistance) => getResistanceName(resistance) === name);
