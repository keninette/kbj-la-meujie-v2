export class StepPatchDto {
  name?: string;
  description?: string;
  date?: string;
  chapterId?: number;
  placeId?: number;

  validate = async (): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (
      this.name === undefined &&
      this.description === undefined &&
      this.date === undefined &&
      this.chapterId === undefined &&
      this.placeId === undefined
    ) {
      errors.push("At least one field is required for patch");
    }

    return errors;
  };
}
