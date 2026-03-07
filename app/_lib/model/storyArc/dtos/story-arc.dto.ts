import { ChapterListDto } from "@/app/_lib/model/chapter/dtos/chapter-list.dto";

export class StoryArcDto {
  uuid!: string;
  name!: string;
  chapters?: ChapterListDto[];
}
