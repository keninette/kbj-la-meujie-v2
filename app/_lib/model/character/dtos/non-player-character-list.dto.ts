import { NonPlayerCharacterDto } from "@/app/_lib/model/character/dtos/non-player-character.dto";

export type NonPlayerCharacterListDto = Pick<
  NonPlayerCharacterDto,
  "uuid" | "name" | "type" | "ruleset" | "stepUuid"
>;
