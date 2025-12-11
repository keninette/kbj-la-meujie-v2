import { Universe } from "@lib/universe/universe.entity";

export class Adventure {
  id!: number;
  name!: string;
  universe?: Universe;
}
