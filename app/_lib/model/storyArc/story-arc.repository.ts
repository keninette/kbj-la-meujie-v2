import "server-only";

import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { StoryArc } from "@/app/_lib/model/storyArc/storyArc.entity";
import { StoryArcCreateDto } from "@/app/_lib/model/storyArc/dtos/story-arc.create.dto";
import { StoryArcPatchDto } from "@/app/_lib/model/storyArc/dtos/story-arc.patch.dto";

type StoryArcLike = StoryArc & {
  adventureId?: number;
};

export class StoryArcRepository extends GenericRepository {
  private selectStatement =
    "id, uuid, name, adventureId:adventure_id, adventure:adventure(uuid), chapters:chapter(id, uuid, name, storyArcId:story_arc_id)";

  constructor() {
    super("story_arc");
  }

  getAll = async (): Promise<Array<StoryArcLike>> => {
    const storyArcs = await this.client
      .from(this.name)
      .select(this.selectStatement);

    return (storyArcs.data ?? []) as unknown as StoryArcLike[];
  };

  getOne = async (uuid: string): Promise<StoryArcLike> => {
    const storyArc = await this.client
      .from(this.name)
      .select(this.selectStatement)
      .eq("uuid", uuid);

    return storyArc.data?.[0] as unknown as StoryArcLike;
  };

  createOne = async (
    adventureUuid: string,
    storyArcCreateDto: StoryArcCreateDto,
  ): Promise<StoryArcLike> => {
    const adventureId = await this.getAdventureIdByUuid(adventureUuid);

    const payload = this.convertCreateDtoToPayload(storyArcCreateDto, adventureId);

    const storyArc = await this.client
      .from(this.name)
      .insert(payload)
      .select(this.selectStatement);

    return storyArc.data?.[0] as unknown as StoryArcLike;
  };

  patchOne = async (
    uuid: string,
    storyArcPatchDto: StoryArcPatchDto,
  ): Promise<StoryArcLike> => {
    const payload = await this.convertDtoToPayload(storyArcPatchDto);

    const storyArc = await this.client
      .from(this.name)
      .update(payload)
      .eq("uuid", uuid)
      .select(this.selectStatement);

    return storyArc.data?.[0] as unknown as StoryArcLike;
  };

  patchOneForAdventure = async (
    adventureUuid: string,
    storyArcUuid: string,
    storyArcPatchDto: StoryArcPatchDto,
  ): Promise<StoryArcLike> => {
    const adventureId = await this.getAdventureIdByUuid(adventureUuid);
    const payload = await this.convertDtoToPayload(storyArcPatchDto);

    const storyArc = await this.client
      .from(this.name)
      .update(payload)
      .eq("uuid", storyArcUuid)
      .eq("adventure_id", adventureId)
      .select(this.selectStatement);

    const updatedStoryArc = storyArc.data?.[0] as StoryArcLike | undefined;

    if (!updatedStoryArc) {
      throw new Error("Story arc not found");
    }

    return updatedStoryArc;
  };

  private convertDtoToPayload = async (
    storyArcPatchDto: StoryArcPatchDto,
  ): Promise<{
    name?: string;
    adventure_id?: number;
  }> => {
    const payload: { name?: string; adventure_id?: number } = {};

    if (storyArcPatchDto.name !== undefined) {
      payload.name = storyArcPatchDto.name;
    }

    if (storyArcPatchDto.adventureUuid !== undefined) {
      payload.adventure_id = await this.getAdventureIdByUuid(
        storyArcPatchDto.adventureUuid,
      );
    }

    return payload;
  };

  private convertCreateDtoToPayload = (
    storyArcCreateDto: StoryArcCreateDto,
    adventureId: number,
  ): {
    uuid: string;
    name: string;
    adventure_id: number;
  } => {
    const storyArc = new StoryArc();

    return {
      uuid: storyArc.uuid,
      name: storyArcCreateDto.name as string,
      adventure_id: adventureId,
    };
  };

  private getAdventureIdByUuid = async (
    adventureUuid: string,
  ): Promise<number> => {
    const adventure = await this.client
      .from("adventure")
      .select("id")
      .eq("uuid", adventureUuid);

    const adventureId = adventure.data?.[0]?.id as number | undefined;

    if (!adventureId) {
      throw new Error("Adventure not found");
    }

    return adventureId;
  };
}
