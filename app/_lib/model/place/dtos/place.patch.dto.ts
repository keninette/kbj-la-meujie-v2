export class PlacePatchDto {
  name?: string;
  publicDescription?: string;
  privateDescription?: string;
  picture?: unknown;
  pinId?: string;
  isStepBound?: boolean;

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
