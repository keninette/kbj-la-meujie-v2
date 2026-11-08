import { useState } from "react";
import Fieldset from "@/app/_components/_basics/_form/_fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/_form/_text-input/TextInput";
import NumberInput from "@/app/_components/_basics/_form/_number-input/NumberInput";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { CombatState } from "@/app/_lib/types/combat-state.type";
import { describeState } from "@/app/combat-tracker/_lib/combat-state.helper";
import styles from "./fieldsets.module.scss";

type StatesFieldsetProps = {
  states: CombatState[];
  onChange: (states: CombatState[]) => void;
  createId: () => string;
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
  createId,
}: StatesFieldsetProps) => {
  const [newState, setNewState] = useState(EMPTY_STATE);

  const setField =
    (field: keyof typeof EMPTY_STATE) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setNewState((state) => ({ ...state, [field]: event.target.value }));

  const add = () => {
    const name = newState.name.trim();
    if (!name) {
      return;
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
        ...(saveThrowStat ? { saveThrowStat } : {}),
        ...(saveThrowDc ? { saveThrowDc } : {}),
      },
    ]);
    setNewState(EMPTY_STATE);
  };

  const addOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      add();
    }
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
        value={newState.name}
        onChange={setField("name")}
        onKeyDown={addOnEnter}
        data-testid="stateName"
      />
      <div className={styles["fieldsets__row"]}>
        <NumberInput
          id="stateDuration"
          name="stateDuration"
          label={translate("attack.duration", "combatTracker")}
          min="1"
          step="1"
          value={newState.duration}
          onChange={setField("duration")}
          onKeyDown={addOnEnter}
          data-testid="stateDuration"
        />
        <TextInput
          id="stateSaveThrowStat"
          name="stateSaveThrowStat"
          label={translate("attack.saveStat", "combatTracker")}
          placeholder="CON"
          value={newState.saveThrowStat}
          onChange={setField("saveThrowStat")}
          onKeyDown={addOnEnter}
          data-testid="stateSaveThrowStat"
        />
        <NumberInput
          id="stateSaveThrowDc"
          name="stateSaveThrowDc"
          label={translate("attack.saveDc", "combatTracker")}
          min="1"
          step="1"
          value={newState.saveThrowDc}
          onChange={setField("saveThrowDc")}
          onKeyDown={addOnEnter}
          data-testid="stateSaveThrowDc"
        />
        <ButtonWithIcon
          variant={ButtonVariant.SECONDARY}
          label={translate("form.add", "combatTracker")}
          faIcon="plus"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          type="button"
          onClick={add}
          data-testid="addState"
        />
      </div>
    </Fieldset>
  );
};

export default StatesFieldset;
