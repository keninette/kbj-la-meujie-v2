import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { translate } from "@/app/_dictionaries/dictionnary";
import SelectInput from "@/app/_components/_basics/form/select-input/SelectInput";
import type { UseFormRegisterReturn } from "react-hook-form";

type TargetInputProps = {
  inputName: string;
  characters: CombatCharacter[];
  registration: UseFormRegisterReturn;
};

export const TargetInput = ({
  inputName,
  characters,
  registration,
}: TargetInputProps) => (
  <SelectInput
    id={inputName}
    label={translate("combatAction.target", "combatTracker")}
    {...registration}
    data-testid={inputName}
  >
    <option value="">-</option>
    {characters.map((character) => (
      <option key={character.id} value={character.id}>
        {character.name}
      </option>
    ))}
  </SelectInput>
);

export default TargetInput;
