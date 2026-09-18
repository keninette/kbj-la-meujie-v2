import { FaIconStyleEnum } from "@lib/enums/fa-icon.style.enum";
import { ButtonVariant } from "@lib/enums/button-variant.enum";
import styles from "./button-with-icon.module.scss";
import FontAwesomeIcon from "../font-awesome-icon/FontAwesomeIcon";

type ButtonWithIconProps = {
  label: string;
  faIcon: string;
  iconPosition?: "left" | "right";
  faIconStyle?: FaIconStyleEnum;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
};

const ButtonWithIcon = ({
  label,
  faIcon,
  iconPosition,
  faIconStyle = FaIconStyleEnum.REGULAR,
  variant = ButtonVariant.FAB,
  onClick,
  disabled = false,
  type = "button",
}: ButtonWithIconProps) => {
  const splitButtonVariantClass = `button-with-icon--${variant}`;

  return (
    <div
      className={`${styles["button-with-icon"]} ${styles[splitButtonVariantClass]}`}
    >
      {iconPosition === "left" && (
        <FontAwesomeIcon
          faIcon={faIcon}
          faIconStyle={faIconStyle}
          className={styles["button-with-icon__icon--left"]}
        />
      )}
      <button
        className={styles["button-with-icon__button"]}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {label}
      </button>
      {iconPosition === "right" && (
        <FontAwesomeIcon
          faIcon={faIcon}
          faIconStyle={faIconStyle}
          className={styles["button-with-icon__icon--right"]}
        />
      )}
    </div>
  );
};

export default ButtonWithIcon;
