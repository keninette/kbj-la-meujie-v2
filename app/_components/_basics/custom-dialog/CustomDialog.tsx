"use client";

import { useId } from "react";
import { Dialog } from "@mui/material";
import styles from "./custom-dialog.module.scss";

type CustomDialogProps = {
  isOpened: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

/** Modal window with the app's look: a title, then the given content */
const CustomDialog = ({
  isOpened,
  onClose,
  title,
  children,
}: CustomDialogProps) => {
  const titleId = useId();

  return (
    <Dialog
      open={isOpened}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby={titleId}
      slotProps={{
        paper: { className: styles["custom-dialog__paper"] },
        backdrop: { className: styles["custom-dialog__backdrop"] },
      }}
    >
      <div className={styles["custom-dialog"]}>
        <h2 id={titleId} className={styles["custom-dialog__title"]}>
          {title}
        </h2>
        {children}
      </div>
    </Dialog>
  );
};

export default CustomDialog;
