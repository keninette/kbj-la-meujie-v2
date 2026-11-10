import type { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { useFormContext } from "react-hook-form";
import type { CombatActionFormValues } from "../combat-action-form.helper";
import styles from "../combat-action-form.module.scss";

type SpellFieldsProps = {
  selectedCharacter: CombatCharacter;
  disabled: boolean;
  onAddHistory: () => void;
};

const SpellFields = ({
  selectedCharacter,
  disabled,
  onAddHistory,
}: SpellFieldsProps) => {
  const { register } = useFormContext<CombatActionFormValues>();

  return (
    <fieldset className={styles["combat-action-form__fieldset"]}>
      <h3 className={styles["combat-action-form__fieldset-title"]}>
        {translate("combatAction.spellUsed", "combatTracker")}
      </h3>
      {!!Object.values(selectedCharacter.spellSlotsLeft ?? {}).length && (
        <>
          <label htmlFor="spellUsedLevel">
            {translate("form.nameOrLevel", "combatTracker")}
          </label>
          <select
            {...register("spellUsedLevel", {
              setValueAs: (value) => (value === "" ? null : String(value)),
            })}
            id="spellUsedLevel"
          >
            <option value="">
              {translate("combatAction.chooseLevel", "combatTracker")}
            </option>
            {Object.entries(selectedCharacter.spellSlotsLeft ?? {}).map(
              ([name, slots]) => (
                <option key={name} value={name} disabled={slots <= 0}>
                  {name} (
                  {translate("combatAction.slotsRemaining", "combatTracker", {
                    count: String(slots),
                  })}
                  )
                </option>
              ),
            )}
          </select>
        </>
      )}
      <label htmlFor="spellUsedName">
        {translate("form.name", "combatTracker")}
      </label>
      <input {...register("spellUsedName")} type="text" id="spellUsedName" />
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

export default SpellFields;
