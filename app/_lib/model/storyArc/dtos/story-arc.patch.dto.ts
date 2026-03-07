export class StoryArcPatchDto {
  name?: string;
  adventureId?: number;

  validate = async (): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (this.name === undefined && this.adventureId === undefined) {
      errors.push("At least one field is required for patch");
    }

    return errors;
  };
}
