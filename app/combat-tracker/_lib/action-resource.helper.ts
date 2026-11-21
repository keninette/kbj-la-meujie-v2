import { translate } from "@/app/_dictionaries/dictionnary";
import { ActionResourceTypeEnum } from "@/app/_lib/enums/action-resource-type.enum";
import { CombatAction } from "@/app/_lib/types/combat-action.type";
import {
  findBg3ActionResource,
  normalizeActionResourceId,
} from "./bg3-action-resources";
import { ActionCostKind, parseActionCost } from "./combat-action.helper";

/**
 * "2" -> "Emplacement de sort de niveau 2", "wldshp" -> "Forme sauvage";
 * a resource we don't know keeps its id ("Rage du dragon")
 */
export const getActionResourceName = (id: string): string => {
  const resource = findBg3ActionResource(id);
  if (!resource) {
    return id;
  }
  return resource.type === ActionResourceTypeEnum.SPELL_SLOT
    ? translate("actionResource.spellSlot", "combatTracker", { level: id })
    : translate(`actionResource.${id}`, "combatTracker");
};

/**
 * An action named after the class resource it spends, with a variant:
 * "Wild Shape: Bear" -> "Forme sauvage" and "Bear", "Rage: Wolf Heart",
 * "Lay on Hands: Cure"... None for any other action ("Hex", "Flurry of Blows").
 */
export const splitResourceVariant = (
  action: CombatAction,
): { resourceName: string; variant: string } | undefined => {
  const [prefix, ...rest] = action.name.split(": ");
  const id = normalizeActionResourceId(prefix);
  const isSpent = action.costs
    .map(parseActionCost)
    .some(
      ({ kind, resource }) =>
        kind === ActionCostKind.ACTION_RESOURCE && resource === id,
    );
  return rest.length > 0 &&
    isSpent &&
    findBg3ActionResource(id)?.type === ActionResourceTypeEnum.CLASS_RESOURCE
    ? { resourceName: getActionResourceName(id), variant: rest.join(": ") }
    : undefined;
};

const isSpellSlot = (id: string): boolean =>
  findBg3ActionResource(id)?.type === ActionResourceTypeEnum.SPELL_SLOT;

/**
 * Whether the character has enough uses left of the resources an action
 * spends ("layonh:2" needs 2). A spell can be upcast: a level 2 spell needs a
 * slot of level 2 or higher. A resource the character doesn't track never
 * blocks the action: we don't know how many are left.
 */
export const hasEnoughResources = (
  action: CombatAction,
  actionResourcesLeft: Record<string, number> = {},
): boolean =>
  action.costs.map(parseActionCost).every(({ kind, resource, amount }) => {
    if (kind !== ActionCostKind.ACTION_RESOURCE || !resource) {
      return true;
    }
    if (isSpellSlot(resource)) {
      const slots = Object.entries(actionResourcesLeft).filter(
        ([id]) => isSpellSlot(id) && Number(id) >= Number(resource),
      );
      return slots.length === 0 || slots.some(([, left]) => left >= amount);
    }
    const left = actionResourcesLeft[resource];
    return left === undefined || left >= amount;
  });
