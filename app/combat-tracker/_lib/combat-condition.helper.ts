import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatCondition } from "@/app/_lib/types/combat-condition.type";
import { Bg3ConditionId, findBg3Condition } from "./bg3-conditions";
import { getConditionText } from "./condition-text.helper";

/** The name of a condition: in french for a Baldur's Gate 3 one */
export const getConditionName = (condition: CombatCondition): string => {
  const bg3Condition = findBg3Condition(condition.bg3ConditionId);
  return bg3Condition ? getConditionText(bg3Condition).name : condition.name;
};

/** How long a condition lasts: "3 tours (depuis le tour 2)" */
export const describeConditionDuration = (condition: CombatCondition): string =>
  [
    condition.numberOfTurns !== undefined &&
      translate("stats.conditionDuration", "combatTracker", {
        count: String(condition.numberOfTurns),
      }),
    condition.appliedOnTurn !== undefined &&
      translate("stats.conditionAppliedOnTurn", "combatTracker", {
        turn: String(condition.appliedOnTurn),
      }),
  ]
    .filter(Boolean)
    .join(" ");

/** The saving throw that ends a condition: "CON DD 13" */
export const describeConditionSave = (condition: CombatCondition): string =>
  [
    condition.saveThrowStat,
    condition.saveThrowDc !== undefined &&
      `${translate("stats.saveDc", "combatTracker")} ${condition.saveThrowDc}`,
  ]
    .filter(Boolean)
    .join(" ");

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
  const bg3Condition = findBg3Condition(draft.bg3ConditionId);
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
