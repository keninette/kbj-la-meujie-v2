import { Skill } from "@/app/_lib/model/character/enums/skill.enum";
import { DicerollResultDto } from "@/app/_lib/model/diceroll/dtos/diceroll.dto";

export class DicerollPatchDto {
  dice?: string;
  skill?: Skill;
  onSuccess?: DicerollResultDto;
  onFailure?: DicerollResultDto;
  condition?: string;
  stepId?: number;

  validate = async (): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (
      this.dice === undefined &&
      this.skill === undefined &&
      this.onSuccess === undefined &&
      this.onFailure === undefined &&
      this.condition === undefined &&
      this.stepId === undefined
    ) {
      errors.push("At least one field is required for patch");
    }

    return errors;
  };
}
