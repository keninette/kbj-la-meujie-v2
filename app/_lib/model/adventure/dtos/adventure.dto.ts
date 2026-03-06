import { UniverseDto } from "@/app/_lib/model/universe/dtos/universe.dto";

export class AdventureDto {
  id!: number;
  name!: string;
  uuid!: string;
  universe?: UniverseDto;
}
