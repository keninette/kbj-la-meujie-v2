import { Universe } from "@/app/_lib/model/universe/universe.entity";
import { v4 as uuidv4 } from "uuid";

export class Adventure {
  id!: number;
  uuid!: string;
  name!: string;
  universe?: Universe;

  constructor() {
    this.uuid = uuidv4();
  }
}
