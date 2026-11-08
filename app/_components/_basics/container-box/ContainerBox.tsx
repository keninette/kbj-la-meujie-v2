import { cx } from "@/app/_lib/class-names";
import styles from "./container-box.module.scss";

type ContainerBoxProps = React.HTMLAttributes<HTMLElement> & {
  /** The element drawn as a card: a fieldset in a form, a section... */
  as?: "div" | "section" | "fieldset";
  /** Draws attention to it, e.g. after it was filled automatically */
  isHighlighted?: boolean;
  "data-testid"?: string;
};

const ContainerBox = ({
  as: Element = "div",
  isHighlighted = false,
  className,
  children,
  ...props
}: ContainerBoxProps) => (
  <Element
    className={cx(
      styles["container-box"],
      isHighlighted && styles["container-box--highlighted"],
      className,
    )}
    {...props}
  >
    {children}
  </Element>
);

export default ContainerBox;
