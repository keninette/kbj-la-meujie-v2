"use client";

import { useState, useTransition } from "react";
import { CircularProgress } from "@mui/material";
import CustomDialog from "@/app/_components/_basics/custom-dialog/CustomDialog";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { Bg3WikiErrorEnum } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.parser";
import styles from "./wiki-import-dialog.module.scss";

type WikiImportDialogProps = {
  onClose: () => void;
  /** Pre-fills the URL field */
  initialUrl?: string;
  /** An example of URL */
  placeholder: string;
  /**
   * Imports the page: returns the error to show, or nothing when it's
   * imported, and the dialog then closes
   */
  importFromUrl: (url: string) => Promise<Bg3WikiErrorEnum | undefined>;
  /** Import options, below the URL: disabled while importing */
  children?: React.ReactNode;
};

/**
 * Asks for a bg3.wiki URL and imports it, with a loader and the error.
 * Open while mounted: render it only when needed, so that every opening
 * starts from a blank state.
 */
const WikiImportDialog = ({
  onClose,
  initialUrl = "",
  placeholder,
  importFromUrl,
  children,
}: WikiImportDialogProps) => {
  const [url, setUrl] = useState<string>(initialUrl);
  const [error, setError] = useState<Bg3WikiErrorEnum | null>(null);
  const [isLoading, startTransition] = useTransition();

  const close = () => {
    if (isLoading) {
      return;
    }
    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // React events go up through the dialog's portal: when it's opened from
    // a form (the passives of the character form), don't submit that form
    event.preventDefault();
    event.stopPropagation();
    setError(null);
    startTransition(async () => {
      const importError = await importFromUrl(url);
      if (importError) {
        setError(importError);
        return;
      }
      onClose();
    });
  };

  return (
    <CustomDialog
      isOpened
      onClose={close}
      title={translate("wiki.title", "combatTracker")}
    >
      <form className={styles["wiki-import-dialog"]} onSubmit={handleSubmit}>
        <div className={styles["wiki-import-dialog__field"]}>
          <label
            htmlFor="wiki-url"
            className={styles["wiki-import-dialog__label"]}
          >
            {translate("wiki.url", "combatTracker")}
          </label>
          <input
            type="url"
            className={styles["wiki-import-dialog__input"]}
            id="wiki-url"
            name="wiki-url"
            placeholder={placeholder}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled={isLoading}
            required
            autoFocus
            data-testid="wiki-url"
          />
        </div>
        {children && (
          <fieldset
            className={styles["wiki-import-dialog__options"]}
            disabled={isLoading}
          >
            {children}
          </fieldset>
        )}
        {error && (
          <p className={styles["wiki-import-dialog__error"]} role="alert">
            {translate(`wiki.error.${error}`, "combatTracker")}
          </p>
        )}
        {isLoading && (
          <div className={styles["wiki-import-dialog__loader"]}>
            <CircularProgress size="1.5rem" color="inherit" />
            <span>{translate("wiki.loading", "combatTracker")}</span>
          </div>
        )}
        <div className={styles["wiki-import-dialog__actions"]}>
          <ButtonWithIcon
            label={translate("wiki.cancel", "combatTracker")}
            onClick={close}
            disabled={isLoading}
            faIcon="xmark"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
            variant={ButtonVariant.SECONDARY}
          />
          <ButtonWithIcon
            label={translate("wiki.import", "combatTracker")}
            type="submit"
            disabled={isLoading || !url.trim()}
            faIcon="wand-magic-sparkles"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
            data-testid="wiki-import"
          />
        </div>
      </form>
    </CustomDialog>
  );
};

export default WikiImportDialog;
