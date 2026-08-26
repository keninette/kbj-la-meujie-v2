import { Step } from "../step/step.entity";
import { v4 as uuidv4 } from "uuid";

export class Chapter {
  id!: number;
  uuid!: string;
  name!: string;
  steps!: Step[];

  constructor() {
    this.uuid = uuidv4();
  }
}
