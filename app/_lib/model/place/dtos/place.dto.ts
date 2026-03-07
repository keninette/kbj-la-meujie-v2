export class PlaceDto {
  id!: number;
  name!: string;
  publicDescription!: string;
  privateDescription?: string;
  picture?: unknown;
  pinId?: string;
  isStepBound!: boolean;
}
