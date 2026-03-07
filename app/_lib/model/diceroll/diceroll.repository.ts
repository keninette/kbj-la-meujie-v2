import "server-only";

import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { Diceroll } from "@/app/_lib/model/diceroll/diceroll.entity";
import { DicerollPatchDto } from "@/app/_lib/model/diceroll/dtos/diceroll.patch.dto";

type DicerollLike = Diceroll & {
  id?: number;
  stepId?: number;
};

export class DicerollRepository extends GenericRepository {
  private selectStatement =
    "id, dice, skill, onSuccess:on_success, onFailure:on_failure, condition, stepId:step_id";

  constructor() {
    super("diceroll");
  }

  getAll = async (): Promise<Array<DicerollLike>> => {
    const dicerolls = await this.client
      .from(this.name)
      .select(this.selectStatement);

    return (dicerolls.data ?? []) as unknown as DicerollLike[];
  };

  getOne = async (id: number): Promise<DicerollLike> => {
    const diceroll = await this.client
      .from(this.name)
      .select(this.selectStatement)
      .eq("id", id);

    return diceroll.data?.[0] as unknown as DicerollLike;
  };

  patchOne = async (
    id: number,
    dicerollPatchDto: DicerollPatchDto,
  ): Promise<DicerollLike> => {
    const payload = this.convertDtoToPayload(dicerollPatchDto);

    const diceroll = await this.client
      .from(this.name)
      .update(payload)
      .eq("id", id)
      .select(this.selectStatement);

    return diceroll.data?.[0] as unknown as DicerollLike;
  };

  private convertDtoToPayload = (
    dicerollPatchDto: DicerollPatchDto,
  ): {
    dice?: string;
    skill?: string;
    on_success?: unknown;
    on_failure?: unknown;
    condition?: string;
    step_id?: number;
  } => {
    const payload: {
      dice?: string;
      skill?: string;
      on_success?: unknown;
      on_failure?: unknown;
      condition?: string;
      step_id?: number;
    } = {};

    if (dicerollPatchDto.dice !== undefined) {
      payload.dice = dicerollPatchDto.dice;
    }

    if (dicerollPatchDto.skill !== undefined) {
      payload.skill = dicerollPatchDto.skill;
    }

    if (dicerollPatchDto.onSuccess !== undefined) {
      payload.on_success = dicerollPatchDto.onSuccess;
    }

    if (dicerollPatchDto.onFailure !== undefined) {
      payload.on_failure = dicerollPatchDto.onFailure;
    }

    if (dicerollPatchDto.condition !== undefined) {
      payload.condition = dicerollPatchDto.condition;
    }

    if (dicerollPatchDto.stepId !== undefined) {
      payload.step_id = dicerollPatchDto.stepId;
    }

    return payload;
  };
}
