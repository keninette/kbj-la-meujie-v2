"use client";

import { useEffect, useState } from "react";
import CharacterList from "./_components/characters-list/CharacterList";
import styles from "./combat-tracker.module.scss";
import CharacterStats from "./_components/character-stats/CharacterStats";
import CustomDrawer from "../_components/drawer/CustomDrawer";
import CharacterForm from "./_components/character-form/CharacterForm";
import { clearCombat, loadCombat, saveCombat } from "./_lib/local-storage";
import CombatManager from "./_components/combat-manager/CombatManager";

// Since its only a prototype combat tracker and that it has yet to be included in adventures
// All libs & models are stored here
// This will change when combat tracker is embedded inside adventures
export type CombatCharacter = {
  name: string;
  hp: number;
  maxHp: number;
  alternativeHp?: number;
  isDying: boolean;
  isDead: boolean;
  deathSaveThrowsLeft: number;
  ac: number;
  initiativeScore: number;
  spellSlotsLeft?: Record<number, number>;
  states?: {
    name: string;
    numberOfTurns?: number;
    saveThrowStat?: string;
    saveThrowDc?: number;
  }[];
};

export enum CombatStatusEnum {
  PREPARING = "preparing",
  ONGOING = "ongoing",
}

export type CombatHistoryEntry = {
  turn: number;
  action: string;
};

export type Combat = {
  status: CombatStatusEnum;
  currentTurn: number;
  selectedCharacterIndex: number;
  characters: CombatCharacter[];
  history: CombatHistoryEntry[];
};

export const findCharacterIndexByName = (
  characters: CombatCharacter[],
  name: string,
) => {
  const existingCharacterIndex = characters?.findIndex(
    (char) => char.name === name,
  );

  return existingCharacterIndex;
};

const CombatTrackerPage = () => {
  const [combat, setCombat] = useState<Combat | null>(loadCombat());
  const [selectedCharacter, setSelectedCharacter] =
    useState<CombatCharacter | null>(null);
  const [characterToEdit, setCharacterToEdit] =
    useState<CombatCharacter | null>(null);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const sortCharacters = (characters: CombatCharacter[]) => {
    return characters.sort((a, b) => b.initiativeScore - a.initiativeScore);
  };

  const sortedCharacters = sortCharacters(combat?.characters ?? []);

  const onCombatChange = (combat: Combat | null) => {
    setCombat(combat);
  };

  const handleCharacterClick = (character: CombatCharacter) => {
    setIsDrawerOpened(true);
    setCharacterToEdit(character);
  };

  const onCharacterAdded = (character: CombatCharacter) => {
    const updatedCharacters = [...(combat?.characters ?? []), character];
    setCombat({ ...combat, characters: updatedCharacters });
    setIsDrawerOpened(false);
  };

  const onCharacterEdited = (character: CombatCharacter) => {
    const existingCharacterIndex = findCharacterIndexByName(
      combat?.characters ?? [],
      character.name,
    );

    if (existingCharacterIndex === -1) {
      console.log("error, character not found", character);
      return;
    }

    const updatedCharacters = [...(combat?.characters ?? [])];
    updatedCharacters[existingCharacterIndex] = character;

    setCombat({ ...combat, characters: updatedCharacters });
    setIsDrawerOpened(false);
  };

  const onHistoryEdited = (historyEntries: string[]) => {
    setCombat((prev) => {
      return {
        ...prev,
        history: [
          ...(prev?.history ?? []),
          ...historyEntries.map((entry) => ({
            turn: combat!.currentTurn,
            action: entry,
          })),
        ],
      };
    });
  };

  useEffect(() => {
    if (combat && combat !== null) {
      const sortedCharacters = sortCharacters(combat?.characters ?? []);
      saveCombat({ ...combat, characters: sortedCharacters });
      setSelectedCharacter(
        combat?.characters?.[combat?.selectedCharacterIndex],
      );
    } else {
      clearCombat();
      setSelectedCharacter(null);
      setCharacterToEdit(null);
    }
  }, [combat]);

  console.log(combat, selectedCharacter, combat?.selectedCharacterIndex);
  return (
    <>
      <div className={styles["combat-tracker"]}>
        <h1>Tracker de Combat</h1>
        <CombatManager
          ongoingCombat={combat}
          onCombatChange={onCombatChange}
          onCharacterAdded={onCharacterAdded}
        />
        <div className={styles["combat-tracker__container"]}>
          <CharacterList
            characters={sortedCharacters}
            onClick={handleCharacterClick}
            selectedCharacter={selectedCharacter}
            className={styles["combat-tracker__container__left"]}
          />
          {selectedCharacter && combat && (
            <div className={styles["combat-tracker__container__right"]}>
              <CharacterStats
                selectedCharacter={selectedCharacter}
                characters={combat.characters}
                onCharacterChange={onCharacterEdited}
                onHistoryEdited={onHistoryEdited}
                combatCurrentTurn={combat.currentTurn}
              />
            </div>
          )}
        </div>
      </div>
      <CustomDrawer
        isOpened={isDrawerOpened}
        onClose={() => setIsDrawerOpened(false)}
      >
        <CharacterForm
          initialCharacter={characterToEdit}
          onSubmit={onCharacterEdited}
        />
      </CustomDrawer>
    </>
  );
};

export default CombatTrackerPage;
