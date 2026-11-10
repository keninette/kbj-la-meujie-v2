"use client";

import { useId } from "react";
import { Dialog } from "@mui/material";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import styles from "./custom-dialog.module.scss";

type CustomDialogProps = {
  isOpened: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  /** Buttons at the bottom, aligned on the right */
  actions?: React.ReactNode;
};

const CustomDialog = ({
  isOpened,
  onClose,
  title,
  children,
  actions,
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
        <header className={styles["custom-dialog__header"]}>
          <div className={styles["custom-dialog__title-bar"]}>
            <h2 id={titleId} className={styles["custom-dialog__title"]}>
              {title}
            </h2>
            <IconButton
              variant={ButtonVariant.TERTIARY}
              tooltip={translate("close", "layout")}
              faIcon="xmark"
              faIconStyle={FaIconStyleEnum.SOLID}
              onClick={onClose}
              className={styles["custom-dialog__close"]}
              data-testid="custom-dialog-close"
            />
          </div>
          <hr className={styles["custom-dialog__separator"]} />
        </header>
        {children}
        {actions && (
          <div className={styles["custom-dialog__actions"]}>{actions}</div>
        )}
      </div>
    </Dialog>
  );
};

export default CustomDialog;
