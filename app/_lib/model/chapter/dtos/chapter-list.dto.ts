import { ChapterDto } from "@lib/model/chapter/dtos/chapter.dto";

export type ChapterListDto = Pick<ChapterDto, "uuid" | "name">;
