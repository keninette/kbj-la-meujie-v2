import { UniverseDto } from "@lib/model/universe/dtos/universe.dto";
import { StoryArcDto } from "@lib/model/storyArc/dtos/story-arc.dto";

export class AdventureDto {
  name!: string;
  uuid!: string;
  universe?: UniverseDto;
  storyArcs?: StoryArcDto[];
}
