import { CharacterType } from "@/app/_lib/model/character/enums/character-type.enum";
import { DndAlignment } from "@/app/_lib/model/character/enums/alignment.enum";
import { DndCharacterClass } from "@/app/_lib/model/character/enums/character-class.enum";
import { DndRace } from "@/app/_lib/model/character/enums/race.enum";

export type NonPlayerCharacterRuleset = "DND" | "CTHULHU";

export class NonPlayerCharacterDto {
  id?: number;
  name!: string;
  identifiesAs!: "Female" | "Male" | "Non-binary";
  currentHealthPoints!: number;
  maxHealthPoints!: number;
  type?: CharacterType;
  portrait?: string;
  ruleset?: NonPlayerCharacterRuleset;
  characterClass?: DndCharacterClass;
  level?: number;
  inspirationPoints?: number;
  proficiencyBonus?: number;
  initiativeBonus?: number;
  armorClass?: number;
  race?: DndRace;
  alignment?: DndAlignment;
  backstory?: string;
  occupation?: string;
  currentMagicPoints?: number;
  maxMagicPoints?: number;
  currentSanPoints?: number;
  maxSanPoints?: number;
  stepId?: number;
}
