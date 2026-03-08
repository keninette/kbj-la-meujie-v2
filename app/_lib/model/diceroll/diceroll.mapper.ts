import { Diceroll } from "@/app/_lib/model/diceroll/diceroll.entity";
import { DicerollDto } from "@/app/_lib/model/diceroll/dtos/diceroll.dto";
import { DicerollListDto } from "@/app/_lib/model/diceroll/dtos/diceroll-list.dto";

type DicerollLike = Diceroll & {
  stepId?: number;
  stepUuid?: string;
  step?: {
    uuid?: string;
  };
};

export class DicerollMapper {
  toDicerollListDto(rawDiceroll: DicerollLike): DicerollListDto {
    return {
      uuid: rawDiceroll.uuid,
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
      stepUuid: rawDiceroll.stepUuid ?? rawDiceroll.step?.uuid,
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
