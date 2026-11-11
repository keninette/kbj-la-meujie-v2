import { cx } from "@/app/_lib/class-names";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import IconButton from "../icon-button/IconButton";
import Tooltip from "../tooltip/Tooltip";
import styles from "./chip.module.scss";

type ChipProps = {
  label: string;
  /** Shown before the label, e.g. a FontAwesomeIcon */
  icon?: React.ReactNode;
  tooltip?: string;
  deleteAction?: { onClick: () => void; tooltip: string };
  className?: string;
  "data-testid"?: string;
};

/** A small rounded label, e.g. the attitude of an NPC */
const Chip = ({
  label,
  icon,
  tooltip,
  deleteAction,
  className,
  "data-testid": dataTestId,
}: ChipProps) => (
  <Tooltip content={tooltip}>
    <span className={cx(styles["chip"], className)} data-testid={dataTestId}>
      {icon && <span>{icon}</span>}
      {label}
      {deleteAction && (
        <IconButton
          variant={ButtonVariant.TERTIARY}
          tooltip={deleteAction.tooltip}
          faIcon="xmark"
          faIconStyle={FaIconStyleEnum.SOLID}
          size="small"
          onClick={deleteAction.onClick}
          className={styles["chip__delete"]}
        />
      )}
    </span>
  </Tooltip>
);

export default Chip;
