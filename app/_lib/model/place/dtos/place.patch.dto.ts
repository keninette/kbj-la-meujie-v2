import { PlaceDto } from "@/app/_lib/model/place/dtos/place.dto";

type PlacePatchDtoProps = Partial<
  Pick<
    PlaceDto,
    "name" | "publicDescription" | "privateDescription" | "picture" | "pinId" | "isStepBound"
  >
>;

export class PlacePatchDto implements PlacePatchDtoProps {
  name?: PlaceDto["name"];
  publicDescription?: PlaceDto["publicDescription"];
  privateDescription?: PlaceDto["privateDescription"];
  picture?: PlaceDto["picture"];
  pinId?: PlaceDto["pinId"];
  isStepBound?: PlaceDto["isStepBound"];

  validate = async (): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (
      this.name === undefined &&
      this.publicDescription === undefined &&
      this.privateDescription === undefined &&
      this.picture === undefined &&
      this.pinId === undefined &&
      this.isStepBound === undefined
    ) {
      errors.push("At least one field is required for patch");
    }

    return errors;
  };
}
