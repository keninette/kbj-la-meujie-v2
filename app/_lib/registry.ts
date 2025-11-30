import { AdventureRepository } from "@lib/adventure/adventure.repository";
import { AdventureService } from "@lib/adventure/adventure.service";

let adventureRepositoryInstance: AdventureRepository | null = null;
let adventureServiceInstance: AdventureService | null = null;

const getAdventureRepository = (): AdventureRepository => {
  if (!adventureRepositoryInstance) {
    adventureRepositoryInstance = new AdventureRepository();
  }
  return adventureRepositoryInstance;
};

export const getAdventureService = (): AdventureService => {
  if (!adventureServiceInstance) {
    adventureServiceInstance = new AdventureService(getAdventureRepository());
  }
  return adventureServiceInstance;
};
