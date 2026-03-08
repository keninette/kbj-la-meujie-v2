import "server-only";

import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { Diceroll } from "@/app/_lib/model/diceroll/diceroll.entity";
import { DicerollPatchDto } from "@/app/_lib/model/diceroll/dtos/diceroll.patch.dto";

type DicerollLike = Diceroll & {
  stepId?: number;
  
  stepUuid?: string;
  step?: {
    uuid?: string;
  };
};

export class DicerollRepository extends GenericRepository {
  private selectStatement =
    "id, uuid, dice, skill, onSuccess:on_success, onFailure:on_failure, condition, stepId:step_id, step:step(uuid)";

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
    const payload = await this.convertDtoToPayload(dicerollPatchDto);

    const diceroll = await this.client
      .from(this.name)
      .update(payload)
      .eq("id", id)
      .select(this.selectStatement);

    return diceroll.data?.[0] as unknown as DicerollLike;
  };

  private convertDtoToPayload = (
    dicerollPatchDto: DicerollPatchDto,
  ): Promise<{
    dice?: string;
    skill?: string;
    on_success?: unknown;
    on_failure?: unknown;
    condition?: string;
    step_id?: number;
  }> => {
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

    if (dicerollPatchDto.stepUuid !== undefined) {
      return this.getStepIdByUuid(dicerollPatchDto.stepUuid).then((stepId) => ({
        ...payload,
        step_id: stepId,
      }));
    }

    return Promise.resolve(payload);
  };

  private getStepIdByUuid = async (stepUuid: string): Promise<number> => {
    const step = await this.client
      .from("step")
      .select("id")
      .eq("uuid", stepUuid);

    const stepId = step.data?.[0]?.id as number | undefined;

    if (!stepId) {
      throw new Error("Step not found");
    }

    return stepId;
  };
}
