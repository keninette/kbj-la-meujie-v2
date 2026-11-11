import { cx } from "@/app/_lib/class-names";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import FontAwesomeIcon from "../font-awesome-icon/FontAwesomeIcon";
import styles from "./icon-button.module.scss";

type IconButtonProps = {
  faIcon: string;
  faIconStyle?: FaIconStyleEnum;
  variant?: ButtonVariant;
  /** "small": as high as the text around it, e.g. in a line of text */
  size?: "regular" | "small";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  tooltip: string;
  "data-testid"?: string;
};

const IconButton = ({
  faIcon,
  faIconStyle = FaIconStyleEnum.REGULAR,
  variant = ButtonVariant.FAB,
  size = "regular",
  onClick,
  type = "button",
  className,
  tooltip,
  "data-testid": dataTestId,
}: IconButtonProps) => (
  <button
    className={cx(
      styles["icon-button"],
      styles[`icon-button--${variant}`],
      size === "small" && styles["icon-button--small"],
      className,
    )}
    onClick={onClick}
    title={tooltip}
    type={type}
    aria-label={tooltip}
    data-testid={dataTestId}
  >
    <FontAwesomeIcon faIcon={faIcon} faIconStyle={faIconStyle} />
  </button>
);

export default IconButton;
