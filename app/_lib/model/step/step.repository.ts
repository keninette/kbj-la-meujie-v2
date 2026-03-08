import "server-only";

import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { Step } from "@/app/_lib/model/step/step.entity";
import { StepPatchDto } from "@/app/_lib/model/step/dtos/step.patch.dto";

type StepLike = Step & {
  chapterId?: number;
  placeId?: number;
  chapterUuid?: string;
  placeUuid?: string;
  chapter?: {
    uuid?: string;
  };
};

export class StepRepository extends GenericRepository {
  private selectStatement =
    "id, uuid, name, description, date, chapterId:chapter_id, chapter:chapter(uuid), placeId:place_id, place:place(id, uuid, name, publicDescription:public_description, privateDescription:private_description, picture, pinId:pin_id, isStepBound:is_step_bound), audios:audio(id, uuid, name, filename, loop, autoPlay:auto_play, volume, helper, stepId:step_id), diceRolls:diceroll(id, uuid, dice, skill, onSuccess:on_success, onFailure:on_failure, condition, stepId:step_id), nonPlayerCharacters:non_player_character(id, uuid, name, identifiesAs:identifies_as, currentHealthPoints:current_health_points, maxHealthPoints:max_health_points, type, portrait, ruleset, characterClass:character_class, level, inspirationPoints:inspiration_points, proficiencyBonus:proficiency_bonus, initiativeBonus:initiative_bonus, armorClass:armor_class, race, alignment, backstory, occupation, currentMagicPoints:current_magic_points, maxMagicPoints:max_magic_points, currentSanPoints:current_san_points, maxSanPoints:max_san_points, stepId:step_id, step:step(uuid))";

  constructor() {
    super("step");
  }

  getAll = async (): Promise<Array<StepLike>> => {
    const steps = await this.client
      .from(this.name)
      .select(this.selectStatement);

    return (steps.data ?? []) as unknown as StepLike[];
  };

  getOne = async (id: number): Promise<StepLike> => {
    const step = await this.client
      .from(this.name)
      .select(this.selectStatement)
      .eq("id", id);

    return step.data?.[0] as unknown as StepLike;
  };

  patchOne = async (
    id: number,
    stepPatchDto: StepPatchDto,
  ): Promise<StepLike> => {
    const payload = await this.convertDtoToPayload(stepPatchDto);

    const step = await this.client
      .from(this.name)
      .update(payload)
      .eq("id", id)
      .select(this.selectStatement);

    return step.data?.[0] as unknown as StepLike;
  };

  private convertDtoToPayload = (
    stepPatchDto: StepPatchDto,
  ): Promise<{
    name?: string;
    description?: string;
    date?: string;
    chapter_id?: number;
    place_id?: number;
  }> => {
    const payload: {
      name?: string;
      description?: string;
      date?: string;
      chapter_id?: number;
      place_id?: number;
    } = {};

    if (stepPatchDto.name !== undefined) {
      payload.name = stepPatchDto.name;
    }

    if (stepPatchDto.description !== undefined) {
      payload.description = stepPatchDto.description;
    }

    if (stepPatchDto.date !== undefined) {
      payload.date = stepPatchDto.date;
    }

    return this.resolveAssociationPayload(payload, stepPatchDto);
  };

  private resolveAssociationPayload = async (
    payload: {
      name?: string;
      description?: string;
      date?: string;
      chapter_id?: number;
      place_id?: number;
    },
    stepPatchDto: StepPatchDto,
  ): Promise<{
    name?: string;
    description?: string;
    date?: string;
    chapter_id?: number;
    place_id?: number;
  }> => {
    const nextPayload = { ...payload };

    if (stepPatchDto.chapterUuid !== undefined) {
      nextPayload.chapter_id = await this.getChapterIdByUuid(
        stepPatchDto.chapterUuid,
      );
    }

    if (stepPatchDto.placeUuid !== undefined) {
      nextPayload.place_id = await this.getPlaceIdByUuid(stepPatchDto.placeUuid);
    }

    return nextPayload;
  };

  private getChapterIdByUuid = async (chapterUuid: string): Promise<number> => {
    const chapter = await this.client
      .from("chapter")
      .select("id")
      .eq("uuid", chapterUuid);

    const chapterId = chapter.data?.[0]?.id as number | undefined;

    if (!chapterId) {
      throw new Error("Chapter not found");
    }

    return chapterId;
  };

  private getPlaceIdByUuid = async (placeUuid: string): Promise<number> => {
    const place = await this.client
      .from("place")
      .select("id")
      .eq("uuid", placeUuid);

    const placeId = place.data?.[0]?.id as number | undefined;

    if (!placeId) {
      throw new Error("Place not found");
    }

    return placeId;
  };
}
