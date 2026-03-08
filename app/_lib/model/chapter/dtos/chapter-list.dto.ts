import { ChapterDto } from "@/app/_lib/model/chapter/dtos/chapter.dto";

export type ChapterListDto = Pick<ChapterDto, "uuid" | "name">;
