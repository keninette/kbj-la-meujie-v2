import { cache } from "react";
import { AdventureRepository } from "@/app/_lib/adventure/adventure.repository";
import { AdventureMapper } from "@/app/_lib/adventure/adventure.mapper";
import { Adventure } from "@/app/_lib/adventure/adventure.entity";
export class AdventureService {
  private repository: AdventureRepository;
  private mapper: AdventureMapper;

  constructor(repository: AdventureRepository) {
    this.repository = repository;
    this.mapper = new AdventureMapper();
  }

  getAll = cache(async () => {
    const adventures = await this.repository.getAll();
    return this.mapper.toAdventureListDtos(
      (adventures?.data ?? []) as Adventure[],
    );
  });
}
