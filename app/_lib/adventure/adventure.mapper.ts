import { Adventure } from "@/app/_lib/adventure/adventure.entity";
import { AdventureListDto } from "@/app/_lib/adventure/adventure-list.dto";

export class AdventureMapper {
  toAdventureListDto(rawAdventure: Adventure): AdventureListDto {
    return {
      ...rawAdventure,
    };
  }

  toAdventureListDtos(rawAdventures: Adventure[]): AdventureListDto[] {
    return rawAdventures.map((rawAdventure) =>
      this.toAdventureListDto(rawAdventure),
    );
  }
}
