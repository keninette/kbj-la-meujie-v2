import { UniverseDto } from "@lib/universe/dtos/universe.dto";

export class AdventureListDto {
  name!: string;
  uuid!: string;
  universe?: UniverseDto;
}
