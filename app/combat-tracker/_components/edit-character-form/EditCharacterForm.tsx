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

type EditCharacterFormProps = {
  initialCharacter: CombatCharacter | null;
  onSubmit?: (character: CombatCharacter) => void;
};

const createCharacterId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `character-${Date.now()}-${Math.random().toString(16).slice(2)}`;

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
  const [usableObjectName, setUsableObjectName] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Format value
    let formattedValue: string | number | boolean = value;
    switch (name) {
      case "name":
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
          ...(prevCharacter ?? {
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
          }),
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
    setCharacter(
      (prevChar) =>
        ({
          ...prevChar,
          passives: (prevChar?.passives ?? []).filter((_, i) => i !== index),
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
    });
  };

  return (
    <div className={styles["edit-character-form"]}>
      <h2>{translate("form.addCharacter", "combatTracker")}</h2>
      <form onSubmit={handleSubmit}>
        <fieldset className={styles["edit-character-form__fieldset"]}>
          <h3>{translate("form.basicInfo", "combatTracker")}</h3>
          <div className={styles["edit-character-form__line"]}>
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
          <div className={styles["edit-character-form__line"]}>
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
          <div className={styles["edit-character-form__line"]}>
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
          <div className={styles["edit-character-form__line"]}>
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
        <fieldset className={styles["edit-character-form__fieldset"]}>
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
        <fieldset className={styles["edit-character-form__fieldset"]}>
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
