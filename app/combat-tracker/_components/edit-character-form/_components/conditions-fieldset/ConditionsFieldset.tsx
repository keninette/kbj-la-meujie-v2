import Fieldset, {
  FieldsetRow,
  FieldsetChips,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import AutocompleteInput from "@/app/_components/_basics/form/autocomplete-input/AutocompleteInput";
import TextInput from "@/app/_components/_basics/form/text-input/TextInput";
import NumberInput from "@/app/_components/_basics/form/number-input/NumberInput";
import Chip from "@/app/_components/_basics/chip/Chip";
import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatCondition } from "@/app/_lib/types/combat-condition.type";
import { describeCondition } from "@/app/combat-tracker/_lib/combat-condition.helper";
import { createId } from "@/app/combat-tracker/_lib/create-id";
import {
  BG3_CONDITIONS,
  Bg3ConditionId,
} from "@/app/combat-tracker/_lib/bg3-conditions";
import { getConditionText } from "@/app/combat-tracker/_lib/condition-text.helper";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";
import AddItemButton from "../AddItemButton";
import { useNewItem } from "../../_hooks/use-new-item.hook";
import styles from "./conditions-fieldset.module.scss";

type ConditionsFieldsetProps = {
  conditions: CombatCondition[];
  onChange: (conditions: CombatCondition[]) => void;
  currentTurn?: number;
};

type ConditionDraft = {
  /** Picked in the list; otherwise the typed name is used */
  bg3ConditionId: Bg3ConditionId | null;
  name: string;
  duration: string;
  saveThrowStat: string;
  saveThrowDc: string;
};

const EMPTY_CONDITION: ConditionDraft = {
  bg3ConditionId: null,
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

/** The Baldur's Gate 3 conditions, in french alphabetical order */
const getBg3ConditionOptions = () =>
  BG3_CONDITIONS.map((condition) => ({
    value: condition.id,
    label: getConditionText(condition).name,
    icon: (
      <CharacterPortrait
        src={condition.iconUrl}
        alt=""
        width={24}
        height={24}
      />
    ),
  })).sort((a, b) => a.label.localeCompare(b.label, "fr"));

const ConditionsFieldset = ({
  conditions,
  onChange,
  currentTurn,
}: ConditionsFieldsetProps) => {
  const { draft, setDraft, submit, submitOnEnter } = useNewItem(
    EMPTY_CONDITION,
    (newCondition) => {
      const bg3Condition = BG3_CONDITIONS.find(
        ({ id }) => id === newCondition.bg3ConditionId,
      );
      const name = bg3Condition
        ? getConditionText(bg3Condition).name
        : newCondition.name.trim();
      if (!name) {
        return false;
      }
      const numberOfTurns = toOptionalCount(newCondition.duration);
      const saveThrowStat = newCondition.saveThrowStat.trim();
      const saveThrowDc = toOptionalCount(newCondition.saveThrowDc);

      onChange([
        ...conditions,
        {
          id: createId(),
          name,
          ...(bg3Condition ? { bg3ConditionId: bg3Condition.id } : {}),
          ...(numberOfTurns ? { numberOfTurns } : {}),
          ...(currentTurn !== undefined ? { appliedOnTurn: currentTurn } : {}),
          ...(saveThrowStat ? { saveThrowStat } : {}),
          ...(saveThrowDc ? { saveThrowDc } : {}),
        },
      ]);
      return true;
    },
  );

  // Either a condition of the list or a typed name: picking one clears the other
  const selectBg3Condition = (value: string | null) => {
    const bg3ConditionId =
      BG3_CONDITIONS.find(({ id }) => id === value)?.id ?? null;
    setDraft((condition) => ({ ...condition, bg3ConditionId, name: "" }));
  };

  const setField =
    (field: Exclude<keyof ConditionDraft, "bg3ConditionId">) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setDraft((condition) => ({
        ...condition,
        [field]: value,
        ...(field === "name" ? { bg3ConditionId: null } : {}),
      }));
    };

  return (
    <Fieldset
      title={translate("form.conditions", "combatTracker")}
      titleIcon="fire-flame-curved"
    >
      <FieldsetChips>
        {conditions.map((condition) => (
          <li key={condition.id}>
            <Chip
              label={describeCondition(condition)}
              deleteAction={{
                onClick: () =>
                  onChange(conditions.filter((s) => s.id !== condition.id)),
                tooltip: translate("form.remove", "combatTracker"),
              }}
              data-testid="condition-item"
            />
          </li>
        ))}
      </FieldsetChips>
      <FieldsetRow>
        <AutocompleteInput
          id="bg3Condition"
          label={translate("form.condition", "combatTracker")}
          options={getBg3ConditionOptions()}
          value={draft.bg3ConditionId}
          onChange={selectBg3Condition}
          data-testid="bg3Condition"
        />
        <span className={styles["conditions-fieldset__or"]}>
          {translate("form.or", "combatTracker")}
        </span>
        <TextInput
          id="conditionName"
          name="conditionName"
          label={translate("form.conditionName", "combatTracker")}
          value={draft.name}
          onChange={setField("name")}
          onKeyDown={submitOnEnter}
          data-testid="conditionName"
        />
      </FieldsetRow>
      <FieldsetRow>
        <NumberInput
          id="conditionDuration"
          name="conditionDuration"
          label={translate("combatAction.duration", "combatTracker")}
          step="any"
          value={draft.duration}
          onChange={setField("duration")}
          onKeyDown={submitOnEnter}
          data-testid="conditionDuration"
        />
        <TextInput
          id="conditionSaveThrowStat"
          name="conditionSaveThrowStat"
          label={translate("combatAction.saveStat", "combatTracker")}
          placeholder="CON"
          value={draft.saveThrowStat}
          onChange={setField("saveThrowStat")}
          onKeyDown={submitOnEnter}
          data-testid="conditionSaveThrowStat"
        />
        <NumberInput
          id="conditionSaveThrowDc"
          name="conditionSaveThrowDc"
          label={translate("combatAction.saveDc", "combatTracker")}
          step="any"
          value={draft.saveThrowDc}
          onChange={setField("saveThrowDc")}
          onKeyDown={submitOnEnter}
          data-testid="conditionSaveThrowDc"
        />
        <AddItemButton onClick={submit} data-testid="addCondition" />
      </FieldsetRow>
    </Fieldset>
  );
};

export default ConditionsFieldset;
