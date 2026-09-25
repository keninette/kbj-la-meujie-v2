import { CombatStatusEnum } from "../enums/combat-status.enum";
import { CombatCharacter } from "./combat-character.type";
import { CombatHistoryEntry } from "./combat-history-entry.type";

export type Combat = {
  status: CombatStatusEnum;
  currentTurn: number;
  selectedCharacterIndex: number;
  characters: CombatCharacter[];
  history: CombatHistoryEntry[];
};
