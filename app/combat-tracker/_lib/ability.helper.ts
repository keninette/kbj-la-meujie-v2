import { AbilityEnum } from "@/app/_lib/enums/ability.enum";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";

/**
 * BG3 rule
 * 16 -> 3, 9 -> -1
 */
export const getAbilityModifier = (score: number): number =>
  Math.floor((score - 10) / 2);

/**
 * BG3 rule
 * The dexterity modifier, or undefined when the dexterity is unknown
 */
export const getInitiativeBonus = (
  character: Pick<CombatCharacter, "abilities"> | null,
): number | undefined => {
  const dexterity = character?.abilities?.[AbilityEnum.DEXTERITY];
  return typeof dexterity === "number"
    ? getAbilityModifier(dexterity)
    : undefined;
};

/**
 * BG3 rule
 * Levels 1 to 4 -> 2, 5 to 8 -> 3, 9 to 12 -> 4...
 */
export const getProficiencyBonus = (level: number): number =>
  2 + Math.floor((Math.max(level, 1) - 1) / 4);

/** 3 -> "+3", 0 -> "+0", -1 -> "−1" (a real minus sign) */
export const formatModifier = (modifier: number): string =>
  modifier < 0 ? `−${Math.abs(modifier)}` : `+${modifier}`;
