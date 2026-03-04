import "server-only";

import { AdventureRepository } from "@/app/_lib/adventure/adventure.repository";
import { AdventureMapper } from "@/app/_lib/adventure/adventure.mapper";
import { UniverseMapper } from "@lib/universe/universe.mapper";
import { AdventureDto } from "./dtos/adventure.dto";
import { AdventurePatchDto } from "./dtos/adventure.patch.dto";

export class AdventureService {
  private repository: AdventureRepository;
  private mapper: AdventureMapper;
  private universeMapper: UniverseMapper;

  constructor(repository: AdventureRepository) {
    this.repository = repository;
    this.mapper = new AdventureMapper();
    this.universeMapper = new UniverseMapper();
  }

  getAll = async () => {
    const adventures = await this.repository.getAll();

    return this.mapper.toAdventureListDtos(adventures, this.universeMapper);
  };

  getOne = async (uuid: string) => {
    const adventure = await this.repository.getOne(uuid);

    return this.mapper.toAdventureDto(adventure, this.universeMapper);
  };

  patchOne = async (
    uuid: string,
    adventurePatchDto: AdventurePatchDto,
  ): Promise<AdventureDto> => {
    const adventure = await this.repository.patchOne(uuid, adventurePatchDto);

    return this.mapper.toAdventureDto(adventure, this.universeMapper);
  };
}
