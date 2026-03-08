import { Chapter } from "@/app/_lib/model/chapter/chapter.entity";
import { ChapterDto } from "@/app/_lib/model/chapter/dtos/chapter.dto";
import { ChapterListDto } from "@/app/_lib/model/chapter/dtos/chapter-list.dto";
import { StepMapper } from "../step/step.mapper";

type ChapterLike = Chapter & {
  id?: number;
  storyArcId?: number;
  storyArcUuid?: string;
  storyArc?: {
    uuid?: string;
  };
};

export class ChapterMapper {
  toChapterListDto(rawChapter: ChapterLike): ChapterListDto {
    return {
      uuid: rawChapter.uuid,
      name: rawChapter.name,
    };
  }

  toChapterDto(rawChapter: ChapterLike, stepMapper: StepMapper): ChapterDto {
    const steps =
      rawChapter.steps &&
      stepMapper.toStepListDtos(rawChapter.steps).map((step) => ({
        ...step,
        chapterUuid: rawChapter.uuid,
      }));

    return {
      ...this.toChapterListDto(rawChapter),
      storyArcUuid: rawChapter.storyArc?.uuid ?? rawChapter.storyArcUuid,
      steps,
    };
  }

  toChapterDtos(
    rawChapters: ChapterLike[],
    stepMapper: StepMapper,
  ): ChapterDto[] {
    return rawChapters.map((rawChapter) =>
      this.toChapterDto(rawChapter, stepMapper),
    );
  }

  toChapterListDtos(rawChapters: ChapterLike[]): ChapterListDto[] {
    return rawChapters.map((rawChapter) => this.toChapterListDto(rawChapter));
  }
}
