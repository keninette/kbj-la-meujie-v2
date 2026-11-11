import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatCondition } from "@/app/_lib/types/combat-condition.type";
import { BG3_CONDITIONS, Bg3ConditionId } from "./bg3-conditions";
import { getConditionText } from "./condition-text.helper";

/**
 * A condition as written in the stats panel:
 * "Poisoned pendant 3 tours (appliqué au tour 2), CON DD 13"
 */
export const describeCondition = (condition: CombatCondition): string => {
  const duration =
    condition.numberOfTurns !== undefined
      ? ` ${translate("stats.conditionDuration", "combatTracker", {
          duration: String(condition.numberOfTurns),
        })}`
      : "";
  const appliedOnTurn =
    condition.appliedOnTurn !== undefined
      ? ` ${translate("stats.conditionAppliedOnTurn", "combatTracker", {
          turn: String(condition.appliedOnTurn),
        })}`
      : "";
  const save = [
    condition.saveThrowStat,
    condition.saveThrowDc !== undefined
      ? `${translate("stats.saveDc", "combatTracker")} ${condition.saveThrowDc}`
      : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const bg3Condition = BG3_CONDITIONS.find(
    ({ id }) => id === condition.bg3ConditionId,
  );
  const name = bg3Condition
    ? getConditionText(bg3Condition).name
    : condition.name;

  return `${name}${duration}${appliedOnTurn}${save ? `, ${save}` : ""}`;
};

/** A condition being typed in the inputs (see ConditionInputs) */
export type ConditionDraft = {
  /** Picked in the list; otherwise the typed name is used */
  bg3ConditionId: Bg3ConditionId | null;
  name: string;
  duration: string;
  saveThrowStat: string;
  saveThrowDc: string;
};

export const EMPTY_CONDITION_DRAFT: ConditionDraft = {
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

/**
 * The condition typed in the inputs, without its id and applied turn.
 * Null when it has no name: neither picked in the list nor typed.
 */
export const conditionFromDraft = (
  draft: ConditionDraft,
): Omit<CombatCondition, "id" | "appliedOnTurn"> | null => {
  const bg3Condition = BG3_CONDITIONS.find(
    ({ id }) => id === draft.bg3ConditionId,
  );
  const name = bg3Condition
    ? getConditionText(bg3Condition).name
    : draft.name.trim();
  if (!name) {
    return null;
  }
  const numberOfTurns = toOptionalCount(draft.duration);
  const saveThrowStat = draft.saveThrowStat.trim();
  const saveThrowDc = toOptionalCount(draft.saveThrowDc);

  return {
    name,
    ...(bg3Condition ? { bg3ConditionId: bg3Condition.id } : {}),
    ...(numberOfTurns ? { numberOfTurns } : {}),
    ...(saveThrowStat ? { saveThrowStat } : {}),
    ...(saveThrowDc ? { saveThrowDc } : {}),
  };
};
