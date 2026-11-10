import { cx } from "@/app/_lib/class-names";
import { FaIconStyleEnum } from "@lib/enums/fa-icon.style.enum";
import { ButtonVariant } from "@lib/enums/button-variant.enum";
import { ButtonSize } from "@lib/enums/button-size.enum";
import styles from "./button-with-icon.module.scss";
import FontAwesomeIcon from "../font-awesome-icon/FontAwesomeIcon";

type ButtonWithIconProps = {
  label: string;
  faIcon: string;
  iconPosition?: "left" | "right";
  faIconStyle?: FaIconStyleEnum;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  "data-testid"?: string;
};

const ButtonWithIcon = ({
  label,
  faIcon,
  iconPosition,
  faIconStyle = FaIconStyleEnum.REGULAR,
  variant = ButtonVariant.FAB,
  size = ButtonSize.M,
  onClick,
  disabled = false,
  type = "button",
  "data-testid": dataTestId,
}: ButtonWithIconProps) => {
  const splitButtonVariantClass = `button-with-icon--${variant}`;

  return (
    <div
      className={cx(
        styles["button-with-icon"],
        styles[splitButtonVariantClass],
        size === ButtonSize.XS && styles["button-with-icon--xs"],
        disabled ? styles["button-with-icon--disabled"] : undefined,
      )}
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
        data-testid={dataTestId}
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
