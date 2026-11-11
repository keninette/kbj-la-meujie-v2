import { translate } from "@/app/_dictionaries/dictionnary";
import { ActionResourceTypeEnum } from "@/app/_lib/enums/action-resource-type.enum";
import { CombatAction } from "@/app/_lib/types/combat-action.type";
import { findBg3ActionResource } from "./bg3-action-resources";
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
 * Name of the first class resource an action spends: "Forme sauvage" for
 * "Wild Shape: Bear", which has no french name. None for a spell slot.
 */
export const findClassResourceName = (
  action: CombatAction,
): string | undefined => {
  const id = action.costs
    .map(parseActionCost)
    .find(
      ({ kind, resource }) =>
        kind === ActionCostKind.ACTION_RESOURCE &&
        findBg3ActionResource(resource ?? "")?.type ===
          ActionResourceTypeEnum.CLASS_RESOURCE,
    )?.resource;
  return id ? getActionResourceName(id) : undefined;
};
