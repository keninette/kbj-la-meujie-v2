import Fieldset, {
  FieldsetChips,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatCondition } from "@/app/_lib/types/combat-condition.type";
import {
  conditionFromDraft,
  EMPTY_CONDITION_DRAFT,
} from "@/app/combat-tracker/_lib/combat-condition.helper";
import { createId } from "@/app/combat-tracker/_lib/create-id";
import ConditionInputs from "@/app/combat-tracker/_components/condition-inputs/ConditionInputs";
import ConditionChip from "@/app/combat-tracker/_components/condition-chip/ConditionChip";
import AddItemButton from "../AddItemButton";
import { useNewItem } from "../../_hooks/use-new-item.hook";

type ConditionsFieldsetProps = {
  conditions: CombatCondition[];
  onChange: (conditions: CombatCondition[]) => void;
  currentTurn?: number;
};

const ConditionsFieldset = ({
  conditions,
  onChange,
  currentTurn,
}: ConditionsFieldsetProps) => {
  const { draft, setDraft, submit } = useNewItem(
    EMPTY_CONDITION_DRAFT,
    (newDraft) => {
      const condition = conditionFromDraft(newDraft);
      if (!condition) {
        return false;
      }

      onChange([
        ...conditions,
        {
          id: createId(),
          ...condition,
          ...(currentTurn !== undefined ? { appliedOnTurn: currentTurn } : {}),
        },
      ]);
      return true;
    },
  );

  return (
    <Fieldset
      title={translate("form.conditions", "combatTracker")}
      titleIcon="fire-flame-curved"
    >
      <FieldsetChips>
        {conditions.map((condition) => (
          <li key={condition.id}>
            <ConditionChip
              condition={condition}
              onRemove={() =>
                onChange(conditions.filter((s) => s.id !== condition.id))
              }
              data-testid="condition-item"
            />
          </li>
        ))}
      </FieldsetChips>
      <ConditionInputs draft={draft} onDraftChange={setDraft} onEnter={submit}>
        <AddItemButton onClick={submit} data-testid="addCondition" />
      </ConditionInputs>
    </Fieldset>
  );
};

export default ConditionsFieldset;
