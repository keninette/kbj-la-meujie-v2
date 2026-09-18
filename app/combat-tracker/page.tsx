"use client";

import { useEffect, useState } from "react";
import CharacterList from "./_components/characters-list/CharacterList";
import styles from "./combat-tracker.module.scss";
import CharacterStats from "./_components/character-stats/CharacterStats";
import CustomDrawer from "../_components/drawer/CustomDrawer";
import CharacterForm from "./_components/character-form/CharacterForm";
import { clearCombat, loadCombat, saveCombat } from "./_lib/local-storage";
import CombatManager from "./_components/combat-manager/CombatManager";
import { CombatStatusEnum } from "../_lib/enums/combat-status.enum";
import { Combat } from "../_lib/types/combat.type";
import { CombatCharacter } from "../_lib/types/combat-character.type";
import { findCharacterIndexById } from "../_lib/combat/combat.helper";
import { translate } from "../_dictionaries/dictionnary";

const sortCharacters = (characters: CombatCharacter[]) => {
  return [...characters].sort((a, b) => b.initiativeScore - a.initiativeScore);
};

const normalizeCombat = (nextCombat: Combat | null): Combat | null => {
  if (!nextCombat) {
    return null;
  }

  const selectedCharacterId =
    nextCombat.characters[nextCombat.selectedCharacterIndex]?.id;
  const characters = sortCharacters(nextCombat.characters);
  const selectedCharacterIndex = selectedCharacterId
    ? findCharacterIndexById(characters, selectedCharacterId)
    : nextCombat.selectedCharacterIndex;
  const fallbackCharacterIndex =
    characters.length > 0
      ? Math.min(
          Math.max(nextCombat.selectedCharacterIndex, 0),
          characters.length - 1,
        )
      : 0;

  return {
    ...nextCombat,
    characters,
    selectedCharacterIndex:
      selectedCharacterIndex >= 0
        ? selectedCharacterIndex
        : fallbackCharacterIndex,
  };
};

const CombatTrackerPage = () => {
  const [combat, setCombat] = useState<Combat | null>(null);
  const [isCombatLoaded, setIsCombatLoaded] = useState(false);
  const [characterToEdit, setCharacterToEdit] =
    useState<CombatCharacter | null>(null);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const selectedCharacter =
    combat?.characters?.[combat.selectedCharacterIndex] ?? null;

  const onCombatChange = (nextCombat: Combat | null) => {
    setCombat(normalizeCombat(nextCombat));
  };

  const handleCharacterClick = (character: CombatCharacter) => {
    setIsDrawerOpened(true);
    setCharacterToEdit(character);
  };

  const onCharacterAdded = (character: CombatCharacter) => {
    if (!combat) {
      return;
    }
    const updatedCharacters = [...(combat?.characters ?? []), character];
    onCombatChange({ ...combat, characters: updatedCharacters });
    setIsDrawerOpened(false);
  };

  const onCharacterEdited = (character: CombatCharacter) => {
    setCombat((previousCombat) => {
      if (!previousCombat) {
        return null;
      }

      const existingCharacterIndex = findCharacterIndexById(
        previousCombat.characters,
        character.id,
      );

      if (existingCharacterIndex === -1) {
        return previousCombat;
      }

      const updatedCharacters = [...previousCombat.characters];
      updatedCharacters[existingCharacterIndex] = character;
      return normalizeCombat({
        ...previousCombat,
        characters: updatedCharacters,
      });
    });
    setIsDrawerOpened(false);
  };

  const onCharactersChange = (characters: CombatCharacter[]) => {
    if (!combat) {
      return;
    }

    onCombatChange({ ...combat, characters });
  };

  const onHistoryEdited = (historyEntries: string[]) => {
    setCombat((prev) => {
      if (!prev) {
        return null;
      }

      return {
        ...prev,
        history: [
          ...(prev.history ?? []),
          ...historyEntries.map((entry) => ({
            id: crypto.randomUUID(),
            turn: prev.currentTurn,
            action: entry,
          })),
        ],
      };
    });
  };

  useEffect(() => {
    queueMicrotask(() => {
      setCombat(normalizeCombat(loadCombat()));
      setIsCombatLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isCombatLoaded) {
      return;
    }

    if (combat) {
      saveCombat(combat);
    } else {
      clearCombat();
    }
  }, [combat, isCombatLoaded]);

  return (
    <>
      <div className={styles["combat-tracker"]}>
        <h1>{translate("title", "combatTracker")}</h1>
        <CombatManager
          ongoingCombat={combat}
          onCombatChange={onCombatChange}
          onCharacterAdded={onCharacterAdded}
        />
        <div className={styles["combat-tracker__container"]}>
          <CharacterList
            characters={combat?.characters ?? []}
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
                onCharactersChange={onCharactersChange}
                onHistoryEdited={onHistoryEdited}
                isCombatOngoing={combat.status === CombatStatusEnum.ONGOING}
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
