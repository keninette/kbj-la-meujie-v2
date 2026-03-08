import { UniverseDto } from "@/app/_lib/model/universe/dtos/universe.dto";
import { AdventureDto } from "@/app/_lib/model/adventure/dtos/adventure.dto";

type UniverseServiceLike = {
  getAll: () => Promise<Array<UniverseDto>>;
};

type AdventurePatchDtoProps = Partial<Pick<AdventureDto, "name">> & {
  universeCode?: string;
};

export class AdventurePatchDto implements AdventurePatchDtoProps {
  name?: AdventureDto["name"];
  universeCode?: string;

  validate = async (
    universeService: UniverseServiceLike,
  ): Promise<Array<string>> => {
    const errors: Array<string> = [];

    if (!this.name && !this.universeCode) {
      errors.push("At least one field is required for patch");
    }

    if (this.universeCode !== undefined) {
      const universes = await universeService.getAll();
      const universeExists = universes.some(
        (universe) => universe.code === this.universeCode,
      );

      if (!universeExists) {
        errors.push("Provided universeCode does not exist");
      }
    }

    return errors;
  };
}
