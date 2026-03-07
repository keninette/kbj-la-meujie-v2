import "server-only";

import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { Step } from "@/app/_lib/model/step/step.entity";
import { StepPatchDto } from "@/app/_lib/model/step/dtos/step.patch.dto";

type StepLike = Step & {
  chapterId?: number;
  placeId?: number;
};

export class StepRepository extends GenericRepository {
  private selectStatement =
    "id, name, description, date, chapterId:chapter_id, placeId:place_id, place:place(id, name, publicDescription:public_description, privateDescription:private_description, picture, pinId:pin_id, isStepBound:is_step_bound), audios:audio(id, name, filename, loop, autoPlay:auto_play, volume, helper, stepId:step_id), diceRolls:diceroll(id, dice, skill, onSuccess:on_success, onFailure:on_failure, condition, stepId:step_id), nonPlayerCharacters:non_player_character(id, name, identifiesAs:identifies_as, currentHealthPoints:current_health_points, maxHealthPoints:max_health_points, type, portrait, ruleset, characterClass:character_class, level, inspirationPoints:inspiration_points, proficiencyBonus:proficiency_bonus, initiativeBonus:initiative_bonus, armorClass:armor_class, race, alignment, backstory, occupation, currentMagicPoints:current_magic_points, maxMagicPoints:max_magic_points, currentSanPoints:current_san_points, maxSanPoints:max_san_points, stepId:step_id)";

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
    const payload = this.convertDtoToPayload(stepPatchDto);

    const step = await this.client
      .from(this.name)
      .update(payload)
      .eq("id", id)
      .select(this.selectStatement);

    return step.data?.[0] as unknown as StepLike;
  };

  private convertDtoToPayload = (
    stepPatchDto: StepPatchDto,
  ): {
    name?: string;
    description?: string;
    date?: string;
    chapter_id?: number;
    place_id?: number;
  } => {
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

    if (stepPatchDto.chapterId !== undefined) {
      payload.chapter_id = stepPatchDto.chapterId;
    }

    if (stepPatchDto.placeId !== undefined) {
      payload.place_id = stepPatchDto.placeId;
    }

    return payload;
  };
}
