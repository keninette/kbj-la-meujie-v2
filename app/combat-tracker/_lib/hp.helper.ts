import type { CombatCharacter } from "@/app/_lib/types/combat-character.type";

// Defaults to the alternative HP value when no maximum was set.
export const getMaxAlternativeHp = (
  character: CombatCharacter,
): number | undefined => character.maxAlternativeHp || character.alternativeHp;
