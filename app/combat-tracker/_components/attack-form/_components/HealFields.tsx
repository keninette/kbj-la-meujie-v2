import type { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { useFormContext } from "react-hook-form";
import type { AttackFormValues } from "../attack-form.helper";
import TargetInput from "./TargetInput";
import styles from "../attack-form.module.scss";

type HealFieldsProps = {
  characters: CombatCharacter[];
  disabled: boolean;
  onAddHistory: () => void;
};

const HealFields = ({
  characters,
  disabled,
  onAddHistory,
}: HealFieldsProps) => {
  const { register } = useFormContext<AttackFormValues>();

  return (
    <fieldset className={styles["attack-form__fieldset"]}>
      <h3 className={styles["attack-form__fieldset-title"]}>
        {translate("attack.heal", "combatTracker")}
      </h3>
      <TargetInput
        characters={characters.filter((character) => !character.isDead)}
        registration={register("healTargetId")}
        inputName="healTargetId"
      />
      <label htmlFor="healAmount">
        {translate("attack.healAmount", "combatTracker")}
      </label>
      <input
        {...register("healAmount", {
          setValueAs: (value) => (value === "" ? 0 : Number(value)),
        })}
        type="number"
        id="healAmount"
        min="0"
        data-testid="healAmount"
      />
      <ButtonWithIcon
        variant={ButtonVariant.SECONDARY}
        label={translate("attack.validate", "combatTracker")}
        faIcon="check"
        faIconStyle={FaIconStyleEnum.SOLID}
        iconPosition="left"
        type="button"
        disabled={disabled}
        onClick={onAddHistory}
      />
    </fieldset>
  );
};

export default HealFields;
