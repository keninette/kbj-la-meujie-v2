import { CombatCharacter } from "@/app/combat-tracker/page";

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
      <label htmlFor={inputName}>Cible</label>
      <select name={inputName} id={inputName} onChange={onChange}>
        <option value="">-</option>
        {characters?.map((char) => (
          <option key={char.name} value={char.name}>
            {char.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default TargetInput;
