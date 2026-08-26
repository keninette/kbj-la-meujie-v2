import { ChapterMapper } from "@lib/model/chapter/chapter.mapper";
import { StoryArc } from "@lib/model/storyArc/storyArc.entity";
import { StoryArcDto } from "@lib/model/storyArc/dtos/story-arc.dto";
import { StoryArcListDto } from "@lib/model/storyArc/dtos/story-arc-list.dto";

type StoryArcLike = StoryArc & {
  adventureId?: number;
  adventureUuid?: string;
  adventure?: {
    uuid?: string;
  };
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
      adventureUuid: rawStoryArc.adventure?.uuid ?? rawStoryArc.adventureUuid,
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
