import { CombatAction } from "@/app/_lib/types/combat-action.type";
import { translate } from "@/app/_dictionaries/dictionnary";

export enum ActionCostKind {
  ACTION = "action",
  BONUS = "bonus",
  REACTION = "reaction",
  SPELL_SLOT = "spellSlot",
  /** Any other resource: wild shape, lay on hands, channel oath... */
  RESOURCE = "resource",
}

export type ActionCost = {
  kind: ActionCostKind;
  /** Key in CombatCharacter.spellSlotsLeft ("2", "layonh"), none for the action economy */
  resource?: string;
  amount: number;
};

/**
 * "action" -> action, "2" -> level 2 spell slot,
 * "layonh:2" -> 2 uses of the "layonh" resource
 */
export const parseActionCost = (cost: string): ActionCost => {
  const [name, rawAmount] = cost.split(":");
  const amount = Number(rawAmount) || 1;
  if (
    name === ActionCostKind.ACTION ||
    name === ActionCostKind.BONUS ||
    name === ActionCostKind.REACTION
  ) {
    return { kind: name, amount };
  }
  return {
    kind: /^\d+$/.test(name)
      ? ActionCostKind.SPELL_SLOT
      : ActionCostKind.RESOURCE,
    resource: name,
    amount,
  };
};

/**
 * What the action does, without its costs:
 * "Dagger · 2d10 Radiant · CON · concentration · Short rest"
 */
export const describeActionDetails = (action: CombatAction): string =>
  [
    action.item,
    ...(action.damages ?? []).map((damage) =>
      [damage.dice, damage.type].filter(Boolean).join(" "),
    ),
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
