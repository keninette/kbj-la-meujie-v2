import type { ReactNode } from "react";
import { cx } from "@/app/_lib/class-names";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import IconButton from "../icon-button/IconButton";
import Tooltip from "../tooltip/Tooltip";
import styles from "./detailed-chip.module.scss";

type DetailedChipProps = {
  /** A 32px image; an empty square without it */
  icon?: ReactNode;
  title: string;
  /** Shown after the title, e.g. the costs of an action */
  titleAdornment?: ReactNode;
  /** The muted line under the title */
  subtitle?: ReactNode;
  /** Shown on hover and focus */
  tooltip?: ReactNode;
  deleteAction?: { onClick: () => void; tooltip: string };
  "data-testid"?: string;
};

/**
 * A chip with an icon, a title and a subtitle, e.g. an action or a condition.
 * Its tooltip, if any, on hover and focus.
 */
const DetailedChip = ({
  icon,
  title,
  titleAdornment,
  subtitle,
  tooltip,
  deleteAction,
  "data-testid": dataTestId,
}: DetailedChipProps) => {
  const chip = (
    <span
      className={cx(
        styles["detailed-chip"],
        Boolean(tooltip) && styles["detailed-chip--with-tooltip"],
      )}
      tabIndex={tooltip ? 0 : undefined}
      data-testid={dataTestId}
    >
      <span className={styles["detailed-chip__icon"]} aria-hidden={!icon}>
        {icon}
      </span>
      <span className={styles["detailed-chip__text"]}>
        <span className={styles["detailed-chip__title"]}>
          <span className={styles["detailed-chip__name"]}>{title}</span>
          {titleAdornment}
        </span>
        {subtitle && (
          <span className={styles["detailed-chip__subtitle"]}>{subtitle}</span>
        )}
      </span>
      {deleteAction && (
        <IconButton
          variant={ButtonVariant.TERTIARY}
          tooltip={deleteAction.tooltip}
          faIcon="xmark"
          faIconStyle={FaIconStyleEnum.SOLID}
          size="small"
          onClick={deleteAction.onClick}
          className={styles["detailed-chip__delete"]}
        />
      )}
    </span>
  );

  return <Tooltip content={tooltip}>{chip}</Tooltip>;
};

export default DetailedChip;
