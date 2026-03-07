import "server-only";

import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { Chapter } from "@/app/_lib/model/chapter/chapter.entity";
import { ChapterPatchDto } from "@/app/_lib/model/chapter/dtos/chapter.patch.dto";

type ChapterLike = Chapter & {
  storyArcId?: number;
};

export class ChapterRepository extends GenericRepository {
  private selectStatement =
    "id, uuid, name, storyArcId:story_arc_id, steps:step(id, name, description, date, chapterId:chapter_id, placeId:place_id)";

  constructor() {
    super("chapter");
  }

  getAll = async (): Promise<Array<ChapterLike>> => {
    const chapters = await this.client
      .from(this.name)
      .select("id, uuid, name)");

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
    const payload = this.convertDtoToPayload(chapterPatchDto);

    const chapter = await this.client
      .from(this.name)
      .update(payload)
      .eq("uuid", uuid)
      .select(this.selectStatement);

    return chapter.data?.[0] as unknown as ChapterLike;
  };

  private convertDtoToPayload = (
    chapterPatchDto: ChapterPatchDto,
  ): {
    name?: string;
    story_arc_id?: number;
  } => {
    const payload: { name?: string; story_arc_id?: number } = {};

    if (chapterPatchDto.name !== undefined) {
      payload.name = chapterPatchDto.name;
    }

    if (chapterPatchDto.storyArcId !== undefined) {
      payload.story_arc_id = chapterPatchDto.storyArcId;
    }

    return payload;
  };
}
