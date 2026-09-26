import type { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { useFormContext } from "react-hook-form";
import type { AttackFormValues } from "../attack-form.helper";
import TargetInput from "./TargetInput";
import styles from "../attack-form.module.scss";

type StateFieldsProps = {
  characters: CombatCharacter[];
  disabled: boolean;
  onAddHistory: () => void;
};

const StateFields = ({
  characters,
  disabled,
  onAddHistory,
}: StateFieldsProps) => {
  const { register } = useFormContext<AttackFormValues>();

  return (
    <fieldset className={styles["attack-form__fieldset"]}>
      <h3 className={styles["attack-form__fieldset-title"]}>
        {translate("attack.states", "combatTracker")}
      </h3>
      <TargetInput
        characters={characters}
        registration={register("inflictedStateTargetId")}
        inputName="inflictedStateTargetName"
      />
      <label htmlFor="inflictedStateName">
        {translate("form.name", "combatTracker")}
      </label>
      <input
        {...register("inflictedStateName")}
        id="inflictedStateName"
        type="text"
      />
      <label htmlFor="inflictedStateDuration">
        {translate("attack.duration", "combatTracker")}
      </label>
      <input
        {...register("inflictedStateDuration", {
          setValueAs: (value) => (value === "" ? 0 : Number(value)),
        })}
        id="inflictedStateDuration"
        type="number"
      />
      <label htmlFor="inflictedStateSaveThrowStat">
        {translate("attack.saveStat", "combatTracker")}
      </label>
      <input
        {...register("inflictedStateSaveThrowStat")}
        id="inflictedStateSaveThrowStat"
        type="text"
      />
      <label htmlFor="inflictedStateSaveThrowDc">
        {translate("attack.saveDc", "combatTracker")}
      </label>
      <input
        {...register("inflictedStateSaveThrowDc", {
          setValueAs: (value) => (value === "" ? 0 : Number(value)),
        })}
        id="inflictedStateSaveThrowDc"
        type="number"
      />
      <ButtonWithIcon
        variant={ButtonVariant.SECONDARY}
        label={translate("form.add", "combatTracker")}
        faIcon="plus"
        faIconStyle={FaIconStyleEnum.SOLID}
        iconPosition="left"
        type="button"
        disabled={disabled}
        onClick={onAddHistory}
      />
    </fieldset>
  );
};

export default StateFields;
