import { DndAlignment } from "../enums/alignment.enum";
import { DndCharacterClass } from "../enums/character-class.enum";
import { DndRace } from "../enums/race.enum";
import { Character } from "./character.entity";

export class DndCharacter extends Character {
  characterClass!: DndCharacterClass;
  level!: number;
  inspirationPoints!: number;
  proficiencyBonus!: number;
  initiativeBonus!: number;
  armorClass!: number;
  race!: DndRace;
  alignment!: DndAlignment;
}
