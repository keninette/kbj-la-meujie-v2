import { cx } from "@/app/_lib/class-names";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import Tooltip from "@/app/_components/_basics/tooltip/Tooltip";
import { translate } from "@/app/_dictionaries/dictionnary";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import {
  ActionCost,
  ActionCostKind,
} from "@/app/combat-tracker/_lib/combat-action.helper";
import styles from "./action-cost.module.scss";

const getLabel = ({ kind, resource }: ActionCost): string => {
  switch (kind) {
    case ActionCostKind.SPELL_SLOT:
      return translate("actions.cost.spellSlot", "combatTracker", {
        level: resource ?? "",
      });
    case ActionCostKind.RESOURCE:
      // Named like in the spell slots, e.g. "layonh"
      return resource ?? "";
    case ActionCostKind.MOVEMENT:
      if (resource === "half") {
        return translate("actions.cost.halfMovement", "combatTracker");
      }
      return resource
        ? translate("actions.cost.movementMeters", "combatTracker", {
            meters: resource,
          })
        : translate("actions.cost.movement", "combatTracker");
    default:
      return translate(`actions.cost.${kind}`, "combatTracker");
  }
};

/** The spell slot's level, or the movement's part: "/2" for half, its meters */
const getShapeText = ({ kind, resource }: ActionCost): string | undefined => {
  if (kind === ActionCostKind.MOVEMENT) {
    return resource === "half" ? "/2" : resource;
  }
  return kind === ActionCostKind.SPELL_SLOT ? resource : undefined;
};

type ActionCostIconProps = { cost: ActionCost };

/**
 * Cost icon, like in the game: green circle for an action, orange triangle
 * for a bonus action, purple diamond for a reaction, light blue square for a spell
 * slot (with its level), a yellow square for the movement (with its part),
 * and a wand for any other resource, as in the spells.
 */
const ActionCostIcon = ({ cost }: ActionCostIconProps) => {
  const label = getLabel(cost);
  const tooltip = cost.amount > 1 ? `${label} ×${cost.amount}` : label;

  return (
    // The movement has no tooltip: it would overlap the action chip's
    <Tooltip content={cost.kind !== ActionCostKind.MOVEMENT && tooltip}>
      <span
        className={styles["action-cost"]}
        role="img"
        aria-label={tooltip}
        data-testid={`action-cost-${cost.kind}`}
      >
        {cost.kind === ActionCostKind.RESOURCE ? (
          <FontAwesomeIcon
            faIcon="wand-sparkles"
            faIconStyle={FaIconStyleEnum.SOLID}
            className={styles["action-cost__wand"]}
            aria-hidden
          />
        ) : (
          <span
            className={cx(
              styles["action-cost__shape"],
              // BEM modifiers are in kebab-case: "spellSlot" -> "spell-slot"
              styles[
                `action-cost__shape--${cost.kind === ActionCostKind.SPELL_SLOT ? "spell-slot" : cost.kind}`
              ],
            )}
            aria-hidden
          >
            {getShapeText(cost)}
          </span>
        )}
        {cost.amount > 1 && (
          <span className={styles["action-cost__amount"]} aria-hidden>
            ×{cost.amount}
          </span>
        )}
      </span>
    </Tooltip>
  );
};

export default ActionCostIcon;
