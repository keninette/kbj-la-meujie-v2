import { StepListDto } from "../../step/dtos/step-list.dto";

export class ChapterDto {
  uuid!: string;
  name!: string;
  storyArcUuid?: string;
  steps?: StepListDto[];
}
