'use client';

import { useState } from "react";
import CharacterList from "./_components/characters-list/CharacterList";
import styles from "./combat-tracker.module.scss";  
import CharacterStats from "./_components/CharacterStats";

export type CombatCharacter = {
  name: string;
  hp: number;
  maxHp: number;
  ac: number;
  initScore: number;
  spellSlotsLefts?: Record<number, number>;
  states?: {name: string, numberOfTurns: number, saveThrowStat: string, saveThrowThreshold: number}[]; 
};

const CombatTrackerPage = () => {
  const sampleCharacters = [
    // Personnages Joueurs avec différents niveaux de sorts
    {
      name: 'Thoron',
      hp: 45,
      maxHp: 50,
      ac: 18,
      initScore: 15,
      spellSlotsLefts: { 1: 4, 2: 3, 3: 2, 4: 1, 5: 1 },
      states: [{name: 'Bless', numberOfTurns: 2, saveThrowStat: 'WIS', saveThrowThreshold: 15}, {name: 'Haste', numberOfTurns: 1, saveThrowStat: 'DEX', saveThrowThreshold: 14}]
    },
    {
      name: 'Elara',
      hp: 32,
      maxHp: 40,
      ac: 16,
      initScore: 12,
      spellSlotsLefts: { 1: 3, 2: 2, 3: 1 },
      states: [{name: '🔥 En feu', numberOfTurns: 10, saveThrowStat: 'CON', saveThrowThreshold: 13}]
    },
    {
      name: 'Kaelen',
      hp: 28,
      maxHp: 35,
      ac: 14,
      initScore: 11,
      spellSlotsLefts: { 1: 2, 2: 1 },
    },
    {
      name: 'Myra',
      hp: 15,
      maxHp: 20,
      ac: 13,
      initScore: 8,
      spellSlotsLefts: { 1: 5, 2: 2, 3: 1, 4: 1 },
    },
    {
      name: 'Zephyr le Sage',
      hp: 60,
      maxHp: 70,
      ac: 15,
      initScore: 17,
      spellSlotsLefts: { 1: 6, 2: 4, 3: 3, 4: 2, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1 },
    },
    // Personnages sans sorts (guerriers, voleurs, etc.)
    {
      name: 'Gorim le Guerrier',
      hp: 0,
      maxHp: 95,
      ac: 20,
      initScore: 10,
      spellSlotsLefts: {},
    },
    {
      name: 'Shadowsong',
      hp: 55,
      maxHp: 60,
      ac: 17,
      initScore: 16,
      spellSlotsLefts: {},
    },
    // Monstres / PNJ
    {
      name: 'Goblin Chef',
      hp: -1,
      maxHp: 9,
      ac: 12,
      initScore: 8,
      spellSlotsLefts: {},
    },
    {
      name: 'Ork Guerrier',
      hp: 38,
      maxHp: 45,
      ac: 15,
      initScore: 10,
      spellSlotsLefts: {},
    },
    {
      name: 'Drago Noir',
      hp: 2,
      maxHp: 200,
      ac: 22,
      initScore: 19,
      spellSlotsLefts: {},
    },
    {
      name: 'Arch mage Vex',
      hp: 65,
      maxHp: 75,
      ac: 17,
      initScore: 14,
      spellSlotsLefts: { 1: 3, 2: 2, 3: 1 },
    },
    {
      name: 'Dame Lyria',
      hp: 72,
      maxHp: 80,
      ac: 16,
      initScore: 13,
      spellSlotsLefts: { 1: 4, 2: 3, 3: 0, 4: 2, 5: 1 },
    },
  ];

  const [selectedCharacter, setSelectedCharacter] = useState<CombatCharacter | null>(null);
  const sortedCharacters = [...sampleCharacters].sort((a, b) => b.initScore - a.initScore);


  const handleCharacterClick = (character: CombatCharacter) => {
    setSelectedCharacter(character);
  } 

  return (
    <div className={styles["combat-tracker"]}>
      <h1>Tracker de Combat</h1>
      <div className={styles["combat-tracker__container"]}>
        <CharacterList characters={sortedCharacters} onClick={handleCharacterClick} selectedCharacter={selectedCharacter}  className={styles["combat-tracker__container__left"]}/>
        {selectedCharacter && (
          <div className={styles["combat-tracker__container__right"]}>
            <CharacterStats character={selectedCharacter} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CombatTrackerPage;