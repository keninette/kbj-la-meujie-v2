import { Bg3ConditionId } from "@/app/combat-tracker/_lib/bg3-conditions";

export type CombatCondition = {
  id: string;
  name: string;
  /** Set when picked from the Baldur's Gate 3 conditions list */
  bg3ConditionId?: Bg3ConditionId;
  numberOfTurns?: number;
  appliedOnTurn?: number;
  saveThrowStat?: string;
  saveThrowDc?: number;
};
