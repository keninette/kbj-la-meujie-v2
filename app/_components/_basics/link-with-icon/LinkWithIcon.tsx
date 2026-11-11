import { cx } from "@/app/_lib/class-names";
import Link from "next/link";
import styles from "./link-with-icon.module.scss";
import Tooltip from "../tooltip/Tooltip";
import { FaIconStyleEnum } from "@lib/enums/fa-icon.style.enum";

type LinkWithIconProps = {
  /** Optional: without it, only the icon is shown and `title` is the tooltip */
  label?: string;
  href: string;
  faIcon: string;
  iconPosition?: "left" | "right";
  faIconStyle?: FaIconStyleEnum;
  className?: string;
  title?: string;
  /** Opens the link in a new tab (e.g. external pages) */
  openInNewTab?: boolean;
  "data-testid"?: string;
};

const LinkWithIcon = ({
  label,
  href,
  faIcon,
  iconPosition = "left",
  faIconStyle = FaIconStyleEnum.REGULAR,
  className,
  title,
  openInNewTab = false,
  "data-testid": dataTestId,
}: LinkWithIconProps) => {
  // The spacing between icon and label is only needed when there is a label
  const iconPositionClassName = label
    ? styles[`link-with-icon--${iconPosition}`]
    : "";
  const iconElement = (
    <i className={`fa-${faIconStyle} fa-${faIcon} ${iconPositionClassName}`} />
  );

  return (
    <Tooltip content={title}>
      <Link
        href={href}
        className={cx(
          styles["link-with-icon"],
          !label && styles["link-with-icon--icon-only"],
          className,
        )}
        aria-label={label ? undefined : title}
        data-testid={dataTestId}
        {...(openInNewTab
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {iconPosition === "left" && iconElement}
        {label}
        {iconPosition === "right" && iconElement}
      </Link>
    </Tooltip>
  );
};

export default LinkWithIcon;
