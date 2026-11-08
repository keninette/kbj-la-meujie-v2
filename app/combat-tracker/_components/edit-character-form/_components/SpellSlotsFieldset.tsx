import { useState } from "react";
import Fieldset from "@/app/_components/_basics/_form/_fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/_form/_text-input/TextInput";
import NumberInput from "@/app/_components/_basics/_form/_number-input/NumberInput";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import styles from "./fieldsets.module.scss";

type SpellSlotsFieldsetProps = {
  /** Uses left, by level ("1") or resource name ("rage") */
  spellSlots: Record<string, number>;
  onChange: (spellSlots: Record<string, number>) => void;
  isHighlighted?: boolean;
};

const SpellSlotsFieldset = ({
  spellSlots,
  onChange,
  isHighlighted,
}: SpellSlotsFieldsetProps) => {
  const [name, setName] = useState("");
  const [value, setValue] = useState(0);

  const add = () => {
    const trimmedName = name.trim();
    if (!trimmedName || !Number.isInteger(value) || value < 0) {
      return;
    }
    onChange({ ...spellSlots, [trimmedName]: value });
    setName("");
    setValue(0);
  };

  const remove = (slotName: string) => {
    onChange(
      Object.fromEntries(
        Object.entries(spellSlots).filter(([name]) => name !== slotName),
      ),
    );
  };

  return (
    <Fieldset
      title={translate("form.spellSlots", "combatTracker")}
      titleIcon="wand-sparkles"
      isHighlighted={isHighlighted}
    >
      <ul className={styles["fieldsets__chips"]}>
        {Object.entries(spellSlots).map(([slotName, slots]) => (
          <li key={slotName} className={styles["fieldsets__chip"]}>
            {slotName} : {slots}
            <IconButton
              variant={ButtonVariant.TERTIARY}
              tooltip={translate("form.remove", "combatTracker")}
              faIcon="xmark"
              faIconStyle={FaIconStyleEnum.SOLID}
              onClick={() => remove(slotName)}
            />
          </li>
        ))}
      </ul>
      <div className={styles["fieldsets__row"]}>
        <TextInput
          id="slotLevel"
          name="slotLevel"
          label={translate("form.nameOrLevel", "combatTracker")}
          value={name}
          onChange={(event) => setName(event.target.value)}
          data-testid="spellSlotName"
        />
        <NumberInput
          id="slotValue"
          name="slotValue"
          label={translate("form.value", "combatTracker")}
          min="0"
          step="1"
          value={value}
          onChange={(event) => setValue(+event.target.value)}
        />
        <ButtonWithIcon
          variant={ButtonVariant.SECONDARY}
          label={translate("form.add", "combatTracker")}
          faIcon="plus"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          type="button"
          onClick={add}
        />
      </div>
    </Fieldset>
  );
};

export default SpellSlotsFieldset;
