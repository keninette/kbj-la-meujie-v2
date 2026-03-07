import { Diceroll } from "@/app/_lib/model/diceroll/diceroll.entity";
import { DicerollDto } from "@/app/_lib/model/diceroll/dtos/diceroll.dto";
import { DicerollListDto } from "@/app/_lib/model/diceroll/dtos/diceroll-list.dto";

type DicerollLike = Diceroll & {
  id?: number;
  stepId?: number;
};

export class DicerollMapper {
  toDicerollListDto(rawDiceroll: DicerollLike): DicerollListDto {
    return {
      id: rawDiceroll.id,
      dice: rawDiceroll.dice,
      skill: rawDiceroll.skill,
      condition: rawDiceroll.condition,
    };
  }

  toDicerollDto(rawDiceroll: DicerollLike): DicerollDto {
    return {
      ...this.toDicerollListDto(rawDiceroll),
      onSuccess: rawDiceroll.onSuccess,
      onFailure: rawDiceroll.onFailure,
      stepId: rawDiceroll.stepId,
    };
  }

  toDicerollDtos(rawDicerolls: DicerollLike[]): DicerollDto[] {
    return rawDicerolls.map((rawDiceroll) => this.toDicerollDto(rawDiceroll));
  }

  toDicerollListDtos(rawDicerolls: DicerollLike[]): DicerollListDto[] {
    return rawDicerolls.map((rawDiceroll) =>
      this.toDicerollListDto(rawDiceroll),
    );
  }
}
