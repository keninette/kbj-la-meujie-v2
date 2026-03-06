import { Adventure } from "@/app/_lib/model/adventure/adventure.entity";
import { AdventureListDto } from "@/app/_lib/model/adventure/dtos/adventure-list.dto";
import { UniverseMapper } from "@/app/_lib/model/universe/universe.mapper";
import { AdventureDto } from "@/app/_lib/model/adventure/dtos/adventure.dto";

export class AdventureMapper {
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
