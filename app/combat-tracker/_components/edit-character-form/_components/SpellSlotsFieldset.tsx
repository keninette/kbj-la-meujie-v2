import Fieldset, {
  FieldsetRow,
  FieldsetChips,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/form/text-input/TextInput";
import NumberInput from "@/app/_components/_basics/form/number-input/NumberInput";
import Chip from "@/app/_components/_basics/chip/Chip";
import { translate } from "@/app/_dictionaries/dictionnary";
import AddItemButton from "./AddItemButton";
import { useNewItem } from "../_hooks/use-new-item.hook";

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
      <FieldsetChips>
        {Object.entries(spellSlots).map(([slotName, slots]) => (
          <li key={slotName}>
            <Chip
              label={`${slotName} : ${slots}`}
              deleteAction={{
                onClick: () => remove(slotName),
                tooltip: translate("form.remove", "combatTracker"),
              }}
            />
          </li>
        ))}
      </FieldsetChips>
      <FieldsetRow>
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
      </FieldsetRow>
    </Fieldset>
  );
};

export default SpellSlotsFieldset;
