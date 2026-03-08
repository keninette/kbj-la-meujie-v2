import { StoryArcDto } from "@/app/_lib/model/storyArc/dtos/story-arc.dto";

type StoryArcCreateDtoProps = Pick<StoryArcDto, "name">;

export class StoryArcCreateDto implements Partial<StoryArcCreateDtoProps> {
  name?: StoryArcDto["name"];

  validate = async (): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (this.name === undefined || this.name.trim().length === 0) {
      errors.push("name is required");
    }

    return errors;
  };
}
