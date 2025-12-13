import { UniverseDto } from "@lib/universe/dtos/universe.dto";

export class AdventureListDto {
  id!: number;
  name!: string;
  universe?: UniverseDto;
}
