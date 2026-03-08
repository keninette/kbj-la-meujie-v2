import { Universe } from "@/app/_lib/model/universe/universe.entity";
import { v4 as uuidv4 } from "uuid";
import { StoryArc } from "../storyArc/storyArc.entity";

export class Adventure {
  id!: number;
  uuid!: string;
  name!: string;
  universe?: Universe;
  storyArcs?: StoryArc[];

  constructor() {
    this.uuid = uuidv4();
  }
}
