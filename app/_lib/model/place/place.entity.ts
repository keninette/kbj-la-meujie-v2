import { Picture } from "../picture/picture.entity";

export class Place {
  id!: number;
  uuid!: string;
  name!: string;
  publicDescription!: string;
  privateDescription?: string;
  picture?: Picture;
  pinId?: string;
  isStepBound!: boolean;

  constructor() {
    this.isStepBound = true;
  }
}
