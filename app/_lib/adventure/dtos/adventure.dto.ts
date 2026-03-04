import { UniverseDto } from "@lib/universe/dtos/universe.dto";

export class AdventureDto {
  id!: number;
  name!: string;
  uuid!: string;
  universe?: UniverseDto;
}
