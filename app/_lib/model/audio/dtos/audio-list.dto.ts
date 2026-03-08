import { AudioDto } from "@/app/_lib/model/audio/dtos/audio.dto";

export type AudioListDto = Pick<
  AudioDto,
  "uuid" | "name" | "filename" | "loop" | "autoPlay" | "volume" | "helper"
>;
