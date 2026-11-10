import { cx } from "@/app/_lib/class-names";
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
  /** Id of the form it belongs to, when it is outside of it */
  form?: string;
  className?: string;
  "data-testid"?: string;
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
  form,
  "data-testid": dataTestId,
}: ButtonWithIconProps) => {
  const splitButtonVariantClass = `button-with-icon--${variant}`;

  return (
    <div
      className={cx(
        styles["button-with-icon"],
        styles[splitButtonVariantClass],
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
        form={form}
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
