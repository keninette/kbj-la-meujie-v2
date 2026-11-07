"use client";

import { useState } from "react";
import styles from "./edit-character-form.module.scss";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import SubmitButton from "@/app/_components/_basics/submit-button/SubmitButton";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { getMaxAlternativeHp } from "@/app/combat-tracker/_components/attack-form/attack-form.helper";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";
import { isDisplayableImageUrl } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.images";
import ActionsList from "@/app/combat-tracker/_components/actions-list/ActionsList";
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
import WikiCharacterDialog from "@/app/combat-tracker/_components/wiki-character-dialog/WikiCharacterDialog";

type EditCharacterFormProps = {
  initialCharacter: CombatCharacter | null;
  onSubmit?: (character: CombatCharacter) => void;
};

const createCharacterId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `character-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createEmptyCharacter = (): CombatCharacter => ({
  id: createCharacterId(),
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
}: EditCharacterFormProps) => {
  const [character, setCharacter] = useState<CombatCharacter | null>(
    initialCharacter,
  );
  const [spellSlotName, setSpellSlotName] = useState("");
  const [spellSlotValue, setSpellSlotValue] = useState(0);
  const [passiveName, setPassiveName] = useState("");
  const [actionName, setActionName] = useState("");
  const [usableObjectName, setUsableObjectName] = useState("");
  const [isWikiDialogOpened, setIsWikiDialogOpened] = useState(false);
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

  // "edit-character-form__line" + "--imported" modifier while highlighted
  const importedClassName = (
    element: "line" | "fieldset",
    field: WikiImportedField,
  ) => {
    const base = `edit-character-form__${element}`;
    return [
      styles[base],
      highlightedFields.includes(field) ? styles[`${base}--imported`] : "",
    ].join(" ");
  };
  const lineClassName = (field: WikiImportedField) =>
    importedClassName("line", field);

  // Only fills the form: nothing is saved until the form is submitted
  const importFromWiki = (
    fetched: WikiCharacter,
    overrideFields: WikiImportedField[],
  ) => {
    const current = character ?? createEmptyCharacter();
    const merged = mergeWikiCharacter(current, fetched, overrideFields);
    const updatedFields = listUpdatedFields(current, merged);

    // A new character imported from the wiki is an NPC. An existing
    // character keeps its NPC status (still editable with the checkbox).
    setCharacter(
      initialCharacter === null ? { ...merged, isNpc: true } : merged,
    );
    setImportedFields(updatedFields);
    setHighlightedFields(updatedFields);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    clearHighlight(name);

    // Format value
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

  const addSpellSlot = () => {
    const trimmedName = spellSlotName.trim();
    if (
      !trimmedName ||
      !Number.isInteger(spellSlotValue) ||
      spellSlotValue < 0
    ) {
      return;
    }

    clearHighlight("spellSlotsLeft");
    setCharacter((prevChar) => {
      const spellSlotsLeft = { ...(prevChar?.spellSlotsLeft ?? {}) };
      spellSlotsLeft[trimmedName] = spellSlotValue;

      return {
        ...prevChar,
        spellSlotsLeft,
      } as CombatCharacter;
    });

    setSpellSlotName("");
    setSpellSlotValue(0);
  };

  const removeSpellSlot = (name: string) => {
    clearHighlight("spellSlotsLeft");
    const spellSlotsLefts = { ...(character?.spellSlotsLeft ?? {}) };
    delete spellSlotsLefts[name];
    setCharacter(
      (prevChar) =>
        ({
          ...prevChar,
          spellSlotsLeft: spellSlotsLefts,
        }) as CombatCharacter,
    );
  };

  const addPassive = () => {
    const trimmedName = passiveName.trim();
    if (!trimmedName) {
      return;
    }

    clearHighlight("passives");
    setCharacter(
      (prevChar) =>
        ({
          ...prevChar,
          passives: [...(prevChar?.passives ?? []), trimmedName],
        }) as CombatCharacter,
    );
    setPassiveName("");
  };

  const removePassive = (index: number) => {
    clearHighlight("passives");
    setCharacter(
      (prevChar) =>
        ({
          ...prevChar,
          passives: (prevChar?.passives ?? []).filter((_, i) => i !== index),
        }) as CombatCharacter,
    );
  };

  // Added by hand: only the name, details come from a wiki import
  const addAction = () => {
    const trimmedName = actionName.trim();
    if (!trimmedName) {
      return;
    }

    clearHighlight("actions");
    setCharacter(
      (prevChar) =>
        ({
          ...prevChar,
          actions: [
            ...(prevChar?.actions ?? []),
            { name: trimmedName, costs: [] },
          ],
        }) as CombatCharacter,
    );
    setActionName("");
  };

  const removeAction = (index: number) => {
    clearHighlight("actions");
    setCharacter(
      (prevChar) =>
        ({
          ...prevChar,
          actions: (prevChar?.actions ?? []).filter((_, i) => i !== index),
        }) as CombatCharacter,
    );
  };

  const addUsableObject = () => {
    const trimmedName = usableObjectName.trim();
    if (!trimmedName) {
      return;
    }

    setCharacter(
      (prevChar) =>
        ({
          ...prevChar,
          usableObjects: [...(prevChar?.usableObjects ?? []), trimmedName],
        }) as CombatCharacter,
    );
    setUsableObjectName("");
  };

  const removeUsableObject = (index: number) => {
    setCharacter(
      (prevChar) =>
        ({
          ...prevChar,
          usableObjects: (prevChar?.usableObjects ?? []).filter(
            (_, i) => i !== index,
          ),
        }) as CombatCharacter,
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!character) {
      return;
    }

    onSubmit?.({
      ...character,
      id: character.id || createCharacterId(),
      maxAlternativeHp: getMaxAlternativeHp(character),
      // A cleared field means "no link" / "no picture"
      wikiLink: character.wikiLink?.trim() || undefined,
      imageUrl: imageUrl || undefined,
    });
  };

  return (
    <div className={styles["edit-character-form"]}>
      <h2>{translate("form.addCharacter", "combatTracker")}</h2>
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
      {/* Mounted on open so the URL is pre-filled with the current values */}
      {isWikiDialogOpened && (
        <WikiCharacterDialog
          initialUrl={wikiUrlGuess}
          onClose={() => setIsWikiDialogOpened(false)}
          onImport={importFromWiki}
        />
      )}
      <form onSubmit={handleSubmit}>
        <fieldset className={styles["edit-character-form__fieldset"]}>
          <h3>{translate("form.basicInfo", "combatTracker")}</h3>
          <div className={lineClassName("name")}>
            <label htmlFor="name">
              {translate("form.name", "combatTracker")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={character?.name || ""}
              onChange={handleInputChange}
              data-testid="name"
            />
          </div>
          <div className={lineClassName("shortDescription")}>
            <label htmlFor="shortDescription">
              {translate("form.shortDescription", "combatTracker")}
            </label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={character?.shortDescription || ""}
              onChange={handleInputChange}
              data-testid="shortDescription"
            />
          </div>
          <div className={lineClassName("wikiLink")}>
            <label htmlFor="wikiLink">
              {translate("form.wikiLink", "combatTracker")}
            </label>
            <input
              type="url"
              id="wikiLink"
              name="wikiLink"
              placeholder="https://bg3.wiki/wiki/Halsin"
              value={character?.wikiLink || ""}
              onChange={handleInputChange}
              data-testid="wikiLink"
            />
          </div>
          <div className={lineClassName("imageUrl")}>
            <label htmlFor="imageUrl">
              {translate("form.imageUrl", "combatTracker")}
            </label>
            <div className={styles["edit-character-form__picture-field"]}>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={character?.imageUrl || ""}
                onChange={handleInputChange}
                data-testid="imageUrl"
              />
              {/* Not while the URL is being typed */}
              {isDisplayableImageUrl(imageUrl) && (
                <CharacterPortrait
                  src={imageUrl}
                  alt={character?.name ?? ""}
                  width={40}
                  height={40}
                  className={styles["edit-character-form__picture"]}
                  data-testid="imageUrl-preview"
                />
              )}
            </div>
          </div>
          <div className={styles["edit-character-form__line"]}>
            <label htmlFor="isNpc">
              {translate("form.npc", "combatTracker")}
            </label>
            <input
              type="checkbox"
              id="isNpc"
              name="isNpc"
              checked={character?.isNpc || false}
              onChange={handleInputChange}
            />
          </div>
          <div className={lineClassName("hp")}>
            <label htmlFor="hp">{translate("form.hp", "combatTracker")}</label>
            <input
              type="number"
              id="hp"
              name="hp"
              value={character?.hp ?? 0}
              onChange={handleInputChange}
              data-testid="hp"
            />
          </div>
          {character?.isDying && (
            <div className={styles["edit-character-form__line"]}>
              <label htmlFor="isDead">
                {translate("form.isDead", "combatTracker")}
              </label>
              <input
                type="checkbox"
                id="isDead"
                name="isDead"
                checked={character?.isDead || false}
                onChange={handleInputChange}
                data-testid="isDead"
              />
            </div>
          )}
          <div className={lineClassName("maxHp")}>
            <label htmlFor="maxHp">
              {translate("form.maxHp", "combatTracker")}
            </label>
            <input
              type="number"
              id="maxHp"
              name="maxHp"
              min="1"
              value={character?.maxHp ?? 0}
              onChange={handleInputChange}
              data-testid="maxHp"
            />
          </div>
          <div className={styles["edit-character-form__line"]}>
            <label htmlFor="alternativeHp">
              {translate("form.alternativeHp", "combatTracker")}
            </label>
            <input
              type="number"
              id="alternativeHp"
              name="alternativeHp"
              value={character?.alternativeHp ?? 0}
              onChange={handleInputChange}
              data-testid="alternativeHp"
            />
          </div>
          <div className={styles["edit-character-form__line"]}>
            <label htmlFor="maxAlternativeHp">
              {translate("form.maxAlternativeHp", "combatTracker")}
            </label>
            <input
              type="number"
              id="maxAlternativeHp"
              name="maxAlternativeHp"
              value={character?.maxAlternativeHp || ""}
              placeholder={
                character?.alternativeHp
                  ? String(character.alternativeHp)
                  : undefined
              }
              onChange={handleInputChange}
              data-testid="maxAlternativeHp"
            />
          </div>
          <div className={styles["edit-character-form__line"]}>
            <label htmlFor="tempHp">
              {translate("form.tempHp", "combatTracker")}
            </label>
            <input
              type="number"
              id="tempHp"
              name="tempHp"
              value={character?.tempHp ?? 0}
              onChange={handleInputChange}
              data-testid="tempHp"
            />
          </div>
          <div className={lineClassName("ac")}>
            <label htmlFor="ac">{translate("form.ac", "combatTracker")}</label>
            <input
              type="number"
              id="ac"
              name="ac"
              value={character?.ac ?? 0}
              onChange={handleInputChange}
              data-testid="ac"
            />
          </div>
          <div className={styles["edit-character-form__line"]}>
            <label htmlFor="initiativeScore">
              {translate("form.initiative", "combatTracker")}
            </label>
            <input
              type="number"
              id="initiativeScore"
              name="initiativeScore"
              value={character?.initiativeScore ?? 0}
              onChange={handleInputChange}
              data-testid="initiativeScore"
            />
          </div>
        </fieldset>
        <fieldset className={importedClassName("fieldset", "spellSlotsLeft")}>
          <h3>{translate("form.spellSlots", "combatTracker")}</h3>
          <div className={styles["edit-character-form__line"]}>
            <label htmlFor="slotLevel">
              {translate("form.nameOrLevel", "combatTracker")}
            </label>
            <input
              type="text"
              id="slotLevel"
              name="slotLevel"
              value={spellSlotName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSpellSlotName(event.target.value)
              }
              data-testid="spellSlotName"
            />
            <label htmlFor="slotValue">
              {translate("form.value", "combatTracker")}
            </label>
            <input
              type="number"
              id="slotValue"
              name="slotValue"
              min="0"
              step="1"
              value={spellSlotValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSpellSlotValue(+event.target.value)
              }
            />
            <ButtonWithIcon
              variant={ButtonVariant.SECONDARY}
              label={translate("form.add", "combatTracker")}
              faIcon="plus"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              type="button"
              onClick={addSpellSlot}
            />
          </div>
          <div className={styles["edit-character-form__line"]}>
            {Object.entries(character?.spellSlotsLeft ?? {}).map(
              ([name, slots]) => (
                <div key={name} className={styles["edit-character-form__line"]}>
                  ✨ {name} : <span>{slots}</span>
                  <ButtonWithIcon
                    variant={ButtonVariant.SECONDARY}
                    label={translate("form.remove", "combatTracker")}
                    faIcon="xmark"
                    faIconStyle={FaIconStyleEnum.SOLID}
                    iconPosition="left"
                    type="button"
                    onClick={() => removeSpellSlot(name)}
                  />
                </div>
              ),
            )}
          </div>
        </fieldset>
        <fieldset className={importedClassName("fieldset", "passives")}>
          <h3>{translate("form.passives", "combatTracker")}</h3>
          <div className={styles["edit-character-form__line"]}>
            <label htmlFor="passiveName">
              {translate("form.passiveName", "combatTracker")}
            </label>
            <input
              type="text"
              id="passiveName"
              name="passiveName"
              value={passiveName}
              onChange={(event) => setPassiveName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addPassive();
                }
              }}
              data-testid="passiveName"
            />
            <ButtonWithIcon
              variant={ButtonVariant.SECONDARY}
              label={translate("form.add", "combatTracker")}
              faIcon="plus"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              type="button"
              onClick={addPassive}
              data-testid="addPassive"
            />
          </div>
          <div className={styles["edit-character-form__line"]}>
            {(character?.passives ?? []).map((passive, index) => (
              <div
                key={`${passive}-${index}`}
                className={styles["edit-character-form__line"]}
                data-testid="passive-item"
              >
                ⚫ <span>{passive}</span>
                <ButtonWithIcon
                  variant={ButtonVariant.SECONDARY}
                  label={translate("form.remove", "combatTracker")}
                  faIcon="xmark"
                  faIconStyle={FaIconStyleEnum.SOLID}
                  iconPosition="left"
                  type="button"
                  onClick={() => removePassive(index)}
                />
              </div>
            ))}
          </div>
        </fieldset>
        <fieldset className={importedClassName("fieldset", "actions")}>
          <h3>{translate("form.actions", "combatTracker")}</h3>
          <div className={styles["edit-character-form__line"]}>
            <label htmlFor="actionName">
              {translate("form.actionName", "combatTracker")}
            </label>
            <input
              type="text"
              id="actionName"
              name="actionName"
              value={actionName}
              onChange={(event) => setActionName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addAction();
                }
              }}
              data-testid="actionName"
            />
            <ButtonWithIcon
              variant={ButtonVariant.SECONDARY}
              label={translate("form.add", "combatTracker")}
              faIcon="plus"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              type="button"
              onClick={addAction}
              data-testid="addAction"
            />
          </div>
          <ActionsList
            actions={character?.actions ?? []}
            onRemove={removeAction}
          />
        </fieldset>
        <fieldset className={styles["edit-character-form__fieldset"]}>
          <h3>{translate("form.usableObjects", "combatTracker")}</h3>
          <div className={styles["edit-character-form__line"]}>
            <label htmlFor="usableObjectName">
              {translate("form.usableObjectName", "combatTracker")}
            </label>
            <input
              type="text"
              id="usableObjectName"
              name="usableObjectName"
              value={usableObjectName}
              onChange={(event) => setUsableObjectName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addUsableObject();
                }
              }}
              data-testid="usableObjectName"
            />
            <ButtonWithIcon
              variant={ButtonVariant.SECONDARY}
              label={translate("form.add", "combatTracker")}
              faIcon="plus"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              type="button"
              onClick={addUsableObject}
              data-testid="addUsableObject"
            />
          </div>
          <div className={styles["edit-character-form__line"]}>
            {(character?.usableObjects ?? []).map((usableObject, index) => (
              <div
                key={`${usableObject}-${index}`}
                className={styles["edit-character-form__line"]}
                data-testid="usable-object-item"
              >
                ⚫ <span>{usableObject}</span>
                <ButtonWithIcon
                  variant={ButtonVariant.SECONDARY}
                  label={translate("form.remove", "combatTracker")}
                  faIcon="xmark"
                  faIconStyle={FaIconStyleEnum.SOLID}
                  iconPosition="left"
                  type="button"
                  onClick={() => removeUsableObject(index)}
                />
              </div>
            ))}
          </div>
        </fieldset>
        <fieldset className={styles["edit-character-form__fieldset"]}>
          <h3>{translate("form.states", "combatTracker")}</h3>
        </fieldset>
        <fieldset className={styles["edit-character-form__fieldset"]}>
          <SubmitButton label={translate("form.save", "combatTracker")} />
          <ButtonWithIcon
            label={translate("form.saveAndRestart", "combatTracker")}
            onClick={() => {}}
            faIcon="refresh"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
          />
        </fieldset>
      </form>
    </div>
  );
};

export default EditCharacterForm;
