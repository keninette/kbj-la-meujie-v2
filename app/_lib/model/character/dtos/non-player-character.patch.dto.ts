import { CharacterType } from "@/app/_lib/model/character/enums/character-type.enum";
import { DndAlignment } from "@/app/_lib/model/character/enums/alignment.enum";
import { DndCharacterClass } from "@/app/_lib/model/character/enums/character-class.enum";
import { DndRace } from "@/app/_lib/model/character/enums/race.enum";
import {
  NonPlayerCharacterDto,
  NonPlayerCharacterRuleset,
} from "@/app/_lib/model/character/dtos/non-player-character.dto";

type NonPlayerCharacterPatchDtoProps = Partial<
  Pick<
    NonPlayerCharacterDto,
    | "name"
    | "identifiesAs"
    | "currentHealthPoints"
    | "maxHealthPoints"
    | "type"
    | "portrait"
    | "ruleset"
    | "characterClass"
    | "level"
    | "inspirationPoints"
    | "proficiencyBonus"
    | "initiativeBonus"
    | "armorClass"
    | "race"
    | "alignment"
    | "backstory"
    | "occupation"
    | "currentMagicPoints"
    | "maxMagicPoints"
    | "currentSanPoints"
    | "maxSanPoints"
    | "stepUuid"
  >
>;

export class NonPlayerCharacterPatchDto implements NonPlayerCharacterPatchDtoProps {
  name?: NonPlayerCharacterDto["name"];
  identifiesAs?: NonPlayerCharacterDto["identifiesAs"];
  currentHealthPoints?: NonPlayerCharacterDto["currentHealthPoints"];
  maxHealthPoints?: NonPlayerCharacterDto["maxHealthPoints"];
  type?: CharacterType;
  portrait?: NonPlayerCharacterDto["portrait"];
  ruleset?: NonPlayerCharacterRuleset;
  characterClass?: DndCharacterClass;
  level?: NonPlayerCharacterDto["level"];
  inspirationPoints?: NonPlayerCharacterDto["inspirationPoints"];
  proficiencyBonus?: NonPlayerCharacterDto["proficiencyBonus"];
  initiativeBonus?: NonPlayerCharacterDto["initiativeBonus"];
  armorClass?: NonPlayerCharacterDto["armorClass"];
  race?: DndRace;
  alignment?: DndAlignment;
  backstory?: NonPlayerCharacterDto["backstory"];
  occupation?: NonPlayerCharacterDto["occupation"];
  currentMagicPoints?: NonPlayerCharacterDto["currentMagicPoints"];
  maxMagicPoints?: NonPlayerCharacterDto["maxMagicPoints"];
  currentSanPoints?: NonPlayerCharacterDto["currentSanPoints"];
  maxSanPoints?: NonPlayerCharacterDto["maxSanPoints"];
  stepUuid?: NonPlayerCharacterDto["stepUuid"];

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
      this.stepUuid === undefined
    ) {
      errors.push("At least one field is required for patch");
    }

    return errors;
  };
}
