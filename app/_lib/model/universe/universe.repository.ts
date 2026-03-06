import "server-only";

import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { Universe } from "@/app/_lib/model/universe/universe.entity";

export class UniverseRepository extends GenericRepository {
  constructor() {
    super("universe");
  }

  getAll = async (): Promise<Array<Universe>> => {
    const allUniverses = await this.client.from(this.name).select();

    return (allUniverses.data ?? []) as unknown as Universe[];
  };
}
