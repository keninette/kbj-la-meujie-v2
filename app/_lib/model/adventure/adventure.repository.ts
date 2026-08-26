import "server-only";

import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { Adventure } from "@lib/model/adventure/adventure.entity";
import { AdventurePatchDto } from "@lib/model/adventure/dtos/adventure.patch.dto";

export class AdventureRepository extends GenericRepository {
  // todo fix universe uuid vs code
  private selectStatement =
    "id, name, uuid, universe(code, name, icon), storyArcs:story_arc(uuid, name, adventureId:adventure_id, chapters:chapter(uuid, name, storyArcId:story_arc_id))";

  constructor() {
    super("adventure");
  }

  /**
   * Fetches all adventures with basic information and universe.
   * @returns <Array<Adventure>>
   */
  getAll = async (): Promise<Array<Adventure>> => {
    const allAdventures = await this.client
      .from(this.name)
      .select(`id, name, uuid, universe(code, name, icon)`);

    return (allAdventures.data ?? []) as unknown as Adventure[];
  };

  /**
   * Fetches a single adventure by its UUID with detailed information.
   * @param uuid - The UUID of the adventure to fetch.
   * @returns <Adventure>
   */
  getOne = async (uuid: string): Promise<Adventure> => {
    const adventure = await this.client
      .from(this.name)
      .select(this.selectStatement)
      .eq("uuid", uuid);

    return adventure.data?.[0] as unknown as Adventure;
  };

  /**
   * Updates a single adventure by its UUID with the provided patch data.
   * @param uuid - The UUID of the adventure to update.
   * @param adventurePatchDto - The patch data for the adventure.
   * @returns <Adventure>
   */
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

  /**
   * Converts any adventure DTO to a payload suitable for updating the database.
   * @param adventurePatchDto - The patch data for the adventure.
   * @returns An object containing the fields to be updated.
   */
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
