import { cx } from "@/app/_lib/class-names";
import type { HTMLAttributes } from "react";
import { FaIconSizeEnum } from "@/app/_lib/enums/fa-icon.size.enum";

type FontAwesomeIconProps = Omit<
  HTMLAttributes<HTMLElement>,
  "className" | "title"
> & {
  faIcon: string;
  faIconStyle: "solid" | "regular" | "brands";
  /** Relative to the text around it. None: the size of the text */
  faSize?: FaIconSizeEnum;
  className?: string;
  tooltip?: string;
};
const FontAwesomeIcon = ({
  faIcon,
  faIconStyle,
  faSize,
  className,
  tooltip,
  ...props
}: FontAwesomeIconProps) => {
  return (
    <i
      className={cx(
        `fa-${faIconStyle}`,
        `fa-${faIcon}`,
        faSize && `fa-${faSize}`,
        className,
      )}
      title={tooltip}
      {...props}
    />
  );
};

export default FontAwesomeIcon;
