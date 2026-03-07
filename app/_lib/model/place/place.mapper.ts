import { Place } from "@/app/_lib/model/place/place.entity";
import { PlaceDto } from "@/app/_lib/model/place/dtos/place.dto";
import { PlaceListDto } from "@/app/_lib/model/place/dtos/place-list.dto";

type PlaceLike = Place & {
  picture?: unknown;
};

export class PlaceMapper {
  toPlaceListDto(rawPlace: PlaceLike): PlaceListDto {
    return {
      id: rawPlace.id,
      name: rawPlace.name,
      pinId: rawPlace.pinId,
      isStepBound: rawPlace.isStepBound,
    };
  }

  toPlaceDto(rawPlace: PlaceLike): PlaceDto {
    return {
      ...this.toPlaceListDto(rawPlace),
      publicDescription: rawPlace.publicDescription,
      privateDescription: rawPlace.privateDescription,
      picture: rawPlace.picture,
    };
  }

  toPlaceDtos(rawPlaces: PlaceLike[]): PlaceDto[] {
    return rawPlaces.map((rawPlace) => this.toPlaceDto(rawPlace));
  }

  toPlaceListDtos(rawPlaces: PlaceLike[]): PlaceListDto[] {
    return rawPlaces.map((rawPlace) => this.toPlaceListDto(rawPlace));
  }
}
