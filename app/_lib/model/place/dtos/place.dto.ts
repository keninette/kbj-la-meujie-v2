import { PictureDto } from "@/app/_lib/model/picture/dtos/picture.dto";

export class PlaceDto {
  uuid!: string;
  name!: string;
  publicDescription!: string;
  privateDescription?: string;
  picture?: PictureDto;
  pinId?: string;
  isStepBound!: boolean;
}
