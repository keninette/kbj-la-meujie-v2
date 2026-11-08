import Fieldset from "@/app/_components/_basics/_form/_fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/_form/_text-input/TextInput";
import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatAction } from "@/app/_lib/types/combat-action.type";
import ActionsList from "@/app/combat-tracker/_components/actions-list/ActionsList";
import AddItemButton from "./AddItemButton";
import { useNewItem } from "../_hooks/use-new-item.hook";
import styles from "./fieldsets.module.scss";

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
    >
      <ActionsList
        actions={actions}
        onRemove={(index) => onChange(actions.filter((_, i) => i !== index))}
      />
      <div className={styles["fieldsets__row"]}>
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
      </div>
    </Fieldset>
  );
};

export default ActionsFieldset;
