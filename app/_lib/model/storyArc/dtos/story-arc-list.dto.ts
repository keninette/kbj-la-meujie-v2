import { StoryArcDto } from "@/app/_lib/model/storyArc/dtos/story-arc.dto";

export type StoryArcListDto = Pick<StoryArcDto, "uuid" | "name">;
