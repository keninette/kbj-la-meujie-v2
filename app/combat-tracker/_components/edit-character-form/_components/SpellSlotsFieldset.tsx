import Fieldset from "@/app/_components/_basics/_form/_fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/_form/_text-input/TextInput";
import NumberInput from "@/app/_components/_basics/_form/_number-input/NumberInput";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import AddItemButton from "./AddItemButton";
import { useNewItem } from "../_hooks/use-new-item.hook";
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
  const { draft, setDraft, submit, submitOnEnter } = useNewItem(
    { name: "", value: 0 },
    ({ name, value }) => {
      const trimmedName = name.trim();
      if (!trimmedName || !Number.isInteger(value) || value < 0) {
        return false;
      }
      onChange({ ...spellSlots, [trimmedName]: value });
      return true;
    },
  );

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
          value={draft.name}
          onChange={(event) => {
            const name = event.target.value;
            setDraft((slot) => ({ ...slot, name }));
          }}
          onKeyDown={submitOnEnter}
          data-testid="spellSlotName"
        />
        <NumberInput
          id="slotValue"
          name="slotValue"
          label={translate("form.value", "combatTracker")}
          step="any"
          value={draft.value}
          onChange={(event) => {
            const value = +event.target.value;
            setDraft((slot) => ({ ...slot, value }));
          }}
          onKeyDown={submitOnEnter}
          data-testid="spellSlotValue"
        />
        <AddItemButton onClick={submit} data-testid="addSpellSlot" />
      </div>
    </Fieldset>
  );
};

export default SpellSlotsFieldset;
