import { AdventureDto } from "@lib/model/adventure/dtos/adventure.dto";

export type AdventureListDto = Pick<AdventureDto, "uuid" | "name" | "universe">;
