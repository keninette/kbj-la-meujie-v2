import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { translate } from "@/app/_dictionaries/dictionnary";

type TargetInputProps = {
  inputName: string;
  characters: CombatCharacter[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const TargetInput = ({
  inputName,
  characters,
  onChange,
}: TargetInputProps) => {
  return (
    <>
      <label htmlFor={inputName}>
        {translate("attack.target", "combatTracker")}
      </label>
      <select name={inputName} id={inputName} onChange={onChange}>
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
