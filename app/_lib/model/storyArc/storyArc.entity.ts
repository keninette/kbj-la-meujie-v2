import { Chapter } from "../chapter/chapter.entity";
import { v4 as uuidv4 } from "uuid";

export class StoryArc {
  id!: number;
  uuid!: string;
  name!: string;
  chapters!: Chapter[];

  constructor() {
    this.uuid = uuidv4();
  }
}