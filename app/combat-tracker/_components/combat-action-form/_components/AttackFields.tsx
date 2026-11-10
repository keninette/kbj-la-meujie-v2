import type { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { useFormContext } from "react-hook-form";
import type { CombatActionFormValues } from "../combat-action-form.helper";
import TargetInput from "./TargetInput";
import styles from "../combat-action-form.module.scss";

type AttackFieldsProps = {
  characters: CombatCharacter[];
  disabled: boolean;
  onAddHistory: () => void;
};

const AttackFields = ({
  characters,
  disabled,
  onAddHistory,
}: AttackFieldsProps) => {
  const { register } = useFormContext<CombatActionFormValues>();

  return (
    <fieldset className={styles["combat-action-form__fieldset"]}>
      <h3 className={styles["combat-action-form__fieldset-title"]}>
        {translate("combatAction.attack", "combatTracker")}
      </h3>
      <TargetInput
        characters={characters}
        registration={register("attackTargetId")}
        inputName="targetName"
      />
      <label htmlFor="damage">
        {translate("combatAction.damage", "combatTracker")}
      </label>
      <input
        {...register("attackDamage", {
          setValueAs: (value) => (value === "" ? 0 : Number(value)),
        })}
        type="number"
        id="attackDamage"
        min="0"
        data-testid="attackDamage"
      />
      <ButtonWithIcon
        variant={ButtonVariant.SECONDARY}
        label={translate("combatAction.validate", "combatTracker")}
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

export default AttackFields;
