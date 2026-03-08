import { UniverseDto } from "@/app/_lib/model/universe/dtos/universe.dto";
import { StoryArcDto } from "@/app/_lib/model/storyArc/dtos/story-arc.dto";

export class AdventureDto {
  name!: string;
  uuid!: string;
  universe?: UniverseDto;
  storyArcs?: StoryArcDto[];
}
