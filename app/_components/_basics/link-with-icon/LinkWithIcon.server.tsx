import Link from "next/link";
import styles from "./link-with-icon.module.scss";
import { FaIconStyle } from "@lib/enums/fa-icon.style";

type LinkWithIconProps = {
  label: string;
  href: string;
  faIcon: string;
  iconPosition?: "left" | "right";
  faIconStyle?: FaIconStyle;
  className?: string;
  title?: string;
};

const LinkWithIcon = ({
  label,
  href,
  faIcon,
  iconPosition = "left",
  faIconStyle = FaIconStyle.REGULAR,
  className,
  title,
}: LinkWithIconProps) => {
  const iconPositionClassName = `link-with-icon--${iconPosition}`;
  const iconElement = (
    <i
      className={`fa-${faIconStyle} fa-${faIcon} ${styles[iconPositionClassName]}`}
    />
  );

  return (
    <Link
      href={href}
      className={`${styles["link-with-icon"]} ${className}`}
      title={title ?? label}
    >
      {iconPosition === "left" && iconElement}
      {label}
      {iconPosition === "right" && iconElement}
    </Link>
  );
};

export default LinkWithIcon;
