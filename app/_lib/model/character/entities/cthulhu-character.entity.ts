import { CharacterType } from "../enums/character-type.enum";
import { Character } from "./character.entity";

export class CthulhuCharacter extends Character {
  backstory?: string;
  occupation?: string;
  currentMagicPoints!: number;
  maxMagicPoints!: number;
  currentSanPoints!: number;
  maxSanPoints!: number;
}
