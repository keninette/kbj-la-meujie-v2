import "server-only";

import { StoryArcRepository } from "@/app/_lib/model/storyArc/story-arc.repository";
import { StoryArcMapper } from "@/app/_lib/model/storyArc/story-arc.mapper";
import { ChapterMapper } from "@/app/_lib/model/chapter/chapter.mapper";
import { StoryArcDto } from "@/app/_lib/model/storyArc/dtos/story-arc.dto";
import { StoryArcPatchDto } from "@/app/_lib/model/storyArc/dtos/story-arc.patch.dto";

export class StoryArcService {
  private repository: StoryArcRepository;
  private mapper: StoryArcMapper;
  private chapterMapper: ChapterMapper;

  constructor(repository: StoryArcRepository) {
    this.repository = repository;
    this.mapper = new StoryArcMapper();
    this.chapterMapper = new ChapterMapper();
  }

  patchOne = async (
    uuid: string,
    storyArcPatchDto: StoryArcPatchDto,
  ): Promise<StoryArcDto> => {
    const storyArc = await this.repository.patchOne(uuid, storyArcPatchDto);

    return this.mapper.toStoryArcDto(storyArc, this.chapterMapper);
  };
}
