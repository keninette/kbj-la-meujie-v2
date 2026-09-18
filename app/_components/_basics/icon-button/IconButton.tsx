import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import FontAwesomeIcon from "../font-awesome-icon/FontAwesomeIcon";
import styles from "./icon-button.module.scss";

type IconButtonProps = {
  faIcon: string;
  faIconStyle?: FaIconStyleEnum;
  variant?: ButtonVariant;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  tooltip: string;
};

const IconButton = ({
  faIcon,
  faIconStyle = FaIconStyleEnum.REGULAR,
  variant = ButtonVariant.FAB,
  onClick,
  type = "button",
  className,
  tooltip,
}: IconButtonProps) => {
  const variantClassName = styles[`icon-button--${variant}`];

  return (
    <button
      className={`${styles["icon-button"]} ${variantClassName} ${className ?? ""}`}
      onClick={onClick}
      title={tooltip}
      type={type}
      aria-label={tooltip}
    >
      <FontAwesomeIcon faIcon={faIcon} faIconStyle={faIconStyle} />
    </button>
  );
};

export default IconButton;
