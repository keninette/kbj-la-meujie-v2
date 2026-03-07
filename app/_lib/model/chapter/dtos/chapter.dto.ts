import { StepListDto } from "../../step/dtos/step-list.dto";

export class ChapterDto {
  id!: number;
  uuid!: string;
  name!: string;
  storyArcId?: number;
  steps?: StepListDto[];
}
