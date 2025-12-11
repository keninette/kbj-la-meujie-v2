import { Adventure } from "@/app/_lib/adventure/adventure.entity";
import { AdventureListDto } from "@lib/adventure/dtos/adventure-list.dto";
import { UniverseMapper } from "@lib/universe/universe.mapper";

export class AdventureMapper {
  toAdventureListDto(
    rawAdventure: Adventure,
    universeMapper: UniverseMapper,
  ): AdventureListDto {
    return {
      ...rawAdventure,
      universe:
        rawAdventure.universe &&
        universeMapper.toUniverseDto(rawAdventure.universe),
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
