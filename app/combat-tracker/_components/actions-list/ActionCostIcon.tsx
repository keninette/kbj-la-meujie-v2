import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import {
  ActionCost,
  ActionCostKind,
} from "@/app/combat-tracker/_lib/combat-action.helper";
import styles from "./actions-list.module.scss";

const getLabel = ({ kind, resource }: ActionCost): string => {
  switch (kind) {
    case ActionCostKind.SPELL_SLOT:
      return translate("actions.cost.spellSlot", "combatTracker", {
        level: resource ?? "",
      });
    case ActionCostKind.RESOURCE:
      // Named like in the spell slots, e.g. "layonh"
      return resource ?? "";
    default:
      return translate(`actions.cost.${kind}`, "combatTracker");
  }
};

type ActionCostIconProps = { cost: ActionCost };

/**
 * Cost icon, like in the game: green circle for an action, red triangle for
 * a bonus action, purple diamond for a reaction, blue square for a spell slot
 * (with its level) and a yellow wand for any other resource.
 */
const ActionCostIcon = ({ cost }: ActionCostIconProps) => {
  const label = getLabel(cost);
  const tooltip = cost.amount > 1 ? `${label} ×${cost.amount}` : label;

  return (
    <span
      className={styles["action-cost"]}
      title={tooltip}
      role="img"
      aria-label={tooltip}
      data-testid={`action-cost-${cost.kind}`}
    >
      {cost.kind === ActionCostKind.RESOURCE ? (
        <FontAwesomeIcon
          faIcon="wand-magic-sparkles"
          faIconStyle={FaIconStyleEnum.SOLID}
          className={styles["action-cost__wand"]}
          aria-hidden
        />
      ) : (
        <span
          className={[
            styles["action-cost__shape"],
            styles[`action-cost__shape--${cost.kind}`],
          ].join(" ")}
          aria-hidden
        >
          {cost.kind === ActionCostKind.SPELL_SLOT ? cost.resource : null}
        </span>
      )}
      {cost.amount > 1 && (
        <span className={styles["action-cost__amount"]} aria-hidden>
          ×{cost.amount}
        </span>
      )}
    </span>
  );
};

export default ActionCostIcon;
