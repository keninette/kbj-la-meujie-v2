import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { translate } from "@/app/_dictionaries/dictionnary";
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
}: TargetInputProps) => {
  return (
    <>
      <label htmlFor={inputName}>
        {translate("attack.target", "combatTracker")}
      </label>
      <select {...registration} id={inputName} data-testid={inputName}>
        <option value="">-</option>
        {characters?.map((char) => (
          <option key={char.id} value={char.id}>
            {char.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default TargetInput;
