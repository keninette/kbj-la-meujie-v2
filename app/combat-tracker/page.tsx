"use client";

import { useEffect, useState } from "react";
import CharacterList from "./_components/characters-list/CharacterList";
import styles from "./combat-tracker.module.scss";
import CharacterStats from "./_components/character-stats/CharacterStats";
import CustomDrawer from "../_components/drawer/CustomDrawer";
import EditCharacterForm from "./_components/edit-character-form/EditCharacterForm";
import { clearCombat, loadCombat, saveCombat } from "./_lib/local-storage";
import CombatManager from "./_components/combat-manager/CombatManager";
import { CombatStatusEnum } from "../_lib/enums/combat-status.enum";
import { Combat } from "../_lib/types/combat.type";
import { CombatCharacter } from "../_lib/types/combat-character.type";
import {
  findCharacterIndexById,
  normalizeCombat,
} from "../_lib/combat/combat.helper";
import { translate } from "../_dictionaries/dictionnary";

const CombatTrackerPage = () => {
  const [combat, setCombat] = useState<Combat | null>(null);
  const [isCombatLoaded, setIsCombatLoaded] = useState(false);
  const [characterToEdit, setCharacterToEdit] =
    useState<CombatCharacter | null>(null);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const selectedCharacter =
    combat?.characters?.[combat.selectedCharacterIndex] ?? null;
  const idleCharacters = combat?.idleCharacters ?? [];

  const onCombatChange = (nextCombat: Combat | null) => {
    if (!nextCombat) {
      clearCombat();
    }
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
        const idle = previousCombat.idleCharacters ?? [];
        if (!idle.some((c) => c.id === character.id)) {
          return previousCombat;
        }
        return {
          ...previousCombat,
          idleCharacters: idle.map((c) =>
            c.id === character.id ? character : c,
          ),
        };
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

  const onCharacterDeactivated = (character: CombatCharacter) => {
    setCombat((previousCombat) => {
      if (!previousCombat) {
        return null;
      }

      const selectedId =
        previousCombat.characters[previousCombat.selectedCharacterIndex]?.id;
      const characters = previousCombat.characters.filter(
        (c) => c.id !== character.id,
      );
      const newSelectedIndex = selectedId
        ? findCharacterIndexById(characters, selectedId)
        : -1;

      return {
        ...previousCombat,
        characters,
        idleCharacters: [...(previousCombat.idleCharacters ?? []), character],
        selectedCharacterIndex:
          newSelectedIndex >= 0
            ? newSelectedIndex
            : Math.min(
                previousCombat.selectedCharacterIndex,
                Math.max(characters.length - 1, 0),
              ),
      };
    });
  };

  const onCharacterReactivated = (character: CombatCharacter) => {
    setCombat((previousCombat) => {
      if (!previousCombat) {
        return null;
      }

      return normalizeCombat({
        ...previousCombat,
        characters: [...previousCombat.characters, character],
        idleCharacters: (previousCombat.idleCharacters ?? []).filter(
          (c) => c.id !== character.id,
        ),
      });
    });
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
          <div className={styles["combat-tracker__container__left"]}>
            {(combat?.characters.length ?? 0) > 0 && (
              <CharacterList
                title={translate("list.active", "combatTracker")}
                titleIcon={
                  combat?.status === CombatStatusEnum.ONGOING
                    ? "play"
                    : undefined
                }
                characters={combat?.characters ?? []}
                allowedActions={["edit", "deactivate"]}
                selectedCharacter={selectedCharacter}
                onEdit={handleCharacterClick}
                onDeactivate={onCharacterDeactivated}
              />
            )}
            {idleCharacters.length > 0 && (
              <CharacterList
                title={translate("list.idle", "combatTracker")}
                titleIcon="couch"
                characters={idleCharacters}
                allowedActions={["edit", "reactivate"]}
                isIdle
                onEdit={handleCharacterClick}
                onReactivate={onCharacterReactivated}
              />
            )}
          </div>
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
        <EditCharacterForm
          initialCharacter={characterToEdit}
          onSubmit={onCharacterEdited}
        />
      </CustomDrawer>
    </>
  );
};

export default CombatTrackerPage;
