import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatState } from "@/app/_lib/types/combat-state.type";

/**
 * A state as written in the stats panel:
 * "Poisoned pendant 3 tours (appliqué au tour 2), CON DD 13"
 */
export const describeState = (state: CombatState): string => {
  const duration =
    state.numberOfTurns !== undefined
      ? ` ${translate("stats.stateDuration", "combatTracker", {
          duration: String(state.numberOfTurns),
        })}`
      : "";
  const appliedOnTurn =
    state.appliedOnTurn !== undefined
      ? ` ${translate("stats.stateAppliedOnTurn", "combatTracker", {
          turn: String(state.appliedOnTurn),
        })}`
      : "";
  const save = [
    state.saveThrowStat,
    state.saveThrowDc !== undefined
      ? `${translate("stats.saveDc", "combatTracker")} ${state.saveThrowDc}`
      : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return `${state.name}${duration}${appliedOnTurn}${save ? `, ${save}` : ""}`;
};
