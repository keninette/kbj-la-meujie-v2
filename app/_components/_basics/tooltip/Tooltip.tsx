"use client";

import {
  cloneElement,
  useRef,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MuiTooltip from "@mui/material/Tooltip";
import styles from "./tooltip.module.scss";

type TooltipProps = {
  /** What the tooltip shows; without it, only the children are rendered */
  content?: ReactNode;
  /** The element hovered or clicked: an HTML element or a component passing its ref */
  children: ReactElement<{ onClick?: (event: MouseEvent) => void }>;
};

/**
 * Shown above its child on hover, and on click or tap (e.g. on a tablet) until
 * a click outside of it. Instead of a native `title`.
 */
const Tooltip = ({ content, children }: TooltipProps) => {
  const [isOpened, setIsOpened] = useState(false);
  // Drawn elsewhere in the page: a click in it is not "outside"
  const contentRef = useRef<HTMLSpanElement>(null);

  if (!content) {
    return children;
  }

  return (
    <ClickAwayListener
      onClickAway={(event) => {
        if (!contentRef.current?.contains(event.target as Node)) {
          setIsOpened(false);
        }
      }}
    >
      <MuiTooltip
        title={<span ref={contentRef}>{content}</span>}
        open={isOpened}
        onOpen={() => setIsOpened(true)}
        onClose={() => setIsOpened(false)}
        disableTouchListener
        arrow
        placement="top"
        slotProps={{
          tooltip: { className: styles["tooltip"] },
          arrow: { className: styles["tooltip__arrow"] },
        }}
      >
        {cloneElement(children, {
          onClick: (event: MouseEvent) => {
            children.props.onClick?.(event);
            setIsOpened(true);
          },
        })}
      </MuiTooltip>
    </ClickAwayListener>
  );
};

export default Tooltip;
