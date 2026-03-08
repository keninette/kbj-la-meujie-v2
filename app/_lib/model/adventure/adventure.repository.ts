import "server-only";

import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { Adventure } from "@/app/_lib/model/adventure/adventure.entity";
import { AdventurePatchDto } from "@/app/_lib/model/adventure/dtos/adventure.patch.dto";

export class AdventureRepository extends GenericRepository {
  private selectStatement =
    "id, name, uuid, universe(uuid, code, name, icon), storyArcs:story_arc(id, uuid, name, adventureId:adventure_id, chapters:chapter(id, uuid, name, storyArcId:story_arc_id))";

  constructor() {
    super("adventure");
  }

  getAll = async (): Promise<Array<Adventure>> => {
    const allAdventures = await this.client
      .from(this.name)
      .select(`id, name, uuid, universe(uuid, code, name, icon)`);

    return (allAdventures.data ?? []) as unknown as Adventure[];
  };

  getOne = async (uuid: string): Promise<Adventure> => {
    const adventure = await this.client
      .from(this.name)
      .select(this.selectStatement)
      .eq("uuid", uuid);

    return adventure.data?.[0] as unknown as Adventure;
  };

  patchOne = async (
    uuid: string,
    adventurePatchDto: AdventurePatchDto,
  ): Promise<Adventure> => {
    const payload = this.convertDtoToPayload(adventurePatchDto);

    const adventure = await this.client
      .from(this.name)
      .update(payload)
      .eq("uuid", uuid)
      .select(this.selectStatement);

    return adventure.data?.[0] as unknown as Adventure;
  };

  private convertDtoToPayload = (
    adventurePatchDto: AdventurePatchDto,
  ): {
    name?: string;
    universe_code?: string;
  } => {
    const payload: { name?: string; universe_code?: string } = {};

    if (adventurePatchDto.name !== undefined) {
      payload.name = adventurePatchDto.name;
    }

    if (adventurePatchDto.universeCode !== undefined) {
      payload.universe_code = adventurePatchDto.universeCode;
    }

    return payload;
  };
}
