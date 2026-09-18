import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { Combat, CombatCharacter, CombatStatusEnum } from "../../page";
import { useEffect, useState } from "react";
import CustomDrawer from "@/app/_components/drawer/CustomDrawer";
import CharacterForm from "../character-form/CharacterForm";
import styles from "./combat-manager.module.scss";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { clearCombat } from "../../_lib/local-storage";

type CombatManagerProps = {
  ongoingCombat: Combat | null;
  onCombatChange: (combat: Combat | null) => void;
  onCharacterAdded: (character: CombatCharacter) => void;
};

// todo revoir les css pour utiliser les variables sys
// todo juste onCombatChange : pour regrouper start, character added, ...
const CombatManager = ({
  ongoingCombat,
  onCombatChange,
}: CombatManagerProps) => {
  const [combat, setCombat] = useState<Combat | null>(ongoingCombat ?? null);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const displayPreviousPlayerButton =
    combat &&
    (combat.currentTurn > 1 ||
      (combat.currentTurn === 1 && combat.selectedCharacterIndex > 0));

  const createNewCombat = () => {
    if (combat) {
      if (!confirm("Attention, il y a déjà un combat en cours, continuer ?")) {
        return;
      }
      onCombatChange(null);
    }
    const newCombat: Combat = {
      status: CombatStatusEnum.PREPARING,
      currentTurn: 1,
      selectedCharacterIndex: 0,
      characters: [],
      history: [],
    };
    setCombat(newCombat);
  };

  const startCombat = () => {
    setCombat(
      (prevCombat) =>
        ({
          ...prevCombat,
          status: CombatStatusEnum.ONGOING,
          currentTurn: 1,
          selectedCharacterIndex: 0,
          history: [],
        }) as Combat,
    );
  };

  const updateCharacter = (updatedCharacter: CombatCharacter) => {
    const existingCharacterIndex = combat?.characters?.findIndex(
      (char: CombatCharacter) => char.name === updatedCharacter.name,
    );
    let updatedCharacters = [...combat?.characters];
    if (existingCharacterIndex && existingCharacterIndex > 0) {
      updatedCharacters[existingCharacterIndex] = updatedCharacter;
    } else {
      updatedCharacters = [...updatedCharacters, updatedCharacter];
    }

    setCombat(
      (prevCombat) =>
        ({
          ...prevCombat,
          characters: updatedCharacters,
        }) as Combat,
    );
  };

  const selectPreviousCharacter = () => {
    if (combat === null || combat?.characters.length === 0) {
      return;
    }

    // if selected character was the first one, go back to last turn, except if we're still in turn one
    setCombat((prevCombat) => {
      const goBackToPreviousTurn =
        prevCombat.selectedCharacterIndex === 0 && prevCombat?.currentTurn > 1;
      const previousCharacterIndex =
        prevCombat?.selectedCharacterIndex === 0
          ? prevCombat?.selectedCharacterIndex
          : prevCombat?.selectedCharacterIndex - 1;

      return {
        ...prevCombat,
        selectedCharacterIndex: goBackToPreviousTurn
          ? prevCombat?.characters.length - 1
          : previousCharacterIndex,
        currentTurn: goBackToPreviousTurn
          ? prevCombat?.currentTurn - 1
          : prevCombat?.currentTurn,
      } as Combat;
    });
  };

  const selectNextCharacter = () => {
    if (combat === null || combat?.characters.length === 0) {
      return;
    }

    // if selected character was the last one, start from first character again and add one turn
    setCombat((prevCombat) => {
      const goToNextTurn =
        prevCombat?.selectedCharacterIndex ===
        prevCombat?.characters.length - 1;

      return {
        ...prevCombat,
        selectedCharacterIndex: goToNextTurn
          ? 0
          : prevCombat?.selectedCharacterIndex + 1,
        currentTurn: goToNextTurn
          ? prevCombat?.currentTurn + 1
          : prevCombat?.currentTurn,
      } as Combat;
    });
  };

  const stopCombat = () => {
    if (confirm("Arrêter le combat va effacer les données, continuer ?")) {
      setCombat(null);
      onCombatChange(null);
    }
  };

  useEffect(() => {
    onCombatChange(combat);
  }, [combat]);

  return (
    <div className={styles["combat-manager"]}>
      <div
        className={[
          styles["combat-manager__line"],
          styles["combat-manager__line--border-bottom"],
        ].join(" ")}
      >
        {!combat && (
          <ButtonWithIcon
            label="Nouveau combat"
            onClick={createNewCombat}
            faIcon="plus"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
            variant={combat ? ButtonVariant.SECONDARY : ButtonVariant.FAB}
          />
        )}
        {combat && (
          <ButtonWithIcon
            label="Ajouter un personnage"
            onClick={() => setIsDrawerOpened(true)}
            faIcon="plus"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
            variant={ButtonVariant.SECONDARY}
          />
        )}
        {combat &&
          combat.status !== CombatStatusEnum.ONGOING &&
          combat.characters.length > 0 && (
            <ButtonWithIcon
              label="Commencer le combat"
              onClick={startCombat}
              faIcon="play"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              variant={
                combat?.status === CombatStatusEnum.ONGOING
                  ? ButtonVariant.SECONDARY
                  : ButtonVariant.FAB
              }
            />
          )}
        {combat?.status === CombatStatusEnum.ONGOING && (
          <ButtonWithIcon
            label="Recommencer le combat"
            onClick={startCombat}
            faIcon="refresh"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
            variant={ButtonVariant.SECONDARY}
          />
        )}
        {combat?.status === CombatStatusEnum.ONGOING && (
          <ButtonWithIcon
            label="Arrêter le combat"
            onClick={stopCombat}
            faIcon="stop"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
            variant={ButtonVariant.SECONDARY}
          />
        )}
      </div>
      {combat?.status === CombatStatusEnum.ONGOING && (
        <div
          className={[
            styles["combat-manager__line"],
            styles["combat-manager__line--even"],
          ].join(" ")}
        >
          <div>
            {displayPreviousPlayerButton && (
              <ButtonWithIcon
                label="Joueur précédent"
                onClick={selectPreviousCharacter}
                faIcon="backward"
                faIconStyle={FaIconStyleEnum.SOLID}
                iconPosition="left"
              />
            )}
          </div>
          <h3>Tour {combat.currentTurn}</h3>
          <ButtonWithIcon
            label="Joueur suivant"
            onClick={selectNextCharacter}
            faIcon="forward"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="right"
          />
        </div>
      )}

      <CustomDrawer
        isOpened={isDrawerOpened}
        onClose={() => setIsDrawerOpened(false)}
      >
        <CharacterForm initialCharacter={null} onSubmit={updateCharacter} />
      </CustomDrawer>
    </div>
  );
};

export default CombatManager;
