"use client";

import { useState } from "react";
import CharacterList from "./_components/characters-list/CharacterList";
import styles from "./combat-tracker.module.scss";
import CharacterStats from "./_components/character-stats/CharacterStats";
import CustomDrawer from "../_components/drawer/CustomDrawer";
import ButtonWithIcon from "../_components/_basics/button-with-icon/ButtonWithIcon";
import { FaIconStyleEnum } from "../_lib/enums/fa-icon.style.enum";
import CharacterForm from "./_components/character-form/CharacterForm";
import { clearCombat, loadCombat, saveCombat } from "./_lib/local-storage";

export type CombatCharacter = {
  name: string;
  hp: number;
  maxHp: number;
  ac: number;
  initiativeScore: number;
  spellSlotsLefts?: Record<number, number>;
  states?: {
    name: string;
    numberOfTurns: number;
    saveThrowStat: string;
    saveThrowThreshold: number;
  }[];
};

export type Combat = {
  currentTurn: number;
  characters: CombatCharacter[];
}

const CombatTrackerPage = () => {
  const [combat, setCombat] = useState<Combat>(loadCombat());
  const [selectedCharacter, setSelectedCharacter] =
  useState<CombatCharacter | null>(null);
  const sortedCharacters = [...combat?.characters ?? []].sort(
    (a, b) => b.initiativeScore - a.initiativeScore,
  );
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);

  const handleCharacterClick = (character: CombatCharacter) => {
    setSelectedCharacter(character);
  };

  const handleAddCharacter = (character: CombatCharacter) => {
    const updatedCharacters = [...combat?.characters ?? [], character];
    setCombat({ ...combat, characters: updatedCharacters });
    saveCombat({ ...combat, characters: updatedCharacters });
    setIsDrawerOpened(false);
  }

  const resetCombat = () => {
    setCombat((prevCombat) => ({ ...prevCombat, currentTurn: 1 }));
    setSelectedCharacter(null);
  }

  return (
    <>
      <div className={styles["combat-tracker"]}>
        <h1>Tracker de Combat</h1>
        <div className={styles["combat-tracker__container"]}>
          <div>
            <ButtonWithIcon label="Commencer un combat" onClick={() => setIsDrawerOpened(true)} faIcon="play" faIconStyle={FaIconStyleEnum.SOLID} iconPosition="left"/>
            <ButtonWithIcon label="Ajouter un personnage" onClick={() => setIsDrawerOpened(true)} faIcon="plus" faIconStyle={FaIconStyleEnum.SOLID} iconPosition="left"/>
            <ButtonWithIcon label="Recommencer le combat" onClick={resetCombat} faIcon="refresh" faIconStyle={FaIconStyleEnum.SOLID} iconPosition="left"/>
          </div>
          <CharacterList
            characters={sortedCharacters}
            onClick={handleCharacterClick}
            selectedCharacter={selectedCharacter}
            className={styles["combat-tracker__container__left"]}
          />
          {selectedCharacter && (
            <div className={styles["combat-tracker__container__right"]}>
              <CharacterStats character={selectedCharacter} />
            </div>
          )}
        </div>
      </div>
      {selectedCharacter && (
        <CustomDrawer isOpened={isDrawerOpened} onClose={() => setIsDrawerOpened(false)}>
          <CharacterForm initialCharacter={selectedCharacter} onSubmit={handleAddCharacter} />
        </CustomDrawer>
      )}
      <CustomDrawer isOpened={isDrawerOpened} onClose={() => setIsDrawerOpened(false)}>
        <CharacterForm initialCharacter={selectedCharacter} onSubmit={handleAddCharacter} />
      </CustomDrawer>
    </>
  );
};

export default CombatTrackerPage;
