import "server-only";

import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { StoryArc } from "@/app/_lib/model/storyArc/storyArc.entity";
import { StoryArcPatchDto } from "@/app/_lib/model/storyArc/dtos/story-arc.patch.dto";

type StoryArcLike = StoryArc & {
  adventureId?: number;
};

export class StoryArcRepository extends GenericRepository {
  private selectStatement =
    "id, uuid, name, adventureId:adventure_id, chapters:chapter(id, uuid, name, storyArcId:story_arc_id)";

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

  patchOne = async (
    uuid: string,
    storyArcPatchDto: StoryArcPatchDto,
  ): Promise<StoryArcLike> => {
    const payload = this.convertDtoToPayload(storyArcPatchDto);

    const storyArc = await this.client
      .from(this.name)
      .update(payload)
      .eq("uuid", uuid)
      .select(this.selectStatement);

    return storyArc.data?.[0] as unknown as StoryArcLike;
  };

  private convertDtoToPayload = (
    storyArcPatchDto: StoryArcPatchDto,
  ): {
    name?: string;
    adventure_id?: number;
  } => {
    const payload: { name?: string; adventure_id?: number } = {};

    if (storyArcPatchDto.name !== undefined) {
      payload.name = storyArcPatchDto.name;
    }

    if (storyArcPatchDto.adventureId !== undefined) {
      payload.adventure_id = storyArcPatchDto.adventureId;
    }

    return payload;
  };
}
