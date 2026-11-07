import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import styles from "./fieldset.module.scss";

type FieldsetProps = {
  title?: string;
  titleIcon?: string;
  titleIconStyle?: FaIconStyleEnum;
  /** Draws attention to it, e.g. after it was filled automatically */
  isHighlighted?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const Fieldset = ({
  title,
  titleIcon,
  titleIconStyle = FaIconStyleEnum.SOLID,
  isHighlighted = false,
  className,
  children,
}: FieldsetProps) => (
  <fieldset
    className={[
      styles["fieldset"],
      isHighlighted && styles["fieldset--highlighted"],
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {title && (
      <legend className={styles["fieldset__title"]}>
        {titleIcon && (
          <FontAwesomeIcon
            faIcon={titleIcon}
            faIconStyle={titleIconStyle}
            aria-hidden
          />
        )}
        {title}
      </legend>
    )}
    {children}
  </fieldset>
);

export default Fieldset;
