import { UniverseDto } from "@lib/universe/dtos/universe.dto";

type UniverseServiceLike = {
  getAll: () => Promise<Array<UniverseDto>>;
};

export class AdventurePatchDto {
  name?: string;
  universeCode?: string;

  validate = async (universeService: UniverseServiceLike): Promise<Array<string>> => {
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