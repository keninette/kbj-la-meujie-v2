import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { Adventure } from "@lib/adventure/adventure.entity";

export class AdventureRepository extends GenericRepository {
  constructor() {
    super("adventure");
  }

  getAll = async (): Promise<Array<Adventure>> => {
    const allAdventures = await this.client
      .from(this.name)
      .select(`id, name, uuid, universe(code, name, icon)`);

    return (allAdventures.data ?? []) as unknown as Adventure[];
  };

  getOne = async (uuid: string): Promise<Adventure> => {
    const adventure = await this.client
      .from(this.name)
      .select(`id, name, uuid, universe(code, name, icon)`)
      .eq("uuid", uuid);

    return adventure.data?.[0] as unknown as Adventure;
  };
}
