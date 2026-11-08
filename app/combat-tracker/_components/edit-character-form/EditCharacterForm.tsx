"use client";

import { useState } from "react";
import Image from "next/image";
import dndLogo from "@/public/assets/universes/dnd.png";
import styles from "./edit-character-form.module.scss";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import SubmitButton from "@/app/_components/_basics/_form/_submit-button/SubmitButton";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { getMaxAlternativeHp } from "@/app/combat-tracker/_components/attack-form/attack-form.helper";
import {
  BG3_WIKI_HOST,
  buildWikiLink,
  WikiCharacter,
} from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.parser";
import {
  listUpdatedFields,
  mergeWikiCharacter,
  WIKI_FIELD_LABEL_KEYS,
  WikiImportedField,
} from "@/app/combat-tracker/_lib/bg3-wiki/merge-wiki-character";
import WikiCharacterDialog from "@/app/combat-tracker/_components/edit-character-form/_components/wiki-character-dialog/WikiCharacterDialog";
import IdentityFieldset from "./_components/IdentityFieldset";
import CombatFieldset from "./_components/CombatFieldset";
import SpellSlotsFieldset from "./_components/SpellSlotsFieldset";
import TextListFieldset from "./_components/TextListFieldset";
import ActionsFieldset from "./_components/ActionsFieldset";
import StatesFieldset from "./_components/StatesFieldset";

