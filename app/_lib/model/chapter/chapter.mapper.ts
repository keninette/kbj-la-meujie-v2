import { Chapter } from "@/app/_lib/model/chapter/chapter.entity";
import { ChapterDto } from "@/app/_lib/model/chapter/dtos/chapter.dto";
import { ChapterListDto } from "@/app/_lib/model/chapter/dtos/chapter-list.dto";
import { StepMapper } from "../step/step.mapper";

type ChapterLike = Chapter & {
  storyArcId?: number;
};

export class ChapterMapper {
  toChapterListDto(rawChapter: ChapterLike): ChapterListDto {
    return {
      id: rawChapter.id,
      uuid: rawChapter.uuid,
      name: rawChapter.name,
    };
  }

  toChapterDto(rawChapter: ChapterLike, stepMapper: StepMapper): ChapterDto {
    return {
      ...this.toChapterListDto(rawChapter),
      steps: rawChapter.steps && stepMapper.toStepListDtos(rawChapter.steps),
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
