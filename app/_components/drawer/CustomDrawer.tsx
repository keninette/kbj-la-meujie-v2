"use client";

import { useId } from "react";
import { Drawer } from "@mui/material";
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
        {title && (
          <header className={styles["custom-drawer__header"]}>
            <h2 id={titleId} className={styles["custom-drawer__title"]}>
              {title}
            </h2>
            <hr className={styles["custom-drawer__separator"]} />
          </header>
        )}
        {children}
      </div>
    </Drawer>
  );
};

export default CustomDrawer;
