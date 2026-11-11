import { FieldsetRow } from "@/app/_components/_basics/form/fieldset/Fieldset";
import AutocompleteInput from "@/app/_components/_basics/form/autocomplete-input/AutocompleteInput";
import TextInput from "@/app/_components/_basics/form/text-input/TextInput";
import NumberInput from "@/app/_components/_basics/form/number-input/NumberInput";
import { translate } from "@/app/_dictionaries/dictionnary";
import { BG3_CONDITIONS } from "@/app/combat-tracker/_lib/bg3-conditions";
import { getConditionText } from "@/app/combat-tracker/_lib/condition-text.helper";
import type { ConditionDraft } from "@/app/combat-tracker/_lib/combat-condition.helper";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";
import styles from "./condition-inputs.module.scss";

type ConditionInputsProps = {
  draft: ConditionDraft;
  onDraftChange: (draft: ConditionDraft) => void;
  /** Enter in an input, instead of submitting the whole form */
  onEnter: () => void;
  children: React.ReactNode;
};

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

/**
 * The inputs of a condition: picked in the Baldur's Gate 3 list or typed,
 * with its duration and saving throw
 */
const ConditionInputs = ({
  draft,
  onDraftChange,
  onEnter,
  children,
}: ConditionInputsProps) => {
  // Either a condition of the list or a typed name: picking one clears the other
  const selectBg3Condition = (value: string | null) =>
    onDraftChange({
      ...draft,
      bg3ConditionId: BG3_CONDITIONS.find(({ id }) => id === value)?.id ?? null,
      name: "",
    });

  const setField =
    (field: Exclude<keyof ConditionDraft, "bg3ConditionId">) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onDraftChange({
        ...draft,
        [field]: event.target.value,
        ...(field === "name" ? { bg3ConditionId: null } : {}),
      });

  const enterOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onEnter();
    }
  };

  return (
    <>
      <FieldsetRow>
        <AutocompleteInput
          id="bg3Condition"
          label={translate("form.condition", "combatTracker")}
          options={getBg3ConditionOptions()}
          value={draft.bg3ConditionId}
          onChange={selectBg3Condition}
          data-testid="bg3Condition"
        />
        <span className={styles["condition-inputs__or"]}>
          {translate("form.or", "combatTracker")}
        </span>
        <TextInput
          id="conditionName"
          name="conditionName"
          label={translate("form.conditionName", "combatTracker")}
          value={draft.name}
          onChange={setField("name")}
          onKeyDown={enterOnKeyDown}
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
          onKeyDown={enterOnKeyDown}
          data-testid="conditionDuration"
        />
        <TextInput
          id="conditionSaveThrowStat"
          name="conditionSaveThrowStat"
          label={translate("combatAction.saveStat", "combatTracker")}
          placeholder="CON"
          value={draft.saveThrowStat}
          onChange={setField("saveThrowStat")}
          onKeyDown={enterOnKeyDown}
          data-testid="conditionSaveThrowStat"
        />
        <NumberInput
          id="conditionSaveThrowDc"
          name="conditionSaveThrowDc"
          label={translate("combatAction.saveDc", "combatTracker")}
          step="any"
          value={draft.saveThrowDc}
          onChange={setField("saveThrowDc")}
          onKeyDown={enterOnKeyDown}
          data-testid="conditionSaveThrowDc"
        />
        {children}
      </FieldsetRow>
    </>
  );
};

export default ConditionInputs;
