import { UniverseDto } from "@lib/model/universe/dtos/universe.dto";
import { Universe } from "@lib/model/universe/universe.entity";

export class UniverseMapper {
  toUniverseDto(rawUniverse: Universe): UniverseDto {
    return {
      ...rawUniverse,
    };
  }

  toUniverseDtos(rawUniverses: Universe[]): UniverseDto[] {
    return rawUniverses.map((rawUniverse) => this.toUniverseDto(rawUniverse));
  }
}
