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

/** Groups of the actions section */
export enum ActionGroupEnum {
  ACTION = "action",
  BONUS = "bonus",
}

export const ACTION_GROUPS = Object.values(ActionGroupEnum);

/** Bonus actions apart, everything else (reactions included) with the actions */
export const getActionGroup = (action: CombatAction): ActionGroupEnum =>
  action.costs.some(
    (cost) => parseActionCost(cost).kind === ActionCostKind.BONUS,
  )
    ? ActionGroupEnum.BONUS
    : ActionGroupEnum.ACTION;
