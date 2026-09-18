import type { HTMLAttributes } from "react";

type FontAwesomeIconProps = Omit<
  HTMLAttributes<HTMLElement>,
  "className" | "title"
> & {
  faIcon: string;
  faIconStyle: "solid" | "regular" | "brands";
  className?: string;
  tooltip?: string;
};
const FontAwesomeIcon = ({
  faIcon,
  faIconStyle,
  className,
  tooltip,
  ...props
}: FontAwesomeIconProps) => {
  return (
    <i
      className={`fa-${faIconStyle} fa-${faIcon} ${className ? className : ""}`}
      title={tooltip}
      {...props}
    />
  );
};

export default FontAwesomeIcon;
