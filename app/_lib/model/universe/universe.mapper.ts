import { UniverseDto } from "@/app/_lib/model/universe/dtos/universe.dto";
import { Universe } from "@/app/_lib/model/universe/universe.entity";

export class UniverseMapper {
  toUniverseDto(rawUniverse: Universe): UniverseDto {
    return {
      ...rawUniverse,
    };
  }

  toUniverseDtos(rawUniverses: UniverseDto[]): UniverseDto[] {
    return rawUniverses.map((rawUniverse) => this.toUniverseDto(rawUniverse));
  }
}
