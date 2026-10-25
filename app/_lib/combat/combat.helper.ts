import { CombatCharacter } from "../types/combat-character.type";
import { Combat } from "../types/combat.type";

export const findCharacterIndexById = (
  characters: CombatCharacter[],
  id: string,
) => characters.findIndex((character) => character.id === id);

const sortCharacters = (characters: CombatCharacter[]) => {
  return [...characters].sort((a, b) => b.initiativeScore - a.initiativeScore);
};

export const normalizeCombat = (nextCombat: Combat | null): Combat | null => {
  if (!nextCombat) {
    return null;
  }

  const selectedCharacterId =
    nextCombat.characters[nextCombat.selectedCharacterIndex]?.id;
  const characters = sortCharacters(nextCombat.characters);
  const selectedCharacterIndex = selectedCharacterId
    ? findCharacterIndexById(characters, selectedCharacterId)
    : nextCombat.selectedCharacterIndex;
  const fallbackCharacterIndex =
    characters.length > 0
      ? Math.min(
          Math.max(nextCombat.selectedCharacterIndex, 0),
          characters.length - 1,
        )
      : 0;

  return {
    ...nextCombat,
    characters,
    selectedCharacterIndex:
      selectedCharacterIndex >= 0
        ? selectedCharacterIndex
        : fallbackCharacterIndex,
  };
};
