import { StepDto } from "@/app/_lib/model/step/dtos/step.dto";

export type StepListDto = Pick<
  StepDto,
  "uuid" | "name" | "description" | "date" | "chapterUuid" | "placeUuid"
>;
