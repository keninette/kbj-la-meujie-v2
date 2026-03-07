import { ChapterMapper } from "@/app/_lib/model/chapter/chapter.mapper";
import { StoryArc } from "@/app/_lib/model/storyArc/storyArc.entity";
import { StoryArcDto } from "@/app/_lib/model/storyArc/dtos/story-arc.dto";
import { StoryArcListDto } from "@/app/_lib/model/storyArc/dtos/story-arc-list.dto";

type StoryArcLike = StoryArc & {
  adventureId?: number;
};

export class StoryArcMapper {
  toStoryArcListDto(rawStoryArc: StoryArcLike): StoryArcListDto {
    return {
      uuid: rawStoryArc.uuid,
      name: rawStoryArc.name,
    };
  }

  toStoryArcDto(
    rawStoryArc: StoryArcLike,
    chapterMapper: ChapterMapper,
  ): StoryArcDto {
    return {
      ...this.toStoryArcListDto(rawStoryArc),
      chapters:
        rawStoryArc.chapters &&
        chapterMapper.toChapterListDtos(rawStoryArc.chapters),
    };
  }

  toStoryArcDtos(
    rawStoryArcs: StoryArcLike[],
    chapterMapper: ChapterMapper,
  ): StoryArcDto[] {
    return rawStoryArcs.map((rawStoryArc) =>
      this.toStoryArcDto(rawStoryArc, chapterMapper),
    );
  }

  toStoryArcListDtos(rawStoryArcs: StoryArcLike[]): StoryArcListDto[] {
    return rawStoryArcs.map((rawStoryArc) =>
      this.toStoryArcListDto(rawStoryArc),
    );
  }
}
