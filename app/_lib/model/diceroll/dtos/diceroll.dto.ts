import { Skill } from "@/app/_lib/model/character/enums/skill.enum";
import { DicerollResultType } from "@/app/_lib/model/diceroll/enums/diceroll-result.enum";

export type DicerollResultDto = {
  type: DicerollResultType;
  value: string | number;
};

export class DicerollDto {
  id?: number;
  dice!: string;
  skill!: Skill;
  onSuccess!: DicerollResultDto;
  onFailure!: DicerollResultDto;
  condition?: string;
  stepId?: number;
}
