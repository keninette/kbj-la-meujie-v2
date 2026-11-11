import { ActionResourceTypeEnum } from "@/app/_lib/enums/action-resource-type.enum";

/**
 * What an action may spend besides the action economy, from bg3.wiki's
 * resource list (Module:Resource/data). The id is the key in
 * CombatCharacter.actionResourcesLeft and in the action costs; the aliases
 * are the other ways the wiki writes it, in lowercase.
 * The names are in the "combatTracker" dictionary: use getActionResourceName().
 */
export type Bg3ActionResource = {
  id: string;
  type: ActionResourceTypeEnum;
  aliases: string[];
  /** None for the spell slots: their level in a square, as in the game */
  iconUrl?: string;
};

const SPELL_SLOTS: Bg3ActionResource[] = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(
  (level) => ({
    id: String(level),
    type: ActionResourceTypeEnum.SPELL_SLOT,
    aliases: [`spell${level}`, `s${level}`, `level${level}`, `l${level}`],
  }),
);

const CLASS_RESOURCES: Bg3ActionResource[] = [
  {
    id: "shadowspell3",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["shadow spell", "ss3", "shadowlevel3", "sl3"],
    iconUrl: "https://bg3.wiki/w/images/9/98/Shadow_Spell_Slot_Icon.png",
  },
  {
    id: "wspell",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["wsp"],
    iconUrl: "https://bg3.wiki/w/images/6/6c/Warlock_Spell_Slot_Icon.webp",
  },
  {
    id: "wspell1",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["wsp1"],
    iconUrl: "https://bg3.wiki/w/images/6/6c/Warlock_Spell_Slot_Icon.webp",
  },
  {
    id: "wspell2",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["wsp2"],
    iconUrl: "https://bg3.wiki/w/images/6/6c/Warlock_Spell_Slot_Icon.webp",
  },
  {
    id: "wspell3",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["wsp3"],
    iconUrl: "https://bg3.wiki/w/images/6/6c/Warlock_Spell_Slot_Icon.webp",
  },
  {
    id: "wspell4",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["wsp4"],
    iconUrl: "https://bg3.wiki/w/images/6/6c/Warlock_Spell_Slot_Icon.webp",
  },
  {
    id: "wspell5",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["wsp5"],
    iconUrl: "https://bg3.wiki/w/images/6/6c/Warlock_Spell_Slot_Icon.webp",
  },
  {
    id: "wspell6",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["wsp6"],
    iconUrl: "https://bg3.wiki/w/images/6/6c/Warlock_Spell_Slot_Icon.webp",
  },
  {
    id: "arcarr",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["aa", "arcane arrow"],
    iconUrl: "https://bg3.wiki/w/images/5/51/Arcane_Arrow_Resource_Icon.png",
  },
  {
    id: "arcrec",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["ar", "arcane recovery"],
    iconUrl: "https://bg3.wiki/w/images/0/04/Arcane_Recovery_Charges_Icons.png",
  },
  {
    id: "bardin",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["bi", "bardic inspiration"],
    iconUrl:
      "https://bg3.wiki/w/images/b/be/Bardic_Inspiration_Resource_Icon.png",
  },
  {
    id: "bladesong",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["bs", "bsp", "bladesong power"],
    iconUrl: "https://bg3.wiki/w/images/1/12/Bladesong_Resource_Icon.png",
  },
  {
    id: "chadiv",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["cd", "channel divinity"],
    iconUrl: "https://bg3.wiki/w/images/3/3d/Channel_Divinity_Charges_Icon.png",
  },
  {
    id: "chaoat",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["co", "oath", "chao", "channel oath"],
    iconUrl: "https://bg3.wiki/w/images/4/4a/Channel_Oath_Icon.png",
  },
  {
    id: "cosmic",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["cos", "omen", "cosmic omen"],
    iconUrl: "https://bg3.wiki/w/images/a/a9/Cosmic_Omen_Resource_Icon.png",
  },
  {
    id: "eyestalk",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["es", "eyestalk action"],
    iconUrl: "https://bg3.wiki/w/images/2/2e/Red_Star_Icon.png",
  },
  {
    id: "fnginf",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["fi", "fungal infestation"],
    iconUrl:
      "https://bg3.wiki/w/images/1/18/Fungal_Infestation_Charge_Icon.png",
  },
  {
    id: "ki",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: [],
    iconUrl: "https://bg3.wiki/w/images/7/7f/Monk_Ki_Icon.png",
  },
  {
    id: "layonh",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["loh", "lh", "lay on hands"],
    iconUrl: "https://bg3.wiki/w/images/0/08/Lay_on_Hands_Resource_Icon.png",
  },
  {
    id: "lukpnt",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["luck", "lp", "luck point"],
    iconUrl: "https://bg3.wiki/w/images/6/6c/Luck_Point_Resource_Icon.png",
  },
  {
    id: "natrec",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["nr", "natural recovery"],
    iconUrl: "https://bg3.wiki/w/images/9/99/Natural_Recovery_Charges_Icon.png",
  },
  {
    id: "rage",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["rg"],
    iconUrl: "https://bg3.wiki/w/images/d/d6/Rage_Charges_Icons.png",
  },
  {
    id: "sp",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["srcpnt", "sorcery", "sorcery point"],
    iconUrl: "https://bg3.wiki/w/images/b/be/Sorcery_Points_Icons.png",
  },
  {
    id: "starmap",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["sm", "star map"],
    iconUrl: "https://bg3.wiki/w/images/7/7a/Star_Map_Resource_Icon.png",
  },
  {
    id: "supdie",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["sd", "superiority die"],
    iconUrl: "https://bg3.wiki/w/images/9/9f/Superiority_Die_d8_Icon.png",
  },
  {
    id: "toc",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["tides", "tides of chaos"],
    iconUrl: "https://bg3.wiki/w/images/2/29/Tides_of_Chaos_Resource_Icon.png",
  },
  {
    id: "wc",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["writhing", "writhing current"],
    iconUrl:
      "https://bg3.wiki/w/images/7/75/Writhing_Current_Resource_Icon.png",
  },
  {
    id: "wldshp",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["ws", "wildshape", "wild shape"],
    iconUrl: "https://bg3.wiki/w/images/b/b6/Wild_Shape_Charges_Icon.png",
  },
  {
    id: "warpri",
    type: ActionResourceTypeEnum.CLASS_RESOURCE,
    aliases: ["wp", "war priest"],
    iconUrl: "https://bg3.wiki/w/images/9/90/War_Priest_Charges_Icon.png",
  },
];

export const BG3_ACTION_RESOURCES = [...SPELL_SLOTS, ...CLASS_RESOURCES];

export const findBg3ActionResource = (
  id: string,
): Bg3ActionResource | undefined =>
  BG3_ACTION_RESOURCES.find((resource) => resource.id === id);

/**
 * The id of a resource, however the wiki writes it: "spell1", "level1" ->
 * "1", "Wild Shape", "ws" -> "wldshp". An unknown name is kept, trimmed.
 */
export const normalizeActionResourceId = (name: string): string => {
  const trimmed = name.trim();
  const lowercase = trimmed.toLowerCase();
  return (
    BG3_ACTION_RESOURCES.find(
      (resource) =>
        resource.id === lowercase || resource.aliases.includes(lowercase),
    )?.id ?? trimmed
  );
};
