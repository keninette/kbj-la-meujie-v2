import { AudioDto } from "@/app/_lib/model/audio/dtos/audio.dto";

type AudioPatchDtoProps = Partial<
  Pick<AudioDto, "name" | "filename" | "loop" | "autoPlay" | "volume" | "helper" | "stepUuid">
>;

export class AudioPatchDto implements AudioPatchDtoProps {
  name?: AudioDto["name"];
  filename?: AudioDto["filename"];
  loop?: AudioDto["loop"];
  autoPlay?: AudioDto["autoPlay"];
  volume?: AudioDto["volume"];
  helper?: AudioDto["helper"];
  stepUuid?: AudioDto["stepUuid"];

  validate = async (): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (
      this.name === undefined &&
      this.filename === undefined &&
      this.loop === undefined &&
      this.autoPlay === undefined &&
      this.volume === undefined &&
      this.helper === undefined &&
      this.stepUuid === undefined
    ) {
      errors.push("At least one field is required for patch");
    }

    return errors;
  };
}
