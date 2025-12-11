import { UniverseDto } from "@lib/universe/dtos/universe.dto";
import { Universe } from "@lib/universe/universe.entity";

export class UniverseMapper {
  toUniverseDto(rawUniverse: Universe): UniverseDto {
    return {
      ...rawUniverse,
    };
  }
}
