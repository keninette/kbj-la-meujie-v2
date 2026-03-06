import { Skill } from "../character/enums/skill.enum";
import { DicerollResultType } from "./enums/diceroll-result.enum";

type DicerollResult = {
  type: DicerollResultType;
  value: string | number;
};

export class Diceroll {
  dice!: string;
  skill!: Skill
  onSuccess!: DicerollResult;
  onFailure!: DicerollResult;
  condition?: string;
}
