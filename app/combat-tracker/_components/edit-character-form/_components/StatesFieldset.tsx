import Fieldset from "@/app/_components/_basics/form/fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/form/text-input/TextInput";
import NumberInput from "@/app/_components/_basics/form/number-input/NumberInput";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { CombatState } from "@/app/_lib/types/combat-state.type";
import { describeState } from "@/app/combat-tracker/_lib/combat-state.helper";
import { createId } from "@/app/combat-tracker/_lib/create-id";
import AddItemButton from "./AddItemButton";
import { useNewItem } from "../_hooks/use-new-item.hook";
import styles from "./fieldsets.module.scss";

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
      <ul className={styles["fieldsets__chips"]}>
        {states.map((state) => (
          <li
            key={state.id}
            className={styles["fieldsets__chip"]}
            data-testid="state-item"
          >
            {describeState(state)}
            <IconButton
              variant={ButtonVariant.TERTIARY}
              tooltip={translate("form.remove", "combatTracker")}
              faIcon="xmark"
              faIconStyle={FaIconStyleEnum.SOLID}
              onClick={() => onChange(states.filter((s) => s.id !== state.id))}
            />
          </li>
        ))}
      </ul>
      <TextInput
        id="stateName"
        name="stateName"
        label={translate("form.stateName", "combatTracker")}
        value={draft.name}
        onChange={setField("name")}
        onKeyDown={submitOnEnter}
        data-testid="stateName"
      />
      <div className={styles["fieldsets__row"]}>
        <NumberInput
          id="stateDuration"
          name="stateDuration"
          label={translate("attack.duration", "combatTracker")}
          step="any"
          value={draft.duration}
          onChange={setField("duration")}
          onKeyDown={submitOnEnter}
          data-testid="stateDuration"
        />
        <TextInput
          id="stateSaveThrowStat"
          name="stateSaveThrowStat"
          label={translate("attack.saveStat", "combatTracker")}
          placeholder="CON"
          value={draft.saveThrowStat}
          onChange={setField("saveThrowStat")}
          onKeyDown={submitOnEnter}
          data-testid="stateSaveThrowStat"
        />
        <NumberInput
          id="stateSaveThrowDc"
          name="stateSaveThrowDc"
          label={translate("attack.saveDc", "combatTracker")}
          step="any"
          value={draft.saveThrowDc}
          onChange={setField("saveThrowDc")}
          onKeyDown={submitOnEnter}
          data-testid="stateSaveThrowDc"
        />
        <AddItemButton onClick={submit} data-testid="addState" />
      </div>
    </Fieldset>
  );
};

export default StatesFieldset;
