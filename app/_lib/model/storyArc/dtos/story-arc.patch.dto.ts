import { StoryArcDto } from "@/app/_lib/model/storyArc/dtos/story-arc.dto";

type StoryArcPatchDtoProps = Partial<Pick<StoryArcDto, "name" | "adventureUuid">>;

export class StoryArcPatchDto implements StoryArcPatchDtoProps {
  name?: StoryArcDto["name"];
  adventureUuid?: StoryArcDto["adventureUuid"];

  validate = async (): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (this.name === undefined && this.adventureUuid === undefined) {
      errors.push("At least one field is required for patch");
    }

    return errors;
  };
}
