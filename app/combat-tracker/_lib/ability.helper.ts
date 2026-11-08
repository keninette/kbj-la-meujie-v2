/** 16 -> 3, 9 -> -1 */
export const getAbilityModifier = (score: number): number =>
  Math.floor((score - 10) / 2);

/** Levels 1 to 4 -> 2, 5 to 8 -> 3, 9 to 12 -> 4... */
export const getProficiencyBonus = (level: number): number =>
  2 + Math.floor((Math.max(level, 1) - 1) / 4);

/** 3 -> "+3", 0 -> "+0", -1 -> "−1" (a real minus sign) */
export const formatModifier = (modifier: number): string =>
  modifier < 0 ? `−${Math.abs(modifier)}` : `+${modifier}`;
