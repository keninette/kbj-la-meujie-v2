"use client";

import { useId, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import styles from "./kebab-menu.module.scss";

export type KebabMenuItem = {
  label: string;
  faIcon: string;
  faIconStyle?: FaIconStyleEnum;
  onClick?: () => void;
  href?: string;
  openInNewTab?: boolean;
  "data-testid"?: string;
};

type KebabMenuProps = {
  items: KebabMenuItem[];
  label: string;
  className?: string;
  "data-testid"?: string;
};

/** A ⋮ button opening a menu of actions. Drawn over the page, so that it is
 * never cut by a container that scrolls. */
const KebabMenu = ({
  items,
  label,
  className,
  "data-testid": dataTestId,
}: KebabMenuProps) => {
  // The ⋮ button while the menu is opened: the menu is drawn under it
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const isOpened = anchor !== null;
  const menuId = useId();
  const close = () => setAnchor(null);

  return (
    <>
      <button
        type="button"
        className={[styles["kebab-menu__button"], className]
          .filter(Boolean)
          .join(" ")}
        title={label}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpened}
        aria-controls={isOpened ? menuId : undefined}
        onClick={(event) => setAnchor(isOpened ? null : event.currentTarget)}
        data-testid={dataTestId}
      >
        <FontAwesomeIcon
          faIcon="ellipsis-vertical"
          faIconStyle={FaIconStyleEnum.SOLID}
          aria-hidden
        />
      </button>
      <Menu
        id={menuId}
        anchorEl={anchor}
        open={isOpened}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { className: styles["kebab-menu__paper"] } }}
      >
        {items.map((item) => {
          const content = (
            <>
              <FontAwesomeIcon
                faIcon={item.faIcon}
                faIconStyle={item.faIconStyle ?? FaIconStyleEnum.SOLID}
                className={styles["kebab-menu__icon"]}
                aria-hidden
              />
              {item.label}
            </>
          );

          return item.href ? (
            <MenuItem
              key={item.label}
              component="a"
              href={item.href}
              {...(item.openInNewTab
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              onClick={close}
              className={styles["kebab-menu__item"]}
              data-testid={item["data-testid"]}
            >
              {content}
            </MenuItem>
          ) : (
            <MenuItem
              key={item.label}
              onClick={() => {
                close();
                item.onClick?.();
              }}
              className={styles["kebab-menu__item"]}
              data-testid={item["data-testid"]}
            >
              {content}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default KebabMenu;
