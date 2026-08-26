import { DicerollDto } from "@lib/model/diceroll/dtos/diceroll.dto";

export type DicerollListDto = Pick<
  DicerollDto,
  "uuid" | "dice" | "skill" | "condition"
>;
