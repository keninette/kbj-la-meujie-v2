import { Skill } from "@/app/_lib/model/character/enums/skill.enum";
import { DicerollResultDto } from "@/app/_lib/model/diceroll/dtos/diceroll.dto";
import { DicerollDto } from "@/app/_lib/model/diceroll/dtos/diceroll.dto";

type DicerollPatchDtoProps = Partial<
  Pick<
    DicerollDto,
    "dice" | "skill" | "onSuccess" | "onFailure" | "condition" | "stepUuid"
  >
>;

export class DicerollPatchDto implements DicerollPatchDtoProps {
  dice?: DicerollDto["dice"];
  skill?: Skill;
  onSuccess?: DicerollResultDto;
  onFailure?: DicerollResultDto;
  condition?: DicerollDto["condition"];
  stepUuid?: DicerollDto["stepUuid"];

  validate = async (): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (
      this.dice === undefined &&
      this.skill === undefined &&
      this.onSuccess === undefined &&
      this.onFailure === undefined &&
      this.condition === undefined &&
      this.stepUuid === undefined
    ) {
      errors.push("At least one field is required for patch");
    }

    return errors;
  };
}
