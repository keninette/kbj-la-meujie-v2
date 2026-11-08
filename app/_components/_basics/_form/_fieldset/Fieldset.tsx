import { cx } from "@/app/_lib/class-names";
import ContainerBox from "@/app/_components/_basics/container-box/ContainerBox";
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
  <ContainerBox
    as="fieldset"
    isHighlighted={isHighlighted}
    className={cx(styles["fieldset"], className)}
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
  </ContainerBox>
);

export default Fieldset;
