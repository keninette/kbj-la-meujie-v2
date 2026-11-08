import { cx } from "@/app/_lib/class-names";
import styles from "./chip.module.scss";

type ChipProps = {
  label: string;
  /** Shown before the label, e.g. a FontAwesomeIcon */
  icon?: React.ReactNode;
  tooltip?: string;
  className?: string;
  "data-testid"?: string;
};

/** A small rounded label, e.g. the attitude of an NPC */
const Chip = ({
  label,
  icon,
  tooltip,
  className,
  "data-testid": dataTestId,
}: ChipProps) => (
  <span
    className={cx(styles["chip"], className)}
    title={tooltip}
    data-testid={dataTestId}
  >
    {icon && <span>{icon}</span>}
    {label}
  </span>
);

export default Chip;
