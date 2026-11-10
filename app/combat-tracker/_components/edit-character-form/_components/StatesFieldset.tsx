import Fieldset, {
  FieldsetRow,
  FieldsetChips,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/form/text-input/TextInput";
import NumberInput from "@/app/_components/_basics/form/number-input/NumberInput";
import Chip from "@/app/_components/_basics/chip/Chip";
import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatState } from "@/app/_lib/types/combat-state.type";
import { describeState } from "@/app/combat-tracker/_lib/combat-state.helper";
import { createId } from "@/app/combat-tracker/_lib/create-id";
import AddItemButton from "./AddItemButton";
import { useNewItem } from "../_hooks/use-new-item.hook";

type StatesFieldsetProps = {
  states: CombatState[];
  onChange: (states: CombatState[]) => void;
  currentTurn?: number;
};

const EMPTY_STATE = {
  name: "",
  duration: "",
  saveThrowStat: "",
  saveThrowDc: "",
};

/** A positive whole number, or nothing (empty, 0, invalid) */
const toOptionalCount = (value: string): number | undefined => {
  const count = Number(value);
  return value.trim() && Number.isInteger(count) && count > 0
    ? count
    : undefined;
};

const StatesFieldset = ({
  states,
  onChange,
  currentTurn,
}: StatesFieldsetProps) => {
  const { draft, setDraft, submit, submitOnEnter } = useNewItem(
    EMPTY_STATE,
    (newState) => {
      const name = newState.name.trim();
      if (!name) {
        return false;
      }
      const numberOfTurns = toOptionalCount(newState.duration);
      const saveThrowStat = newState.saveThrowStat.trim();
      const saveThrowDc = toOptionalCount(newState.saveThrowDc);

      onChange([
        ...states,
        {
          id: createId(),
          name,
          ...(numberOfTurns ? { numberOfTurns } : {}),
          ...(currentTurn !== undefined ? { appliedOnTurn: currentTurn } : {}),
          ...(saveThrowStat ? { saveThrowStat } : {}),
          ...(saveThrowDc ? { saveThrowDc } : {}),
        },
      ]);
      return true;
    },
  );

  const setField =
    (field: keyof typeof EMPTY_STATE) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setDraft((state) => ({ ...state, [field]: value }));
    };

  return (
    <Fieldset
      title={translate("form.states", "combatTracker")}
      titleIcon="fire-flame-curved"
    >
      <FieldsetChips>
        {states.map((state) => (
          <li key={state.id}>
            <Chip
              label={describeState(state)}
              deleteAction={{
                onClick: () =>
                  onChange(states.filter((s) => s.id !== state.id)),
                tooltip: translate("form.remove", "combatTracker"),
              }}
              data-testid="state-item"
            />
          </li>
        ))}
      </FieldsetChips>
      <TextInput
        id="stateName"
        name="stateName"
        label={translate("form.stateName", "combatTracker")}
        value={draft.name}
        onChange={setField("name")}
        onKeyDown={submitOnEnter}
        data-testid="stateName"
      />
      <FieldsetRow>
        <NumberInput
          id="stateDuration"
          name="stateDuration"
          label={translate("combatAction.duration", "combatTracker")}
          step="any"
          value={draft.duration}
          onChange={setField("duration")}
          onKeyDown={submitOnEnter}
          data-testid="stateDuration"
        />
        <TextInput
          id="stateSaveThrowStat"
          name="stateSaveThrowStat"
          label={translate("combatAction.saveStat", "combatTracker")}
          placeholder="CON"
          value={draft.saveThrowStat}
          onChange={setField("saveThrowStat")}
          onKeyDown={submitOnEnter}
          data-testid="stateSaveThrowStat"
        />
        <NumberInput
          id="stateSaveThrowDc"
          name="stateSaveThrowDc"
          label={translate("combatAction.saveDc", "combatTracker")}
          step="any"
          value={draft.saveThrowDc}
          onChange={setField("saveThrowDc")}
          onKeyDown={submitOnEnter}
          data-testid="stateSaveThrowDc"
        />
        <AddItemButton onClick={submit} data-testid="addState" />
      </FieldsetRow>
    </Fieldset>
  );
};

export default StatesFieldset;
