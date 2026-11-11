import { cx } from "@/app/_lib/class-names";
import Tooltip from "@mui/material/Tooltip";
import { CombatAction } from "@/app/_lib/types/combat-action.type";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { isDisplayableImageUrl } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.images";
import {
  describeActionDetails,
  parseActionCost,
} from "@/app/combat-tracker/_lib/combat-action.helper";
import ActionCostIcon from "./ActionCostIcon";
import styles from "./action-chip.module.scss";

type ActionChipProps = {
  action: CombatAction;
  /** Shows a remove button in the chip, e.g. in the edit form */
  onRemove?: () => void;
};

/**
 * An action in a chip-like frame: icon, name, costs and details.
 * Its description in a tooltip.
 */
const ActionChip = ({ action, onRemove }: ActionChipProps) => {
  const details = describeActionDetails(action);

  const chip = (
    <span
      className={cx(
        styles["action-chip"],
        action.description && styles["action-chip--with-description"],
      )}
      tabIndex={action.description ? 0 : undefined}
      data-testid="action-chip"
    >
      {isDisplayableImageUrl(action.iconUrl) ? (
        <CharacterPortrait
          src={action.iconUrl}
          alt=""
          width={32}
          height={32}
          className={styles["action-chip__icon"]}
        />
      ) : (
        <span className={styles["action-chip__icon"]} aria-hidden />
      )}
      <span className={styles["action-chip__text"]}>
        <span className={styles["action-chip__title"]}>
          <span className={styles["action-chip__name"]}>{action.name}</span>
          {action.costs.map((cost, index) => (
            <ActionCostIcon
              key={`${cost}-${index}`}
              cost={parseActionCost(cost)}
            />
          ))}
        </span>
        {details && (
          <span className={styles["action-chip__details"]}>{details}</span>
        )}
      </span>
      {onRemove && (
        <IconButton
          variant={ButtonVariant.TERTIARY}
          tooltip={translate("form.remove", "combatTracker")}
          faIcon="xmark"
          faIconStyle={FaIconStyleEnum.SOLID}
          onClick={onRemove}
          className={styles["action-chip__remove"]}
        />
      )}
    </span>
  );

  if (!action.description) {
    return chip;
  }

  return (
    <Tooltip
      title={action.description}
      arrow
      placement="top"
      slotProps={{
        tooltip: { className: styles["action-chip__tooltip"] },
        arrow: { className: styles["action-chip__tooltip-arrow"] },
      }}
    >
      {chip}
    </Tooltip>
  );
};

export default ActionChip;
