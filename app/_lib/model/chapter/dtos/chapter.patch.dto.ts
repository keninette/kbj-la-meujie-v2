export class ChapterPatchDto {
  name?: string;
  storyArcId?: number;

  validate = async (): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (this.name === undefined && this.storyArcId === undefined) {
      errors.push("At least one field is required for patch");
    }

    return errors;
  };
}
