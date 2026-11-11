import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatCondition } from "@/app/_lib/types/combat-condition.type";
import { BG3_CONDITIONS } from "./bg3-conditions";
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
