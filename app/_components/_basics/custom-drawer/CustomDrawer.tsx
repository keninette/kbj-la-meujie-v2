"use client";

import { useId } from "react";
import { Drawer } from "@mui/material";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import styles from "./custom-drawer.module.scss";

type DrawerProps = {
  isOpened: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const CustomDrawer = ({ isOpened, onClose, title, children }: DrawerProps) => {
  const titleId = useId();

  return (
    <Drawer
      open={isOpened}
      onClose={onClose}
      anchor={"right"}
      classes={{
        paper: styles["custom-drawer"],
      }}
      slotProps={{
        backdrop: { className: styles["custom-drawer__backdrop"] },
        paper: title ? { "aria-labelledby": titleId } : undefined,
      }}
    >
      <div className={styles["custom-drawer__content"]}>
        <header className={styles["custom-drawer__header"]}>
          <div className={styles["custom-drawer__title-bar"]}>
            {title && (
              <h2 id={titleId} className={styles["custom-drawer__title"]}>
                {title}
              </h2>
            )}
            {/* Only closes: whatever is in the drawer is not saved */}
            <IconButton
              variant={ButtonVariant.TERTIARY}
              tooltip={translate("close", "layout")}
              faIcon="xmark"
              faIconStyle={FaIconStyleEnum.SOLID}
              onClick={onClose}
              className={styles["custom-drawer__close"]}
              data-testid="custom-drawer-close"
            />
          </div>
          {title && <hr className={styles["custom-drawer__separator"]} />}
        </header>
        {children}
      </div>
    </Drawer>
  );
};

export default CustomDrawer;
