import type { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { useFormContext } from "react-hook-form";
import type { AttackFormValues } from "./attack-form.helper";
import styles from "./attack-form.module.scss";

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
  const { register } = useFormContext<AttackFormValues>();

  return (
    <fieldset className={styles["attack-form__fieldset"]}>
      <h3 className={styles["attack-form__fieldset-title"]}>
        {translate("attack.spellUsed", "combatTracker")}
      </h3>
      {!!Object.values(selectedCharacter.spellSlotsLeft ?? {}).length && (
        <>
          <label htmlFor="spellUsedLevel">
            {translate("form.level", "combatTracker")}
          </label>
          <select
            {...register("spellUsedLevel", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
            id="spellUsedLevel"
          >
            <option value="">
              {translate("attack.chooseLevel", "combatTracker")}
            </option>
            {Object.keys(selectedCharacter.spellSlotsLeft ?? {}).map(
              (level) => (
                <option
                  key={level}
                  value={+level}
                  disabled={
                    +(selectedCharacter.spellSlotsLeft?.[+level] ?? 0) <= 0
                  }
                >
                  {level} (
                  {translate("attack.slotsRemaining", "combatTracker", {
                    count: String(selectedCharacter.spellSlotsLeft?.[+level]),
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

export default SpellFields;
