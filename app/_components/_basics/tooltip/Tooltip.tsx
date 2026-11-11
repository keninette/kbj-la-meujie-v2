"use client";

import type { ReactElement, ReactNode } from "react";
import MuiTooltip from "@mui/material/Tooltip";
import styles from "./tooltip.module.scss";

type TooltipProps = {
  /** What the tooltip shows; without it, only the children are rendered */
  content?: ReactNode;
  /** The element hovered or focused: an HTML element or a component passing its ref */
  children: ReactElement;
};

/** Shown above its child on hover and focus, instead of a native `title` */
const Tooltip = ({ content, children }: TooltipProps) => {
  if (!content) {
    return children;
  }

  return (
    <MuiTooltip
      title={content}
      arrow
      placement="top"
      slotProps={{
        tooltip: { className: styles["tooltip"] },
        arrow: { className: styles["tooltip__arrow"] },
      }}
    >
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
