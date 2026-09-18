"use client";

import { useState } from "react";
import styles from "./character-form.module.scss";
import { CombatCharacter } from "../../page";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import SubmitButton from "@/app/_components/_basics/submit-button/SubmitButton";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";

type CharacterFormProps = {
  initialCharacter: CombatCharacter | null;
  onSubmit?: (character: CombatCharacter) => void;
};

const CharacterForm = ({ initialCharacter, onSubmit }: CharacterFormProps) => {
  const [character, setCharacter] = useState<CombatCharacter | null>(
    initialCharacter,
  );
  const [spellSlotLevel, setSpellSlotLevel] = useState(0);
  const [spellSlotValue, setSpellSlotValue] = useState(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Format value
    let formattedValue: string | number = value;
    switch (name) {
      case "name":
        formattedValue = value;
        break;
      default:
        formattedValue = +value;
    }

    setCharacter(
      (prevCharacter) =>
        ({
          ...(prevCharacter ?? {
            name: "",
            hp: 0,
            maxHp: 0,
            isDying: false,
            isDead: false,
            deathSaveThrowsLeft: 3,
            ac: 0,
            initiativeScore: 0,
          }),
          [name]: formattedValue,
        }) as CombatCharacter,
    );
  };

  const addSpellSlot = () => {
    if (!spellSlotLevel || !spellSlotValue) {
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
    const spellSlotsLefts = character?.spellSlotsLeft ?? {};
    delete spellSlotsLefts[level];
    setCharacter(
      (prevChar) =>
        ({
          ...prevChar,
          spellSlotsLeft: spellSlotsLefts,
        }) as CombatCharacter,
    );
  };

  console.log("character", character);

  const handleSubmit = () => {
    onSubmit?.(character as CombatCharacter);
  };

  return (
    <div className={styles["character-form"]}>
      <h2>Ajouter un personnage</h2>
      <form onSubmit={handleSubmit}>
        <fieldset className={styles["character-form__fieldset"]}>
          <h3>Informations de base</h3>
          <div className={styles["character-form__line"]}>
            <label htmlFor="name">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              value={character?.name || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles["character-form__line"]}>
            <label htmlFor="hp">PV</label>
            <input
              type="number"
              id="hp"
              name="hp"
              value={character?.hp ?? 0}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles["character-form__line"]}>
            <label htmlFor="maxHp">PV max</label>
            <input
              type="number"
              id="maxHp"
              name="maxHp"
              min="1"
              value={character?.maxHp ?? 0}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles["character-form__line"]}>
            <label htmlFor="maxHp">PV alternatifs</label>
            <input
              type="number"
              id="alternativeHp"
              name="alternativeHp"
              value={character?.alternativeHp ?? 0}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles["character-form__line"]}>
            <label htmlFor="ac">CA</label>
            <input
              type="number"
              id="ac"
              name="ac"
              value={character?.ac ?? 0}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles["character-form__line"]}>
            <label htmlFor="initiative">Initiative</label>
            <input
              type="number"
              id="initiativeScore"
              name="initiativeScore"
              value={character?.initiativeScore ?? 0}
              onChange={handleInputChange}
            />
          </div>
        </fieldset>
        <fieldset className={styles["character-form__fieldset"]}>
          <h3>Emplacements de sorts</h3>
          <div className={styles["character-form__line"]}>
            <label htmlFor="slotLevel">Level</label>
            <input
              type="number"
              name="slotLevel"
              value={spellSlotLevel}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSpellSlotLevel(+event.target.value)
              }
            />
            <label htmlFor="slotValue">Valeur</label>
            <input
              type="number"
              name="slotValue"
              value={spellSlotValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSpellSlotValue(+event.target.value)
              }
            />
            <ButtonWithIcon
              variant={ButtonVariant.SECONDARY}
              label="Ajouter"
              faIcon="plus"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              type="button"
              onClick={addSpellSlot}
            />
          </div>
          <div className={styles["character-form__line"]}>
            {Object.entries(character?.spellSlotsLeft ?? {}).map(
              ([level, slots]) => (
                <div key={level} className={styles["character-form__line"]}>
                  🔹 niv. {level} : <span>{slots}</span>
                  <ButtonWithIcon
                    variant={ButtonVariant.SECONDARY}
                    label="Supprimer"
                    faIcon="xmark"
                    faIconStyle={FaIconStyleEnum.SOLID}
                    iconPosition="left"
                    type="button"
                    onClick={() => removeSpellSlot(level)}
                  />
                </div>
              ),
            )}
          </div>
        </fieldset>
        <fieldset className={styles["character-form__fieldset"]}>
          <h3>États</h3>
        </fieldset>
        <fieldset className={styles["character-form__fieldset"]}>
          <SubmitButton label="Enregistrer" />
          <ButtonWithIcon
            label="Enregistrer et recommencer"
            onClick={() => console.log("Personnage enregistré")}
            faIcon="refresh"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
          />
        </fieldset>
      </form>
    </div>
  );
};

export default CharacterForm;
