import { ChapterDto } from "@/app/_lib/model/chapter/dtos/chapter.dto";

type ChapterPatchDtoProps = Partial<Pick<ChapterDto, "name" | "storyArcUuid">>;

export class ChapterPatchDto implements ChapterPatchDtoProps {
  name?: ChapterDto["name"];
  storyArcUuid?: ChapterDto["storyArcUuid"];

  validate = async (): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (this.name === undefined && this.storyArcUuid === undefined) {
      errors.push("At least one field is required for patch");
    }

    return errors;
  };
}
