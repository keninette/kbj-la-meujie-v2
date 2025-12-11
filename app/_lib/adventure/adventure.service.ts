import { cache } from "react";
import { AdventureRepository } from "@/app/_lib/adventure/adventure.repository";
import { AdventureMapper } from "@/app/_lib/adventure/adventure.mapper";
import { UniverseMapper } from "@lib/universe/universe.mapper";

export class AdventureService {
  private repository: AdventureRepository;
  private mapper: AdventureMapper;
  private universeMapper: UniverseMapper;

  constructor(repository: AdventureRepository) {
    this.repository = repository;
    this.mapper = new AdventureMapper();
    this.universeMapper = new UniverseMapper();
  }

  getAll = cache(async () => {
    const adventures = await this.repository.getAll();

    return this.mapper.toAdventureListDtos(adventures, this.universeMapper);
  });
}
