import "server-only";

import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { Chapter } from "@/app/_lib/model/chapter/chapter.entity";
import { ChapterPatchDto } from "@/app/_lib/model/chapter/dtos/chapter.patch.dto";

type ChapterLike = Chapter & {
  storyArcId?: number;
  // todo fix this
  storyArcUuid?: string;
  storyArc?: {
    uuid?: string;
  };
};

export class ChapterRepository extends GenericRepository {
  private selectStatement =
    "id, uuid, name, storyArcId:story_arc_id, storyArc:story_arc(uuid), steps:step(id, uuid, name, description, date, chapterId:chapter_id, placeId:place_id, place:place(id, uuid, name, publicDescription:public_description, privateDescription:private_description, picture, pinId:pin_id, isStepBound:is_step_bound))";

  constructor() {
    super("chapter");
  }

  getAll = async (): Promise<Array<ChapterLike>> => {
    const chapters = await this.client
      .from(this.name)
      .select("id, uuid, name");

    return (chapters.data ?? []) as unknown as ChapterLike[];
  };

  getOne = async (uuid: string): Promise<ChapterLike> => {
    const chapter = await this.client
      .from(this.name)
      .select(this.selectStatement)
      .eq("uuid", uuid);

    return chapter.data?.[0] as unknown as ChapterLike;
  };

  patchOne = async (
    uuid: string,
    chapterPatchDto: ChapterPatchDto,
  ): Promise<ChapterLike> => {
    const payload = await this.convertDtoToPayload(chapterPatchDto);

    const chapter = await this.client
      .from(this.name)
      .update(payload)
      .eq("uuid", uuid)
      .select(this.selectStatement);

    return chapter.data?.[0] as unknown as ChapterLike;
  };

  private convertDtoToPayload = (
    chapterPatchDto: ChapterPatchDto,
  ): Promise<{
    name?: string;
    story_arc_id?: number;
  }> => {
    const payload: { name?: string; story_arc_id?: number } = {};

    if (chapterPatchDto.name !== undefined) {
      payload.name = chapterPatchDto.name;
    }

    // todo fix this
    if (chapterPatchDto.storyArcUuid !== undefined) {
      return this.getStoryArcIdByUuid(chapterPatchDto.storyArcUuid).then(
        (storyArcId) => ({
          ...payload,
          story_arc_id: storyArcId,
        }),
      );
    }

    return Promise.resolve(payload);
  };

  private getStoryArcIdByUuid = async (storyArcUuid: string): Promise<number> => {
    const storyArc = await this.client
      .from("story_arc")
      .select("id")
      .eq("uuid", storyArcUuid);

    const storyArcId = storyArc.data?.[0]?.id as number | undefined;

    if (!storyArcId) {
      throw new Error("Story arc not found");
    }

    return storyArcId;
  };
}
