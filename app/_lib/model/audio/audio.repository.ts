import "server-only";

import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { Audio } from "@/app/_lib/model/audio/audio.entity";
import { AudioPatchDto } from "@/app/_lib/model/audio/dtos/audio.patch.dto";

type AudioLike = Audio & {
  stepId?: number;
  // todo fix this
  stepUuid?: string;
  step?: {
    uuid?: string;
  };
};

export class AudioRepository extends GenericRepository {
  private selectStatement =
    "id, uuid, name, filename, loop, autoPlay:auto_play, volume, helper, stepId:step_id, step:step(uuid)";

  constructor() {
    super("audio");
  }

  getAll = async (): Promise<Array<AudioLike>> => {
    const audios = await this.client
      .from(this.name)
      .select(this.selectStatement);

    return (audios.data ?? []) as unknown as AudioLike[];
  };

  getOne = async (id: number): Promise<AudioLike> => {
    const audio = await this.client
      .from(this.name)
      .select(this.selectStatement)
      .eq("id", id);

    return audio.data?.[0] as unknown as AudioLike;
  };

  patchOne = async (
    id: number,
    audioPatchDto: AudioPatchDto,
  ): Promise<AudioLike> => {
    const payload = await this.convertDtoToPayload(audioPatchDto);

    const audio = await this.client
      .from(this.name)
      .update(payload)
      .eq("id", id)
      .select(this.selectStatement);

    return audio.data?.[0] as unknown as AudioLike;
  };

  private convertDtoToPayload = (
    audioPatchDto: AudioPatchDto,
  ): Promise<{
    name?: string;
    filename?: string;
    loop?: boolean;
    auto_play?: boolean;
    volume?: number;
    helper?: string;
    step_id?: number;
  }> => {
    const payload: {
      name?: string;
      filename?: string;
      loop?: boolean;
      auto_play?: boolean;
      volume?: number;
      helper?: string;
      step_id?: number;
    } = {};

    if (audioPatchDto.name !== undefined) {
      payload.name = audioPatchDto.name;
    }

    if (audioPatchDto.filename !== undefined) {
      payload.filename = audioPatchDto.filename;
    }

    if (audioPatchDto.loop !== undefined) {
      payload.loop = audioPatchDto.loop;
    }

    if (audioPatchDto.autoPlay !== undefined) {
      payload.auto_play = audioPatchDto.autoPlay;
    }

    if (audioPatchDto.volume !== undefined) {
      payload.volume = audioPatchDto.volume;
    }

    if (audioPatchDto.helper !== undefined) {
      payload.helper = audioPatchDto.helper;
    }

    if (audioPatchDto.stepUuid !== undefined) {
      return this.getStepIdByUuid(audioPatchDto.stepUuid).then((stepId) => ({
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
