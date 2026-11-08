import { CombatStatusEnum } from "../enums/combat-status.enum";
import { CombatCharacter } from "../types/combat-character.type";
import { Combat } from "../types/combat.type";

/** The combat's turn while it is ongoing, stored on the states applied then */
export const getOngoingTurn = (
  combat: Pick<Combat, "status" | "currentTurn"> | null | undefined,
): number | undefined =>
  combat?.status === CombatStatusEnum.ONGOING ? combat.currentTurn : undefined;

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

/** Where the turn order is: whose turn it is, in which turn */
export type TurnPosition = Pick<
  Combat,
  "selectedCharacterIndex" | "currentTurn"
>;

// Dead characters keep their place in the list, but don't play
const canPlay = (character: CombatCharacter | undefined) =>
  !!character && !character.isDead;

/** The first character who can play, when the combat starts */
export const getFirstTurnPosition = (
  characters: CombatCharacter[],
): TurnPosition => ({
  selectedCharacterIndex: Math.max(characters.findIndex(canPlay), 0),
  currentTurn: 1,
});

/** The next character who can play, in the next turn after the last one.
 * null when nobody can play. */
export const getNextTurnPosition = ({
  characters,
  selectedCharacterIndex,
  currentTurn,
}: Pick<
  Combat,
  "characters" | "selectedCharacterIndex" | "currentTurn"
>): TurnPosition | null => {
  for (let step = 1; step <= characters.length; step++) {
    const index = (selectedCharacterIndex + step) % characters.length;
    if (canPlay(characters[index])) {
      return {
        selectedCharacterIndex: index,
        // Back to the top of the list: a new turn
        currentTurn:
          selectedCharacterIndex + step >= characters.length
            ? currentTurn + 1
            : currentTurn,
      };
    }
  }
  return null;
};

/** The previous character who can play, in the previous turn before the
 * first one. null when there is none (start of the combat, or nobody). */
export const getPreviousTurnPosition = ({
  characters,
  selectedCharacterIndex,
  currentTurn,
}: Pick<
  Combat,
  "characters" | "selectedCharacterIndex" | "currentTurn"
>): TurnPosition | null => {
  for (let step = 1; step <= characters.length; step++) {
    const position = selectedCharacterIndex - step;
    const isPreviousTurn = position < 0;
    if (isPreviousTurn && currentTurn <= 1) {
      return null;
    }
    const index = (position + characters.length) % characters.length;
    if (canPlay(characters[index])) {
      return {
        selectedCharacterIndex: index,
        currentTurn: isPreviousTurn ? currentTurn - 1 : currentTurn,
      };
    }
  }
  return null;
};
