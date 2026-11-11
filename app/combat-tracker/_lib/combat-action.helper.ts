import {
  CombatAction,
  CombatActionDamage,
} from "@/app/_lib/types/combat-action.type";
import { translate } from "@/app/_dictionaries/dictionnary";

export enum ActionCostKind {
  ACTION = "action",
  BONUS = "bonus",
  REACTION = "reaction",
  /** A spell slot, wild shape, lay on hands... (see bg3-action-resources.ts) */
  ACTION_RESOURCE = "actionResource",
  /** All of it, half of it ("movement:half") or some meters ("movement:6") */
  MOVEMENT = "movement",
}

export type ActionCost = {
  kind: ActionCostKind;
  /** Key in CombatCharacter.actionResourcesLeft ("2", "layonh"), none for the
   * action economy; "half" or meters for the movement */
  resource?: string;
  amount: number;
};

/**
 * "action" -> action, "2" -> level 2 spell slot,
 * "layonh:2" -> 2 uses of the "layonh" resource,
 * "movement:6" -> 6 m of movement
 */
export const parseActionCost = (cost: string): ActionCost => {
  const [name, rawAmount] = cost.split(":");
  if (name === ActionCostKind.MOVEMENT) {
    return { kind: ActionCostKind.MOVEMENT, resource: rawAmount, amount: 1 };
  }
  const amount = Number(rawAmount) || 1;
  if (
    name === ActionCostKind.ACTION ||
    name === ActionCostKind.BONUS ||
    name === ActionCostKind.REACTION
  ) {
    return { kind: name, amount };
  }
  return { kind: ActionCostKind.ACTION_RESOURCE, resource: name, amount };
};

/**
 * The dice of a damage, without its type (DamageText shows it): "2d10", or
 * for a weapon "1d6 (1d8)+FOR": its two-handed damage in brackets, then the
 * ability added ("FOR/DEX" when either may be)
 */
export const describeDamage = (damage: CombatActionDamage): string => {
  const versatile = damage.versatileDice ? ` (${damage.versatileDice})` : "";
  const abilities = damage.abilities?.length
    ? `+${damage.abilities
        .map((ability) => translate(`ability.${ability}`, "combatTracker"))
        .join("/")}`
    : "";
  // The weapon wasn't found: its damage is unknown
  const dice =
    damage.dice === "weapon"
      ? translate("actions.weaponDamage", "combatTracker")
      : damage.dice;
  return `${dice}${versatile}${abilities}`;
};

/**
 * What the action does besides its damages (DamageText shows them), costs
 * and item (in its tooltip): "CON · concentration · Short rest"
 */
export const describeActionDetails = (action: CombatAction): string =>
  [
    action.save,
    action.isConcentration
      ? translate("actions.concentration", "combatTracker")
      : undefined,
    action.recharge,
  ]
    .filter(Boolean)
    .join(" · ");

/** Groups of the actions section, named after the cost they share */
export type ActionGroup =
  | ActionCostKind.ACTION
  | ActionCostKind.BONUS
  | ActionCostKind.REACTION;

export const ACTION_GROUPS: ActionGroup[] = [
  ActionCostKind.ACTION,
  ActionCostKind.BONUS,
  ActionCostKind.REACTION,
];

/** Bonus actions, then reactions apart; everything else with the actions */
export const getActionGroup = (action: CombatAction): ActionGroup => {
  const kinds = action.costs.map((cost) => parseActionCost(cost).kind);
  if (kinds.includes(ActionCostKind.BONUS)) {
    return ActionCostKind.BONUS;
  }
  if (kinds.includes(ActionCostKind.REACTION)) {
    return ActionCostKind.REACTION;
  }
  return ActionCostKind.ACTION;
};
