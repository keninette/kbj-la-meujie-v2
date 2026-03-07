import { Adventure } from "@/app/_lib/model/adventure/adventure.entity";
import { AdventureListDto } from "@/app/_lib/model/adventure/dtos/adventure-list.dto";
import { UniverseMapper } from "@/app/_lib/model/universe/universe.mapper";
import { AdventureDto } from "@/app/_lib/model/adventure/dtos/adventure.dto";
import { ChapterMapper } from "../chapter/chapter.mapper";
import { StoryArcMapper } from "../storyArc/story-arc.mapper";

export class AdventureMapper {
  private storyArcMapper: StoryArcMapper;
  private chapterMapper: ChapterMapper;

  constructor() {
    this.storyArcMapper = new StoryArcMapper();
    this.chapterMapper = new ChapterMapper();
  }

  toAdventureListDto(
    rawAdventure: Adventure,
    universeMapper: UniverseMapper,
  ): AdventureListDto {
    return {
      name: rawAdventure.name,
      uuid: rawAdventure.uuid,
      universe:
        rawAdventure.universe &&
        universeMapper.toUniverseDto(rawAdventure.universe),
    };
  }

  toAdventureDto(
    rawAdventure: Adventure,
    universeMapper: UniverseMapper,
  ): AdventureDto {
    return {
      ...rawAdventure,
      universe:
        rawAdventure.universe &&
        universeMapper.toUniverseDto(rawAdventure.universe),
      storyArcs:
        rawAdventure.storyArcs &&
        this.storyArcMapper.toStoryArcDtos(
          rawAdventure.storyArcs,
          this.chapterMapper,
        ),
    };
  }

  toAdventureListDtos(
    rawAdventures: Adventure[],
    universeMapper: UniverseMapper,
  ): AdventureListDto[] {
    return rawAdventures.map((rawAdventure) =>
      this.toAdventureListDto(rawAdventure, universeMapper),
    );
  }
}
