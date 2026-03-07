import { CharacterType } from "../enums/character-type.enum";
import { CthulhuCharacter } from "./cthulhu-character.entity";
import { DndCharacter } from "./dnd-character.entity";

export class DndNonPlayerCharacter extends DndCharacter {
  type: CharacterType = CharacterType.NON_PLAYER_CHARACTER;
}

export class CthulhuNonPlayerCharacter extends CthulhuCharacter {
  type: CharacterType = CharacterType.NON_PLAYER_CHARACTER;
}

export type NonPlayerCharacter =
  | DndNonPlayerCharacter
  | CthulhuNonPlayerCharacter;
