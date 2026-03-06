import { UniverseDto } from "@/app/_lib/model/universe/dtos/universe.dto";

export class AdventureListDto {
  name!: string;
  uuid!: string;
  universe?: UniverseDto;
}
