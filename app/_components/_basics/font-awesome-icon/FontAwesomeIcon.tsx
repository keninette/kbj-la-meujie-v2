import { cx } from "@/app/_lib/class-names";
import type { HTMLAttributes } from "react";
import { FaIconSizeEnum } from "@/app/_lib/enums/fa-icon.size.enum";
import Tooltip from "../tooltip/Tooltip";

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
    <Tooltip content={tooltip}>
      <i
        className={cx(
          `fa-${faIconStyle}`,
          `fa-${faIcon}`,
          faSize && `fa-${faSize}`,
          className,
        )}
        {...props}
      />
    </Tooltip>
  );
};

export default FontAwesomeIcon;
