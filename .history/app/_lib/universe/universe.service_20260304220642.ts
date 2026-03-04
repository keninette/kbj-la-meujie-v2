import "server-only";

import { cache } from "react";
import { UniverseMapper } from "@lib/universe/universe.mapper";
import { UniverseRepository } from "@lib/universe/universe.repository";

export class UniverseService {
  private repository: UniverseRepository;
  private mapper: UniverseMapper;

  constructor(repository: UniverseRepository) {
    this.repository = repository;
    this.mapper = new UniverseMapper();
  }

  getAll = cache(async () => {
    const universes = await this.repository.getAll();

    return this.mapper.toUniverseDtos(universes);
  });
}
