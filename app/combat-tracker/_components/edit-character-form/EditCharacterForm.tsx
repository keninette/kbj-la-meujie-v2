"use client";

import { useState } from "react";
import styles from "./edit-character-form.module.scss";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import SubmitButton from "@/app/_components/_basics/submit-button/SubmitButton";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { translate } from "@/app/_dictionaries/dictionnary";

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
  const [spellSlotLevel, setSpellSlotLevel] = useState(0);
  const [spellSlotValue, setSpellSlotValue] = useState(0);

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
    if (
      !Number.isInteger(spellSlotLevel) ||
      !Number.isInteger(spellSlotValue) ||
      spellSlotLevel < 0 ||
      spellSlotValue < 0
    ) {
      return;
    }

    setCharacter((prevChar) => {
      const spellSlotsLeft = { ...(prevChar?.spellSlotsLeft ?? {}) };
      spellSlotsLeft[spellSlotLevel] = spellSlotValue;

      return {
        ...prevChar,
        spellSlotsLeft,
      } as CombatCharacter;
    });

    setSpellSlotLevel(0);
    setSpellSlotValue(0);
  };

  const removeSpellSlot = (level: number) => {
    const spellSlotsLefts = { ...(character?.spellSlotsLeft ?? {}) };
    delete spellSlotsLefts[level];
    setCharacter(
      (prevChar) =>
        ({
          ...prevChar,
          spellSlotsLeft: spellSlotsLefts,
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
    });
  };

  // todo spell slot level peut = 0
  // todo ajouter sort de classe/rage/...
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
            />
          </div>
        </fieldset>
        <fieldset className={styles["edit-character-form__fieldset"]}>
          <h3>{translate("form.spellSlots", "combatTracker")}</h3>
          <div className={styles["edit-character-form__line"]}>
            <label htmlFor="slotLevel">
              {translate("form.level", "combatTracker")}
            </label>
            <input
              type="number"
              name="slotLevel"
              min="0"
              step="1"
              value={spellSlotLevel}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSpellSlotLevel(+event.target.value)
              }
            />
            <label htmlFor="slotValue">
              {translate("form.value", "combatTracker")}
            </label>
            <input
              type="number"
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
              ([level, slots]) => (
                <div
                  key={level}
                  className={styles["edit-character-form__line"]}
                >
                  🔹 niv. {level} : <span>{slots}</span>
                  <ButtonWithIcon
                    variant={ButtonVariant.SECONDARY}
                    label={translate("form.remove", "combatTracker")}
                    faIcon="xmark"
                    faIconStyle={FaIconStyleEnum.SOLID}
                    iconPosition="left"
                    type="button"
                    onClick={() => removeSpellSlot(Number(level))}
                  />
                </div>
              ),
            )}
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
