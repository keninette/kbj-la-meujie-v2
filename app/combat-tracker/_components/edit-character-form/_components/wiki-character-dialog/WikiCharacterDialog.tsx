"use client";

import { useState, useTransition } from "react";
import { CircularProgress } from "@mui/material";
import CustomDialog from "@/app/_components/_basics/custom-dialog/CustomDialog";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { createCharacterFromWiki } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.actions";
import {
  Bg3WikiErrorEnum,
  WikiCharacter,
} from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.parser";
import {
  WIKI_FIELD_LABEL_KEYS,
  WIKI_IMPORTED_FIELDS,
  WikiImportedField,
} from "@/app/combat-tracker/_lib/bg3-wiki/merge-wiki-character";
import styles from "./wiki-character-dialog.module.scss";

/**
 * Open while mounted: render it only when needed, so that every opening
 * starts from a blank state with the URL pre-filled.
 */
type WikiCharacterDialogProps = {
  onClose: () => void;
  /** Pre-fills the URL field */
  initialUrl?: string;
  /**
   * Called with the character read from the wiki and the fields whose
   * existing values should be replaced (the others are only filled if empty).
   */
  onImport: (
    character: WikiCharacter,
    overrideFields: WikiImportedField[],
  ) => void;
  displayOverrideFields: boolean;
};

const WikiCharacterDialog = ({
  onClose,
  initialUrl = "",
  onImport,
  displayOverrideFields,
}: WikiCharacterDialogProps) => {
  const [url, setUrl] = useState<string>(initialUrl);
  const [overrideFields, setOverrideFields] = useState<WikiImportedField[]>([]);
  const [error, setError] = useState<Bg3WikiErrorEnum | null>(null);
  const [isLoading, startTransition] = useTransition();
  const areAllFieldsOverridden =
    overrideFields.length === WIKI_IMPORTED_FIELDS.length;

  const close = () => {
    if (isLoading) {
      return;
    }
    onClose();
  };

  const toggleField = (field: WikiImportedField, checked: boolean) =>
    // Rebuilt from WIKI_IMPORTED_FIELDS to keep the fields in form order
    setOverrideFields((fields) =>
      WIKI_IMPORTED_FIELDS.filter((f) =>
        f === field ? checked : fields.includes(f),
      ),
    );

  const toggleAllFields = (checked: boolean) =>
    setOverrideFields(checked ? [...WIKI_IMPORTED_FIELDS] : []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createCharacterFromWiki(url);
      if (result.error) {
        setError(result.error);
        return;
      }
      onImport(result.character, overrideFields);
      onClose();
    });
  };

  return (
    <CustomDialog
      isOpened
      onClose={close}
      title={translate("wiki.title", "combatTracker")}
    >
      <form className={styles["wiki-character-dialog"]} onSubmit={handleSubmit}>
        <div className={styles["wiki-character-dialog__field"]}>
          <label
            htmlFor="wiki-url"
            className={styles["wiki-character-dialog__label"]}
          >
            {translate("wiki.url", "combatTracker")}
          </label>
          <input
            type="url"
            className={styles["wiki-character-dialog__input"]}
            id="wiki-url"
            name="wiki-url"
            placeholder="https://bg3.wiki/wiki/Halsin"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled={isLoading}
            required
            autoFocus
            data-testid="wiki-url"
          />
        </div>
        {displayOverrideFields && (
          <fieldset
            className={styles["wiki-character-dialog__overrides"]}
            disabled={isLoading}
          >
            <legend className={styles["wiki-character-dialog__label"]}>
              {translate("wiki.override", "combatTracker")}
            </legend>
            <p className={styles["wiki-character-dialog__hint"]}>
              {translate("wiki.overrideHint", "combatTracker")}
            </p>
            <label
              className={[
                styles["wiki-character-dialog__checkbox"],
                styles["wiki-character-dialog__checkbox--all"],
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={areAllFieldsOverridden}
                onChange={(event) => toggleAllFields(event.target.checked)}
                data-testid="wiki-override-all"
              />
              {translate("wiki.overrideAll", "combatTracker")}
            </label>
            <div className={styles["wiki-character-dialog__override-list"]}>
              {WIKI_IMPORTED_FIELDS.map((field) => (
                <label
                  key={field}
                  className={styles["wiki-character-dialog__checkbox"]}
                >
                  <input
                    type="checkbox"
                    checked={overrideFields.includes(field)}
                    onChange={(event) =>
                      toggleField(field, event.target.checked)
                    }
                    data-testid={`wiki-override-${field}`}
                  />
                  {translate(WIKI_FIELD_LABEL_KEYS[field], "combatTracker")}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {error && (
          <p className={styles["wiki-character-dialog__error"]} role="alert">
            {translate(`wiki.error.${error}`, "combatTracker")}
          </p>
        )}
        {isLoading && (
          <div className={styles["wiki-character-dialog__loader"]}>
            <CircularProgress size="1.5rem" color="inherit" />
            <span>{translate("wiki.loading", "combatTracker")}</span>
          </div>
        )}
        <div className={styles["wiki-character-dialog__actions"]}>
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

export default WikiCharacterDialog;
