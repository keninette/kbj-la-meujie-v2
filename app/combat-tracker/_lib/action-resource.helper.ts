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
