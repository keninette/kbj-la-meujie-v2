import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { Adventure } from "@lib/adventure/adventure.entity";

export class AdventureRepository extends GenericRepository {
  constructor() {
    super("adventure");
  }

  getAll = async (): Promise<Array<Adventure>> => {
    const allAdventures = await this.client
      .from(this.name)
      .select(`id, name, universe(code, name, icon)`);

    return (allAdventures.data ?? []) as unknown as Adventure[];
  };
}
