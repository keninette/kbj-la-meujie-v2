import { StepDto } from "@/app/_lib/model/step/dtos/step.dto";

type StepPatchDtoProps = Partial<
  Pick<StepDto, "name" | "description" | "date" | "chapterUuid" | "placeUuid">
>;

export class StepPatchDto implements StepPatchDtoProps {
  name?: StepDto["name"];
  description?: StepDto["description"];
  date?: StepDto["date"];
  chapterUuid?: StepDto["chapterUuid"];
  placeUuid?: StepDto["placeUuid"];

  validate = async (): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (
      this.name === undefined &&
      this.description === undefined &&
      this.date === undefined &&
      this.chapterUuid === undefined &&
      this.placeUuid === undefined
    ) {
      errors.push("At least one field is required for patch");
    }

    return errors;
  };
}
