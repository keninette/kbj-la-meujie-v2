import { cx } from "@/app/_lib/class-names";
import Tooltip from "@/app/_components/_basics/tooltip/Tooltip";
import { translate } from "@/app/_dictionaries/dictionnary";
import {
  ActionCost,
  ActionCostKind,
} from "@/app/combat-tracker/_lib/combat-action.helper";
import { getActionResourceName } from "@/app/combat-tracker/_lib/action-resource.helper";
import ActionResourceIcon from "@/app/combat-tracker/_components/action-resource-icon/ActionResourceIcon";
import styles from "./action-cost.module.scss";

const getLabel = ({ kind, resource }: ActionCost): string => {
  switch (kind) {
    case ActionCostKind.ACTION_RESOURCE:
      return getActionResourceName(resource ?? "");
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

/** The movement's part: "/2" for half, its meters */
const getMovementText = (resource: string | undefined): string | undefined =>
  resource === "half" ? "/2" : resource;

type ActionCostIconProps = { cost: ActionCost };

/**
 * Cost icon, like in the game: green circle for an action, orange triangle
 * for a bonus action, purple diamond for a reaction, a yellow square for the
 * movement (with its part), and the action resource's icon (a light blue
 * square with its level for a spell slot).
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
        {cost.kind === ActionCostKind.ACTION_RESOURCE ? (
          <ActionResourceIcon id={cost.resource ?? ""} />
        ) : (
          <span
            className={cx(
              styles["action-cost__shape"],
              styles[`action-cost__shape--${cost.kind}`],
            )}
            aria-hidden
          >
            {cost.kind === ActionCostKind.MOVEMENT
              ? getMovementText(cost.resource)
              : null}
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
