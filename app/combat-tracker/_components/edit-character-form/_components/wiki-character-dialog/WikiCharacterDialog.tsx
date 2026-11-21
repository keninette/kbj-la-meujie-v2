"use client";

import { cx } from "@/app/_lib/class-names";
import { useState } from "react";
import { translate } from "@/app/_dictionaries/dictionnary";
import { createCharacterFromWiki } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.actions";
import { WikiCharacter } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.parser";
import {
  WIKI_FIELD_LABEL_KEYS,
  WIKI_IMPORTED_FIELDS,
  WikiImportedField,
} from "@/app/combat-tracker/_lib/bg3-wiki/merge-wiki-character";
import WikiImportDialog from "@/app/combat-tracker/_components/wiki-import-dialog/WikiImportDialog";
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
  initialUrl,
  onImport,
  displayOverrideFields,
}: WikiCharacterDialogProps) => {
  const [overrideFields, setOverrideFields] = useState<WikiImportedField[]>([]);
  const areAllFieldsOverridden =
    overrideFields.length === WIKI_IMPORTED_FIELDS.length;

  const toggleField = (field: WikiImportedField, checked: boolean) =>
    // Rebuilt from WIKI_IMPORTED_FIELDS to keep the fields in form order
    setOverrideFields((fields) =>
      WIKI_IMPORTED_FIELDS.filter((f) =>
        f === field ? checked : fields.includes(f),
      ),
    );

  const toggleAllFields = (checked: boolean) =>
    setOverrideFields(checked ? [...WIKI_IMPORTED_FIELDS] : []);

  const importFromUrl = async (url: string) => {
    const result = await createCharacterFromWiki(url);
    if (result.error) {
      return result.error;
    }
    onImport(result.character, overrideFields);
  };

  return (
    <WikiImportDialog
      onClose={onClose}
      initialUrl={initialUrl}
      placeholder="https://bg3.wiki/wiki/Halsin"
      importFromUrl={importFromUrl}
    >
      {displayOverrideFields && (
        <fieldset className={styles["wiki-character-dialog"]}>
          <legend className={styles["wiki-character-dialog__legend"]}>
            {translate("wiki.override", "combatTracker")}
          </legend>
          <p className={styles["wiki-character-dialog__hint"]}>
            {translate("wiki.overrideHint", "combatTracker")}
          </p>
          <label
            className={cx(
              styles["wiki-character-dialog__checkbox"],
              styles["wiki-character-dialog__checkbox--all"],
            )}
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
                  onChange={(event) => toggleField(field, event.target.checked)}
                  data-testid={`wiki-override-${field}`}
                />
                {translate(WIKI_FIELD_LABEL_KEYS[field], "combatTracker")}
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </WikiImportDialog>
  );
};

export default WikiCharacterDialog;
