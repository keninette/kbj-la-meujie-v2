"use client";

import { useState } from "react";
import Image from "next/image";
import dndLogo from "@/public/assets/universes/dnd.png";
import styles from "./edit-character-form.module.scss";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import Fieldset from "@/app/_components/_basics/_form/_fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/_form/_text-input/TextInput";
import NumberInput from "@/app/_components/_basics/_form/_number-input/NumberInput";
import CheckboxInput from "@/app/_components/_basics/_form/_checkbox-input/CheckboxInput";
import SelectInput from "@/app/_components/_basics/_form/_select-input/SelectInput";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import SubmitButton from "@/app/_components/_basics/_form/_submit-button/SubmitButton";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { getMaxAlternativeHp } from "@/app/combat-tracker/_components/attack-form/attack-form.helper";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";
import { isDisplayableImageUrl } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.images";
import ActionsList from "@/app/combat-tracker/_components/actions-list/ActionsList";
import {
  isNpcAttitude,
  NpcAttitudeEnum,
} from "@/app/_lib/enums/npc-attitude.enum";
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
        ...(prevChar ?? createEmptyCharacter()),
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
          ...(prevChar ?? createEmptyCharacter()),
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
          ...(prevChar ?? createEmptyCharacter()),
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
          ...(prevChar ?? createEmptyCharacter()),
          passives: (prevChar?.passives ?? []).filter((_, i) => i !== index),
        }) as CombatCharacter,
    );
  };

  const addAction = () => {
    const trimmedName = actionName.trim();
    if (!trimmedName) {
      return;
    }

    clearHighlight("actions");
    setCharacter(
      (prevChar) =>
        ({
          ...(prevChar ?? createEmptyCharacter()),
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
          ...(prevChar ?? createEmptyCharacter()),
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
          ...(prevChar ?? createEmptyCharacter()),
          usableObjects: [...(prevChar?.usableObjects ?? []), trimmedName],
        }) as CombatCharacter,
    );
    setUsableObjectName("");
  };

  const removeUsableObject = (index: number) => {
    setCharacter(
      (prevChar) =>
        ({
          ...(prevChar ?? createEmptyCharacter()),
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
        />
      )}
      <form
        className={styles["edit-character-form__form"]}
        onSubmit={handleSubmit}
      >
        <Fieldset
          title={translate("form.basicInfo", "combatTracker")}
          titleIcon="id-card"
        >
          <TextInput
            id="name"
            name="name"
            label={translate("form.name", "combatTracker")}
            value={character?.name || ""}
            onChange={handleInputChange}
            className={importedClassName("name")}
            data-testid="name"
          />
          <TextInput
            id="shortDescription"
            name="shortDescription"
            label={translate("form.shortDescription", "combatTracker")}
            value={character?.shortDescription || ""}
            onChange={handleInputChange}
            className={importedClassName("shortDescription")}
            data-testid="shortDescription"
          />
          <TextInput
            type="url"
            id="wikiLink"
            name="wikiLink"
            label={translate("form.wikiLink", "combatTracker")}
            placeholder="https://bg3.wiki/wiki/Halsin"
            value={character?.wikiLink || ""}
            onChange={handleInputChange}
            className={importedClassName("wikiLink")}
            data-testid="wikiLink"
          />
          <TextInput
            type="url"
            id="imageUrl"
            name="imageUrl"
            label={translate("form.imageUrl", "combatTracker")}
            value={character?.imageUrl || ""}
            onChange={handleInputChange}
            className={importedClassName("imageUrl")}
            data-testid="imageUrl"
            adornment={
              // Not while the URL is being typed
              isDisplayableImageUrl(imageUrl) && (
                <CharacterPortrait
                  src={imageUrl}
                  alt={character?.name ?? ""}
                  width={40}
                  height={40}
                  className={styles["edit-character-form__picture"]}
                  data-testid="imageUrl-preview"
                />
              )
            }
          />
          <div className={styles["edit-character-form__row"]}>
            <CheckboxInput
              id="isNpc"
              name="isNpc"
              label={translate("form.npc", "combatTracker")}
              checked={character?.isNpc || false}
              onChange={handleInputChange}
            />
            {character?.isNpc && (
              <SelectInput
                id="attitude"
                name="attitude"
                label={translate("form.attitude", "combatTracker")}
                value={character.attitude ?? ""}
                onChange={(event) => {
                  const { value } = event.target;
                  setCharacter((prevChar) => ({
                    ...(prevChar ?? createEmptyCharacter()),
                    attitude: isNpcAttitude(value) ? value : undefined,
                  }));
                }}
                data-testid="attitude"
              >
                <option value="">
                  {translate("attitude.unknown", "combatTracker")}
                </option>
                {Object.values(NpcAttitudeEnum).map((attitude) => (
                  <option key={attitude} value={attitude}>
                    {translate(`attitude.${attitude}`, "combatTracker")}
                  </option>
                ))}
              </SelectInput>
            )}
          </div>
        </Fieldset>
        <Fieldset
          title={translate("form.combat", "combatTracker")}
          titleIcon="shield-halved"
        >
          <div className={styles["edit-character-form__grid"]}>
            <NumberInput
              id="hp"
              name="hp"
              label={translate("form.hp", "combatTracker")}
              value={character?.hp ?? 0}
              onChange={handleInputChange}
              className={importedClassName("hp")}
              data-testid="hp"
            />
            <NumberInput
              id="maxHp"
              name="maxHp"
              label={translate("form.maxHp", "combatTracker")}
              min="1"
              value={character?.maxHp ?? 0}
              onChange={handleInputChange}
              className={importedClassName("maxHp")}
              data-testid="maxHp"
            />
            <NumberInput
              id="tempHp"
              name="tempHp"
              label={translate("form.tempHp", "combatTracker")}
              value={character?.tempHp ?? 0}
              onChange={handleInputChange}
              data-testid="tempHp"
            />
            <NumberInput
              id="ac"
              name="ac"
              label={translate("form.ac", "combatTracker")}
              value={character?.ac ?? 0}
              onChange={handleInputChange}
              className={importedClassName("ac")}
              data-testid="ac"
            />
            <NumberInput
              id="initiativeScore"
              name="initiativeScore"
              label={translate("form.initiative", "combatTracker")}
              value={character?.initiativeScore ?? 0}
              onChange={handleInputChange}
              data-testid="initiativeScore"
            />
            <NumberInput
              id="alternativeHp"
              name="alternativeHp"
              label={translate("form.alternativeHp", "combatTracker")}
              value={character?.alternativeHp ?? 0}
              onChange={handleInputChange}
              data-testid="alternativeHp"
            />
            <NumberInput
              id="maxAlternativeHp"
              name="maxAlternativeHp"
              label={translate("form.maxAlternativeHp", "combatTracker")}
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
          {character?.isDying && (
            <div className={styles["edit-character-form__row"]}>
              <CheckboxInput
                id="isDead"
                name="isDead"
                label={translate("form.isDead", "combatTracker")}
                checked={character?.isDead || false}
                onChange={handleInputChange}
                data-testid="isDead"
              />
            </div>
          )}
        </Fieldset>
        <Fieldset
          title={translate("form.spellSlots", "combatTracker")}
          titleIcon="wand-sparkles"
          isHighlighted={highlightedFields.includes("spellSlotsLeft")}
        >
          <ul className={styles["edit-character-form__chips"]}>
            {Object.entries(character?.spellSlotsLeft ?? {}).map(
              ([name, slots]) => (
                <li key={name} className={styles["edit-character-form__chip"]}>
                  ✨ {name} : {slots}
                  <IconButton
                    variant={ButtonVariant.TERTIARY}
                    tooltip={translate("form.remove", "combatTracker")}
                    faIcon="xmark"
                    faIconStyle={FaIconStyleEnum.SOLID}
                    onClick={() => removeSpellSlot(name)}
                  />
                </li>
              ),
            )}
          </ul>
          <div className={styles["edit-character-form__row"]}>
            <TextInput
              id="slotLevel"
              name="slotLevel"
              label={translate("form.nameOrLevel", "combatTracker")}
              value={spellSlotName}
              onChange={(event) => setSpellSlotName(event.target.value)}
              data-testid="spellSlotName"
            />
            <NumberInput
              id="slotValue"
              name="slotValue"
              label={translate("form.value", "combatTracker")}
              min="0"
              step="1"
              value={spellSlotValue}
              onChange={(event) => setSpellSlotValue(+event.target.value)}
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
        </Fieldset>
        <Fieldset
          title={translate("form.passives", "combatTracker")}
          titleIcon="book-open"
          isHighlighted={highlightedFields.includes("passives")}
        >
          <ul className={styles["edit-character-form__chips"]}>
            {(character?.passives ?? []).map((passive, index) => (
              <li
                key={`${passive}-${index}`}
                className={styles["edit-character-form__chip"]}
                data-testid="passive-item"
              >
                {passive}
                <IconButton
                  variant={ButtonVariant.TERTIARY}
                  tooltip={translate("form.remove", "combatTracker")}
                  faIcon="xmark"
                  faIconStyle={FaIconStyleEnum.SOLID}
                  onClick={() => removePassive(index)}
                />
              </li>
            ))}
          </ul>
          <div className={styles["edit-character-form__row"]}>
            <TextInput
              id="passiveName"
              name="passiveName"
              label={translate("form.passiveName", "combatTracker")}
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
        </Fieldset>
        <Fieldset
          title={translate("form.actions", "combatTracker")}
          titleIcon="hand-fist"
          isHighlighted={highlightedFields.includes("actions")}
        >
          <ActionsList
            actions={character?.actions ?? []}
            onRemove={removeAction}
          />
          <div className={styles["edit-character-form__row"]}>
            <TextInput
              id="actionName"
              name="actionName"
              label={translate("form.actionName", "combatTracker")}
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
        </Fieldset>
        <Fieldset
          title={translate("form.usableObjects", "combatTracker")}
          titleIcon="bag-shopping"
        >
          <ul className={styles["edit-character-form__chips"]}>
            {(character?.usableObjects ?? []).map((usableObject, index) => (
              <li
                key={`${usableObject}-${index}`}
                className={styles["edit-character-form__chip"]}
                data-testid="usable-object-item"
              >
                {usableObject}
                <IconButton
                  variant={ButtonVariant.TERTIARY}
                  tooltip={translate("form.remove", "combatTracker")}
                  faIcon="xmark"
                  faIconStyle={FaIconStyleEnum.SOLID}
                  onClick={() => removeUsableObject(index)}
                />
              </li>
            ))}
          </ul>
          <div className={styles["edit-character-form__row"]}>
            <TextInput
              id="usableObjectName"
              name="usableObjectName"
              label={translate("form.usableObjectName", "combatTracker")}
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
        </Fieldset>
        <Fieldset
          title={translate("form.states", "combatTracker")}
          titleIcon="fire-flame-curved"
        />
        <div className={styles["edit-character-form__footer"]}>
          <ButtonWithIcon
            label={translate("form.saveAndRestart", "combatTracker")}
            onClick={() => {}}
            faIcon="refresh"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
          />
          <SubmitButton label={translate("form.save", "combatTracker")} />
        </div>
      </form>
    </div>
  );
};

export default EditCharacterForm;
