import { CombatCharacter } from "../types/combat-character.type";

export const findCharacterIndexById = (
  characters: CombatCharacter[],
  id: string,
) => characters.findIndex((character) => character.id === id);
