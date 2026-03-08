import { PlaceDto } from "@/app/_lib/model/place/dtos/place.dto";

export type PlaceListDto = Pick<
  PlaceDto,
  "uuid" | "name" | "pinId" | "isStepBound"
>;
