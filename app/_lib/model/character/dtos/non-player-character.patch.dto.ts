import { CharacterType } from "@/app/_lib/model/character/enums/character-type.enum";
import { DndAlignment } from "@/app/_lib/model/character/enums/alignment.enum";
import { DndCharacterClass } from "@/app/_lib/model/character/enums/character-class.enum";
import { DndRace } from "@/app/_lib/model/character/enums/race.enum";
import { NonPlayerCharacterRuleset } from "@/app/_lib/model/character/dtos/non-player-character.dto";

export class NonPlayerCharacterPatchDto {
  name?: string;
  identifiesAs?: "Female" | "Male" | "Non-binary";
  currentHealthPoints?: number;
  maxHealthPoints?: number;
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

  validate = async (): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (
      this.name === undefined &&
      this.identifiesAs === undefined &&
      this.currentHealthPoints === undefined &&
      this.maxHealthPoints === undefined &&
      this.type === undefined &&
      this.portrait === undefined &&
      this.ruleset === undefined &&
      this.characterClass === undefined &&
      this.level === undefined &&
      this.inspirationPoints === undefined &&
      this.proficiencyBonus === undefined &&
      this.initiativeBonus === undefined &&
      this.armorClass === undefined &&
      this.race === undefined &&
      this.alignment === undefined &&
      this.backstory === undefined &&
      this.occupation === undefined &&
      this.currentMagicPoints === undefined &&
      this.maxMagicPoints === undefined &&
      this.currentSanPoints === undefined &&
      this.maxSanPoints === undefined &&
      this.stepId === undefined
    ) {
      errors.push("At least one field is required for patch");
    }

    return errors;
  };
}
