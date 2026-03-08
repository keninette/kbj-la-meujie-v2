import { AdventureDto } from "@/app/_lib/model/adventure/dtos/adventure.dto";

export type AdventureListDto = Pick<AdventureDto, "uuid" | "name" | "universe">;
