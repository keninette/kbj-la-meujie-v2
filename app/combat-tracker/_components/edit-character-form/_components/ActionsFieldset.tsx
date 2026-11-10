import Fieldset, {
  FieldsetRow,
  FieldsetChips,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/form/text-input/TextInput";
import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatAction } from "@/app/_lib/types/combat-action.type";
import ActionChip from "@/app/combat-tracker/_components/action-chip/ActionChip";
import AddItemButton from "./AddItemButton";
import { useNewItem } from "../_hooks/use-new-item.hook";

type ActionsFieldsetProps = {
  actions: CombatAction[];
  onChange: (actions: CombatAction[]) => void;
  isHighlighted?: boolean;
};

const ActionsFieldset = ({
  actions,
  onChange,
  isHighlighted,
}: ActionsFieldsetProps) => {
  const { draft, setDraft, submit, submitOnEnter } = useNewItem("", (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return false;
    }
    onChange([...actions, { name: trimmedName, costs: [] }]);
    return true;
  });

  return (
    <Fieldset
      title={translate("form.actions", "combatTracker")}
      titleIcon="hand-fist"
      isHighlighted={isHighlighted}
      data-testid="actions-fieldset"
    >
      <FieldsetChips>
        {actions.map((action, index) => (
          <li key={`${action.name}-${index}`}>
            <ActionChip
              action={action}
              onRemove={() => onChange(actions.filter((_, i) => i !== index))}
            />
          </li>
        ))}
      </FieldsetChips>
      <FieldsetRow>
        <TextInput
          id="actionName"
          name="actionName"
          label={translate("form.actionName", "combatTracker")}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={submitOnEnter}
          data-testid="actionName"
        />
        <AddItemButton onClick={submit} data-testid="addAction" />
      </FieldsetRow>
    </Fieldset>
  );
};

export default ActionsFieldset;
