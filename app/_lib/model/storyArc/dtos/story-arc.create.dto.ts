import { StoryArcDto } from "@lib/model/storyArc/dtos/story-arc.dto";

type StoryArcCreateDtoProps = Pick<StoryArcDto, "name">;

export class StoryArcCreateDto implements Partial<StoryArcCreateDtoProps> {
  name?: StoryArcDto["name"];
  adventureUuid?: string;

  validate = async (): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (this.name === undefined || this.name.trim().length === 0) {
      errors.push("name is required");
    }

    if (this.adventureUuid === undefined || this.adventureUuid.trim().length === 0) {
      errors.push("adventureUuid is required");
    }

    return errors;
  };
}
