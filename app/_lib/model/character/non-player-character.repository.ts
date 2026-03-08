import "server-only";

import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { NonPlayerCharacter } from "@/app/_lib/model/character/entities/non-player-character.entity";
import { NonPlayerCharacterDto } from "@/app/_lib/model/character/dtos/non-player-character.dto";
import { NonPlayerCharacterPatchDto } from "@/app/_lib/model/character/dtos/non-player-character.patch.dto";

type NonPlayerCharacterLike = NonPlayerCharacter &
  Partial<NonPlayerCharacterDto>;

export class NonPlayerCharacterRepository extends GenericRepository {
  private selectStatement =
    "id, uuid, name, identifiesAs:identifies_as, currentHealthPoints:current_health_points, maxHealthPoints:max_health_points, type, portrait, ruleset, characterClass:character_class, level, inspirationPoints:inspiration_points, proficiencyBonus:proficiency_bonus, initiativeBonus:initiative_bonus, armorClass:armor_class, race, alignment, backstory, occupation, currentMagicPoints:current_magic_points, maxMagicPoints:max_magic_points, currentSanPoints:current_san_points, maxSanPoints:max_san_points, stepId:step_id, step:step(uuid)";

  constructor() {
    super("non_player_character");
  }

  getAll = async (): Promise<Array<NonPlayerCharacterLike>> => {
    const nonPlayerCharacters = await this.client
      .from(this.name)
      .select(this.selectStatement);

    return (nonPlayerCharacters.data ??
      []) as unknown as NonPlayerCharacterLike[];
  };

  getOne = async (id: number): Promise<NonPlayerCharacterLike> => {
    const nonPlayerCharacter = await this.client
      .from(this.name)
      .select(this.selectStatement)
      .eq("id", id);

    return nonPlayerCharacter.data?.[0] as unknown as NonPlayerCharacterLike;
  };

  patchOne = async (
    id: number,
    nonPlayerCharacterPatchDto: NonPlayerCharacterPatchDto,
  ): Promise<NonPlayerCharacterLike> => {
    const payload = await this.convertDtoToPayload(nonPlayerCharacterPatchDto);

    const nonPlayerCharacter = await this.client
      .from(this.name)
      .update(payload)
      .eq("id", id)
      .select(this.selectStatement);

    return nonPlayerCharacter.data?.[0] as unknown as NonPlayerCharacterLike;
  };

  private convertDtoToPayload = (
    nonPlayerCharacterPatchDto: NonPlayerCharacterPatchDto,
  ): Promise<{
    name?: string;
    identifies_as?: "Female" | "Male" | "Non-binary";
    current_health_points?: number;
    max_health_points?: number;
    type?: string;
    portrait?: string;
    ruleset?: string;
    character_class?: string;
    level?: number;
    inspiration_points?: number;
    proficiency_bonus?: number;
    initiative_bonus?: number;
    armor_class?: number;
    race?: string;
    alignment?: string;
    backstory?: string;
    occupation?: string;
    current_magic_points?: number;
    max_magic_points?: number;
    current_san_points?: number;
    max_san_points?: number;
    step_id?: number;
  }> => {
    const payload: {
      name?: string;
      identifies_as?: "Female" | "Male" | "Non-binary";
      current_health_points?: number;
      max_health_points?: number;
      type?: string;
      portrait?: string;
      ruleset?: string;
      character_class?: string;
      level?: number;
      inspiration_points?: number;
      proficiency_bonus?: number;
      initiative_bonus?: number;
      armor_class?: number;
      race?: string;
      alignment?: string;
      backstory?: string;
      occupation?: string;
      current_magic_points?: number;
      max_magic_points?: number;
      current_san_points?: number;
      max_san_points?: number;
      step_id?: number;
    } = {};

    if (nonPlayerCharacterPatchDto.name !== undefined) {
      payload.name = nonPlayerCharacterPatchDto.name;
    }

    if (nonPlayerCharacterPatchDto.identifiesAs !== undefined) {
      payload.identifies_as = nonPlayerCharacterPatchDto.identifiesAs;
    }

    if (nonPlayerCharacterPatchDto.currentHealthPoints !== undefined) {
      payload.current_health_points =
        nonPlayerCharacterPatchDto.currentHealthPoints;
    }

    if (nonPlayerCharacterPatchDto.maxHealthPoints !== undefined) {
      payload.max_health_points = nonPlayerCharacterPatchDto.maxHealthPoints;
    }

    if (nonPlayerCharacterPatchDto.type !== undefined) {
      payload.type = nonPlayerCharacterPatchDto.type;
    }

    if (nonPlayerCharacterPatchDto.portrait !== undefined) {
      payload.portrait = nonPlayerCharacterPatchDto.portrait;
    }

    if (nonPlayerCharacterPatchDto.ruleset !== undefined) {
      payload.ruleset = nonPlayerCharacterPatchDto.ruleset;
    }

    if (nonPlayerCharacterPatchDto.characterClass !== undefined) {
      payload.character_class = nonPlayerCharacterPatchDto.characterClass;
    }

    if (nonPlayerCharacterPatchDto.level !== undefined) {
      payload.level = nonPlayerCharacterPatchDto.level;
    }

    if (nonPlayerCharacterPatchDto.inspirationPoints !== undefined) {
      payload.inspiration_points = nonPlayerCharacterPatchDto.inspirationPoints;
    }

    if (nonPlayerCharacterPatchDto.proficiencyBonus !== undefined) {
      payload.proficiency_bonus = nonPlayerCharacterPatchDto.proficiencyBonus;
    }

    if (nonPlayerCharacterPatchDto.initiativeBonus !== undefined) {
      payload.initiative_bonus = nonPlayerCharacterPatchDto.initiativeBonus;
    }

    if (nonPlayerCharacterPatchDto.armorClass !== undefined) {
      payload.armor_class = nonPlayerCharacterPatchDto.armorClass;
    }

    if (nonPlayerCharacterPatchDto.race !== undefined) {
      payload.race = nonPlayerCharacterPatchDto.race;
    }

    if (nonPlayerCharacterPatchDto.alignment !== undefined) {
      payload.alignment = nonPlayerCharacterPatchDto.alignment;
    }

    if (nonPlayerCharacterPatchDto.backstory !== undefined) {
      payload.backstory = nonPlayerCharacterPatchDto.backstory;
    }

    if (nonPlayerCharacterPatchDto.occupation !== undefined) {
      payload.occupation = nonPlayerCharacterPatchDto.occupation;
    }

    if (nonPlayerCharacterPatchDto.currentMagicPoints !== undefined) {
      payload.current_magic_points =
        nonPlayerCharacterPatchDto.currentMagicPoints;
    }

    if (nonPlayerCharacterPatchDto.maxMagicPoints !== undefined) {
      payload.max_magic_points = nonPlayerCharacterPatchDto.maxMagicPoints;
    }

    if (nonPlayerCharacterPatchDto.currentSanPoints !== undefined) {
      payload.current_san_points = nonPlayerCharacterPatchDto.currentSanPoints;
    }

    if (nonPlayerCharacterPatchDto.maxSanPoints !== undefined) {
      payload.max_san_points = nonPlayerCharacterPatchDto.maxSanPoints;
    }

    if (nonPlayerCharacterPatchDto.stepUuid !== undefined) {
      return this.getStepIdByUuid(nonPlayerCharacterPatchDto.stepUuid).then(
        (stepId) => ({
          ...payload,
          step_id: stepId,
        }),
      );
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
