import { Universe } from "@lib/universe/universe.entity";
import { v4 as uuidv4 } from "uuid";

export class Adventure {
  id!: number;
  name!: string;
  universe?: Universe;
  uuid!: string;

  constructor() {
    this.uuid = uuidv4();
  }
}
