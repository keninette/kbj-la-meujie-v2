"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import dndLogo from "@/public/assets/universes/dnd.png";
import styles from "./edit-character-form.module.scss";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import SubmitButton from "@/app/_components/_basics/form/submit-button/SubmitButton";
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
  WikiImportedField,
} from "@/app/combat-tracker/_lib/bg3-wiki/merge-wiki-character";
import WikiCharacterDialog from "@/app/combat-tracker/_components/edit-character-form/_components/wiki-character-dialog/WikiCharacterDialog";
import IdentityFieldset from "./_components/IdentityFieldset";
import CombatFieldset from "./_components/CombatFieldset";
import AbilitiesFieldset from "./_components/AbilitiesFieldset";
import SpellSlotsFieldset from "./_components/SpellSlotsFieldset";
import TextListFieldset from "./_components/TextListFieldset";
import ActionsFieldset from "./_components/ActionsFieldset";
import StatesFieldset from "./_components/StatesFieldset";
import { createId } from "@/app/combat-tracker/_lib/create-id";
import { getInitiativeBonus } from "@/app/combat-tracker/_lib/ability.helper";
import InitiativeReminderDialog from "./_components/initiative-reminder-dialog/InitiativeReminderDialog";

type EditCharacterFormProps = {
  initialCharacter: CombatCharacter | null;
  onSubmit?: (character: CombatCharacter) => void;
  /** Saves the character, and keeps the form open and empty for the next
   * one. The "save and restart" button is shown only when this is given. */
  onSaveAndRestart?: (character: CombatCharacter) => void;
  currentTurn?: number;
};

type SaveKind = "submit" | "restart";

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
  initiativeRoll: 0,
});

const EditCharacterForm = ({
  initialCharacter,
  onSubmit,
  onSaveAndRestart,
  currentTurn,
}: EditCharacterFormProps) => {
  const [character, setCharacter] = useState<CombatCharacter | null>(
    initialCharacter,
  );
  const [isWikiDialogOpened, setIsWikiDialogOpened] = useState(false);
  // Changed to remount the fieldsets, which clears their unsaved inputs
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
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

    let formattedValue: string | number | boolean | undefined = value;
    switch (name) {
      case "name":
      case "shortDescription":
      case "wikiLink":
      case "imageUrl":
        formattedValue = value;
        break;
      case "movement":
      case "proficiencyBonus":
        formattedValue = value === "" ? undefined : +value;
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

  // Replaces the given fields, and the highlight of the imported field they belong to, if any
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

  const initiativeRoll = character?.initiativeRoll ?? 0;
  const initiativeBonus = getInitiativeBonus(character);

  // The save waiting for the initiative reminder to be answered
  const [pendingSave, setPendingSave] = useState<SaveKind | null>(null);

  // Asks first when there is no initiative roll (a d20 never rolls 0),
  // unless the reminder was already answered
  const save = (kind: SaveKind, skipReminder = false) => {
    if (!character) {
      return;
    }
    if (!initiativeRoll && !skipReminder) {
      setPendingSave(kind);
      return;
    }

    const savedCharacter: CombatCharacter = {
      ...character,
      id: character.id || createId(),
      maxAlternativeHp: getMaxAlternativeHp(character),
      wikiLink: character.wikiLink?.trim() || undefined,
      imageUrl: imageUrl || undefined,
      initiativeRoll,
      initiativeScore: initiativeRoll + (initiativeBonus ?? 0),
    };

    if (kind === "submit") {
      onSubmit?.(savedCharacter);
      return;
    }
    onSaveAndRestart?.(savedCharacter);
    setCharacter(null);
    setImportedFields(null);
    setHighlightedFields([]);
    setFormKey((key) => key + 1);
  };

  const confirmPendingSave = () => {
    if (pendingSave) {
      save(pendingSave, true);
    }
    setPendingSave(null);
  };

  const backToInitiativeRoll = () => {
    setPendingSave(null);
    // After the dialog gave the focus back to the save button
    setTimeout(() =>
      formRef.current
        ?.querySelector<HTMLInputElement>("#initiativeRoll")
        ?.focus(),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save("submit");
  };

  const saveAndRestart = () => {
    if (!formRef.current?.reportValidity()) {
      return;
    }
    save("restart");
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
      <InitiativeReminderDialog
        isOpened={pendingSave !== null}
        onBack={backToInitiativeRoll}
        onConfirm={confirmPendingSave}
      />
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
        ref={formRef}
        className={styles["edit-character-form__form"]}
        onSubmit={handleSubmit}
      >
        {/* Only this part scrolls: the drawer title and the buttons stay visible */}
        <div className={styles["edit-character-form__body"]}>
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
                ? translate("form.importedFields", "combatTracker")
                : translate("form.noImportedFields", "combatTracker")}
            </p>
          )}
          <IdentityFieldset
            character={character}
            onInputChange={handleInputChange}
            imageUrl={imageUrl}
            onAttitudeChange={(attitude) => updateCharacter({ attitude })}
            importedClassName={importedClassName}
          />
          <CombatFieldset
            character={character}
            initiativeRoll={initiativeRoll}
            onInputChange={handleInputChange}
            importedClassName={importedClassName}
          />
          <AbilitiesFieldset
            abilities={character?.abilities}
            savingThrows={character?.savingThrows}
            onChange={(changes) => {
              clearHighlight("abilities");
              clearHighlight("savingThrows");
              updateCharacter(changes);
            }}
            isHighlighted={
              highlightedFields.includes("abilities") ||
              highlightedFields.includes("savingThrows")
            }
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
            titleIcon="flask"
            inputId="usableObjectName"
            inputLabel={translate("form.usableObjectName", "combatTracker")}
            items={character?.usableObjects ?? []}
            onChange={(usableObjects) => updateCharacter({ usableObjects })}
          />
          <StatesFieldset
            states={character?.states ?? []}
            onChange={(states) => updateCharacter({ states })}
            currentTurn={currentTurn}
          />
        </div>
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