type EditCharacterFormProps = {
  initialCharacter: CombatCharacter | null;
  onSubmit?: (character: CombatCharacter) => void;
  /** Saves the character, and keeps the form open and empty for the next
   * one. The "save and restart" button is shown only when this is given. */
  onSaveAndRestart?: (character: CombatCharacter) => void;
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `character-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createEmptyCharacter = (): CombatCharacter => ({
  id: createId(),
  name: "",
  hp: 0,
  maxHp: 0,
  isDying: false,
  isDead: false,
  isNpc: false,
  deathSaveThrowsLeft: 3,
  ac: 0,
  initiativeScore: 0,
});

const EditCharacterForm = ({
  initialCharacter,
  onSubmit,
  onSaveAndRestart,
}: EditCharacterFormProps) => {
  const [character, setCharacter] = useState<CombatCharacter | null>(
    initialCharacter,
  );
  const [isWikiDialogOpened, setIsWikiDialogOpened] = useState(false);
  // Changed to remount the fieldsets, which clears their unsaved inputs
  const [formKey, setFormKey] = useState(0);
  const imageUrl = character?.imageUrl?.trim();

  // The character's wiki page, or a guess from its name
  const wikiUrlGuess =
    character?.wikiLink?.trim() ||
    (character?.name?.trim()
      ? buildWikiLink(character.name.trim())
      : `https://${BG3_WIKI_HOST}/wiki/`);

  // Fields changed by the last wiki import: listed in the summary, and
  // highlighted until they are edited by hand. null = no import yet.
  const [importedFields, setImportedFields] = useState<
    WikiImportedField[] | null
  >(null);
  const [highlightedFields, setHighlightedFields] = useState<
    WikiImportedField[]
  >([]);

  const clearHighlight = (field: string) =>
    setHighlightedFields((fields) => fields.filter((f) => f !== field));

  // "--imported" modifier of a field while highlighted
  const importedClassName = (field: WikiImportedField) =>
    highlightedFields.includes(field)
      ? styles["edit-character-form__field--imported"]
      : undefined;

  const importFromWiki = (
    fetched: WikiCharacter,
    overrideFields: WikiImportedField[],
  ) => {
    const current = character ?? createEmptyCharacter();
    const merged = mergeWikiCharacter(current, fetched, overrideFields);
    const updatedFields = listUpdatedFields(current, merged);

    setCharacter(
      initialCharacter === null ? { ...merged, isNpc: true } : merged,
    );
    setImportedFields(updatedFields);
    setHighlightedFields(updatedFields);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    clearHighlight(name);

    let formattedValue: string | number | boolean = value;
    switch (name) {
      case "name":
      case "shortDescription":
      case "wikiLink":
      case "imageUrl":
        formattedValue = value;
        break;
      case "isNpc":
      case "isDead":
        formattedValue = event.target.checked;
        break;
      default:
        formattedValue = +value;
    }

    setCharacter(
      (prevCharacter) =>
        ({
          ...(prevCharacter ?? createEmptyCharacter()),
          [name]: formattedValue,
          ...(name === "hp"
            ? {
                isDying: +value <= 0,
                isDead: +value <= 0 && prevCharacter?.isDead,
              }
            : {}),
        }) as CombatCharacter,
    );
  };

  // Replaces the given fields, and the highlight of the imported field they
  // belong to, if any
  const updateCharacter = (
    changes: Partial<CombatCharacter>,
    importedField?: WikiImportedField,
  ) => {
    if (importedField) {
      clearHighlight(importedField);
    }
    setCharacter((prevChar) => ({
      ...(prevChar ?? createEmptyCharacter()),
      ...changes,
    }));
  };

  // The character as saved, or null when nothing was entered
  const buildSavedCharacter = (): CombatCharacter | null =>
    character && {
      ...character,
      id: character.id || createId(),
      maxAlternativeHp: getMaxAlternativeHp(character),
      // A cleared field means "no link" / "no picture"
      wikiLink: character.wikiLink?.trim() || undefined,
      imageUrl: imageUrl || undefined,
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const savedCharacter = buildSavedCharacter();
    if (savedCharacter) {
      onSubmit?.(savedCharacter);
    }
  };

  const saveAndRestart = () => {
    const savedCharacter = buildSavedCharacter();
    if (!savedCharacter) {
      return;
    }

    onSaveAndRestart?.(savedCharacter);
    setCharacter(null);
    setImportedFields(null);
    setHighlightedFields([]);
    setFormKey((key) => key + 1);
  };

  return (
    <div className={styles["edit-character-form"]}>
      <Image
        src={dndLogo}
        alt=""
        width={72}
        className={styles["edit-character-form__logo"]}
        data-testid="edit-character-form-logo"
      />
      <ButtonWithIcon
        label={translate("form.importFromWiki", "combatTracker")}
        onClick={() => setIsWikiDialogOpened(true)}
        faIcon="book-open"
        faIconStyle={FaIconStyleEnum.SOLID}
        iconPosition="left"
        variant={ButtonVariant.SECONDARY}
        data-testid="import-from-wiki"
      />
      {importedFields && (
        <p
          className={styles["edit-character-form__import-summary"]}
          role="status"
          data-testid="imported-fields"
        >
          {importedFields.length
            ? translate("form.importedFields", "combatTracker", {
                fields: importedFields
                  .map((field) =>
                    translate(WIKI_FIELD_LABEL_KEYS[field], "combatTracker"),
                  )
                  .join(", "),
              })
            : translate("form.noImportedFields", "combatTracker")}
        </p>
      )}
      {isWikiDialogOpened && (
        <WikiCharacterDialog
          initialUrl={wikiUrlGuess}
          onClose={() => setIsWikiDialogOpened(false)}
          onImport={importFromWiki}
          displayOverrideFields={initialCharacter !== null}
        />
      )}
      <form
        key={formKey}
        className={styles["edit-character-form__form"]}
        onSubmit={handleSubmit}
      >
        <IdentityFieldset
          character={character}
          onInputChange={handleInputChange}
          onAttitudeChange={(attitude) => updateCharacter({ attitude })}
          importedClassName={importedClassName}
        />
        <CombatFieldset
          character={character}
          onInputChange={handleInputChange}
          importedClassName={importedClassName}
        />
        <SpellSlotsFieldset
          spellSlots={character?.spellSlotsLeft ?? {}}
          onChange={(spellSlotsLeft) =>
            updateCharacter({ spellSlotsLeft }, "spellSlotsLeft")
          }
          isHighlighted={highlightedFields.includes("spellSlotsLeft")}
        />
        <TextListFieldset
          title={translate("form.passives", "combatTracker")}
          titleIcon="book-open"
          inputId="passiveName"
          inputLabel={translate("form.passiveName", "combatTracker")}
          items={character?.passives ?? []}
          onChange={(passives) => updateCharacter({ passives }, "passives")}
          isHighlighted={highlightedFields.includes("passives")}
        />
        <ActionsFieldset
          actions={character?.actions ?? []}
          onChange={(actions) => updateCharacter({ actions }, "actions")}
          isHighlighted={highlightedFields.includes("actions")}
        />
        <TextListFieldset
          title={translate("form.usableObjects", "combatTracker")}
          titleIcon="bag-shopping"
          inputId="usableObjectName"
          inputLabel={translate("form.usableObjectName", "combatTracker")}
          items={character?.usableObjects ?? []}
          onChange={(usableObjects) => updateCharacter({ usableObjects })}
        />
        <StatesFieldset
          states={character?.states ?? []}
          onChange={(states) => updateCharacter({ states })}
          createId={createId}
        />
        <div className={styles["edit-character-form__footer"]}>
          {onSaveAndRestart && (
            <ButtonWithIcon
              label={translate("form.saveAndRestart", "combatTracker")}
              onClick={saveAndRestart}
              faIcon="refresh"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              data-testid="save-and-restart"
            />
          )}
          <SubmitButton label={translate("form.save", "combatTracker")} />
        </div>
      </form>
    </div>
  );
};

export default EditCharacterForm;
