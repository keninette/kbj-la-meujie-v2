import "server-only";

import { GenericRepository } from "@lib/generic-classes/generic-repository";
import { Place } from "@/app/_lib/model/place/place.entity";
import { PlacePatchDto } from "@/app/_lib/model/place/dtos/place.patch.dto";

type PlaceLike = Place & {
  picture?: unknown;
};

export class PlaceRepository extends GenericRepository {
  private selectStatement =
    "id, uuid, name, publicDescription:public_description, privateDescription:private_description, picture, pinId:pin_id, isStepBound:is_step_bound";

  constructor() {
    super("place");
  }

  getAll = async (): Promise<Array<PlaceLike>> => {
    const places = await this.client
      .from(this.name)
      .select(this.selectStatement);

    return (places.data ?? []) as unknown as PlaceLike[];
  };

  getOne = async (id: number): Promise<PlaceLike> => {
    const place = await this.client
      .from(this.name)
      .select(this.selectStatement)
      .eq("id", id);

    return place.data?.[0] as unknown as PlaceLike;
  };

  patchOne = async (
    id: number,
    placePatchDto: PlacePatchDto,
  ): Promise<PlaceLike> => {
    const payload = this.convertDtoToPayload(placePatchDto);

    const place = await this.client
      .from(this.name)
      .update(payload)
      .eq("id", id)
      .select(this.selectStatement);

    return place.data?.[0] as unknown as PlaceLike;
  };

  private convertDtoToPayload = (
    placePatchDto: PlacePatchDto,
  ): {
    name?: string;
    public_description?: string;
    private_description?: string;
    picture?: unknown;
    pin_id?: string;
    is_step_bound?: boolean;
  } => {
    const payload: {
      name?: string;
      public_description?: string;
      private_description?: string;
      picture?: unknown;
      pin_id?: string;
      is_step_bound?: boolean;
    } = {};

    if (placePatchDto.name !== undefined) {
      payload.name = placePatchDto.name;
    }

    if (placePatchDto.publicDescription !== undefined) {
      payload.public_description = placePatchDto.publicDescription;
    }

    if (placePatchDto.privateDescription !== undefined) {
      payload.private_description = placePatchDto.privateDescription;
    }

    if (placePatchDto.picture !== undefined) {
      payload.picture = placePatchDto.picture;
    }

    if (placePatchDto.pinId !== undefined) {
      payload.pin_id = placePatchDto.pinId;
    }

    if (placePatchDto.isStepBound !== undefined) {
      payload.is_step_bound = placePatchDto.isStepBound;
    }

    return payload;
  };
}
