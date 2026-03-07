export class AudioPatchDto {
  name?: string;
  filename?: string;
  loop?: boolean;
  autoPlay?: boolean;
  volume?: number;
  helper?: string;
  stepId?: number;

  validate = async (): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (
      this.name === undefined &&
      this.filename === undefined &&
      this.loop === undefined &&
      this.autoPlay === undefined &&
      this.volume === undefined &&
      this.helper === undefined &&
      this.stepId === undefined
    ) {
      errors.push("At least one field is required for patch");
    }

    return errors;
  };
}
