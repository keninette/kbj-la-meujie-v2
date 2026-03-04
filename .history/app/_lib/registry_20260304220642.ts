import "server-only";

import { AdventureRepository } from "@lib/adventure/adventure.repository";
import { AdventureService } from "@lib/adventure/adventure.service";
import { UniverseRepository } from "@lib/universe/universe.repository";
import { UniverseService } from "@lib/universe/universe.service";

let adventureRepositoryInstance: AdventureRepository | null = null;
let adventureServiceInstance: AdventureService | null = null;
let universeRepositoryInstance: UniverseRepository | null = null;
let universeServiceInstance: UniverseService | null = null;

const getAdventureRepository = (): AdventureRepository => {
  if (!adventureRepositoryInstance) {
    adventureRepositoryInstance = new AdventureRepository();
  }
  return adventureRepositoryInstance;
};

const getUniverseRepository = (): UniverseRepository => {
  if (!universeRepositoryInstance) {
    universeRepositoryInstance = new UniverseRepository();
  }
  return universeRepositoryInstance;
};

export const getAdventureService = (): AdventureService => {
  if (!adventureServiceInstance) {
    adventureServiceInstance = new AdventureService(getAdventureRepository());
  }
  return adventureServiceInstance;
};

export const getUniverseService = (): UniverseService => {
  if (!universeServiceInstance) {
    universeServiceInstance = new UniverseService(getUniverseRepository());
  }
  return universeServiceInstance;
};
