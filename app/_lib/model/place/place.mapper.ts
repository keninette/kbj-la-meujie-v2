import { Place } from "@/app/_lib/model/place/place.entity";
import { PlaceDto } from "@/app/_lib/model/place/dtos/place.dto";
import { PlaceListDto } from "@/app/_lib/model/place/dtos/place-list.dto";

type PlaceLike = Place & {
  picture?: unknown;
};

type PictureLike = {
  uuid?: string;
  name?: string;
  filename?: string;
};

export class PlaceMapper {
  toPlaceListDto(rawPlace: PlaceLike): PlaceListDto {
    return {
      uuid: rawPlace.uuid,
      name: rawPlace.name,
      pinId: rawPlace.pinId,
      isStepBound: rawPlace.isStepBound,
    };
  }

  toPlaceDto(rawPlace: PlaceLike): PlaceDto {
    const picture = rawPlace.picture as PictureLike | undefined;

    return {
      ...this.toPlaceListDto(rawPlace),
      publicDescription: rawPlace.publicDescription,
      privateDescription: rawPlace.privateDescription,
      picture:
        picture && picture.uuid && picture.name && picture.filename
          ? {
              uuid: picture.uuid,
              name: picture.name,
              filename: picture.filename,
            }
          : undefined,
    };
  }

  toPlaceDtos(rawPlaces: PlaceLike[]): PlaceDto[] {
    return rawPlaces.map((rawPlace) => this.toPlaceDto(rawPlace));
  }

  toPlaceListDtos(rawPlaces: PlaceLike[]): PlaceListDto[] {
    return rawPlaces.map((rawPlace) => this.toPlaceListDto(rawPlace));
  }
}
