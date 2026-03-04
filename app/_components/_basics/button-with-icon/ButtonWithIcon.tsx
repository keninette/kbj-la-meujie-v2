import { FaIconStyleEnum } from "@lib/enums/fa-icon.style.enum";
import { ButtonVariant } from "@lib/enums/button-variant.enum";
import styles from "./button-with-icon.module.scss";

type ButtonWithIconProps = {
  label: string;
  faIcon: string;
  iconPosition?: "left" | "right";
  faIconStyle?: FaIconStyleEnum;
  variant?: ButtonVariant;
  onClick?: () => void;
  className?: string;
};

const ButtonWithIcon = ({
  label,
  faIcon,
  iconPosition,
  faIconStyle = FaIconStyleEnum.REGULAR,
  variant = ButtonVariant.FAB,
  onClick,
}: ButtonWithIconProps) => {
  const splitButtonVariantClass = `button-with-icon--${variant}`;

  return (
    <div
      className={`${styles["button-with-icon"]} ${styles[splitButtonVariantClass]}`}
    >
      {iconPosition === "left" && (
        <i
          className={`fa-${faIconStyle} fa-${faIcon} ${styles["button-with-icon__icon"]} ${styles["button-with-icon__icon--left"]}`}
        />
      )}
      <button className={styles["button-with-icon__button"]} onClick={onClick}>
        {label}
      </button>
      {iconPosition === "right" && (
        <i
          className={`fa-${faIconStyle} fa-${faIcon} ${styles["button-with-icon__icon--right"]}`}
        />
      )}
    </div>
  );
};

export default ButtonWithIcon;
