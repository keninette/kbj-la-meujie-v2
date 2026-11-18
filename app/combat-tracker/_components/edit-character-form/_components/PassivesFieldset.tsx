import Fieldset, {
  FieldsetChips,
  FieldsetRow,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/form/text-input/TextInput";
import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatPassive } from "@/app/_lib/types/combat-passive.type";
import PassiveChip from "@/app/combat-tracker/_components/passive-chip/PassiveChip";
import AddItemButton from "./AddItemButton";
import { useNewItem } from "../_hooks/use-new-item.hook";

type PassivesFieldsetProps = {
  passives: CombatPassive[];
  onChange: (passives: CombatPassive[]) => void;
  isHighlighted?: boolean;
};

const PassivesFieldset = ({
  passives,
  onChange,
  isHighlighted,
}: PassivesFieldsetProps) => {
  const { draft, setDraft, submit, submitOnEnter } = useNewItem("", (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return false;
    }
    onChange([...passives, { name: trimmedName }]);
    return true;
  });

  return (
    <Fieldset
      title={translate("form.passives", "combatTracker")}
      titleIcon="book-open"
      isHighlighted={isHighlighted}
      data-testid="passives-fieldset"
    >
      <FieldsetChips>
        {passives.map((passive, index) => (
          <li key={`${passive.name}-${index}`}>
            <PassiveChip
              passive={passive}
              onRemove={() => onChange(passives.filter((_, i) => i !== index))}
            />
          </li>
        ))}
      </FieldsetChips>
      <FieldsetRow>
        <TextInput
          id="passiveName"
          name="passiveName"
          label={translate("form.passiveName", "combatTracker")}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={submitOnEnter}
          data-testid="passiveName"
        />
        <AddItemButton onClick={submit} data-testid="passiveName-add-button" />
      </FieldsetRow>
    </Fieldset>
  );
};

export default PassivesFieldset;
