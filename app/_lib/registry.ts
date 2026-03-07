import "server-only";

import { AdventureRepository } from "@/app/_lib/model/adventure/adventure.repository";
import { AdventureService } from "@/app/_lib/model/adventure/adventure.service";
import { StoryArcRepository } from "@/app/_lib/model/storyArc/story-arc.repository";
import { StoryArcService } from "@/app/_lib/model/storyArc/story-arc.service";
import { UniverseRepository } from "@/app/_lib/model/universe/universe.repository";
import { UniverseService } from "@/app/_lib/model/universe/universe.service";

let adventureRepositoryInstance: AdventureRepository | null = null;
let adventureServiceInstance: AdventureService | null = null;
let storyArcRepositoryInstance: StoryArcRepository | null = null;
let storyArcServiceInstance: StoryArcService | null = null;
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

const getStoryArcRepository = (): StoryArcRepository => {
  if (!storyArcRepositoryInstance) {
    storyArcRepositoryInstance = new StoryArcRepository();
  }
  return storyArcRepositoryInstance;
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

export const getStoryArcService = (): StoryArcService => {
  if (!storyArcServiceInstance) {
    storyArcServiceInstance = new StoryArcService(getStoryArcRepository());
  }
  return storyArcServiceInstance;
};
