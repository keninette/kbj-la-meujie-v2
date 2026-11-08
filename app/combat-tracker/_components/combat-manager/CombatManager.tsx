import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { CombatStatusEnum } from "@/app/_lib/enums/combat-status.enum";
import { Combat } from "@/app/_lib/types/combat.type";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import {
  findCharacterIndexById,
  getOngoingTurn,
} from "@/app/_lib/combat/combat.helper";
import { useState } from "react";
import ContainerBox from "@/app/_components/_basics/container-box/ContainerBox";
import CustomDrawer from "@/app/_components/_basics/custom-drawer/CustomDrawer";
import styles from "./combat-manager.module.scss";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import CombatHistory from "../combat-history/CombatHistory";
import EditCharacterForm from "../edit-character-form/EditCharacterForm";

type CombatManagerProps = {
  title: string;
  ongoingCombat: Combat | null;
  onCombatChange: (combat: Combat | null) => void;
  onCharacterAdded: (character: CombatCharacter) => void;
};

enum DrawerContentEnum {
  CHARACTER_FORM = "character-form",
  COMBAT_HISTORY = "combat-history",
  STOP_COMBAT_CONFIRMATION = "stop-combat-confirmation",
}

const DRAWER_TITLE_KEYS: Record<DrawerContentEnum, string> = {
  [DrawerContentEnum.CHARACTER_FORM]: "form.addCharacter",
  [DrawerContentEnum.COMBAT_HISTORY]: "history.title",
  [DrawerContentEnum.STOP_COMBAT_CONFIRMATION]: "manager.stopTitle",
};

const CombatManager = ({
  title,
  ongoingCombat,
  onCombatChange,
}: CombatManagerProps) => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const [drawerContent, setDrawerContent] = useState<DrawerContentEnum | null>(
    null,
  );
  const displayPreviousPlayerButton =
    ongoingCombat &&
    (ongoingCombat.currentTurn > 1 ||
      (ongoingCombat.currentTurn === 1 &&
        ongoingCombat.selectedCharacterIndex > 0));

  const createNewCombat = () => {
    if (ongoingCombat) {
      if (
        !confirm(translate("manager.newCombatConfirmation", "combatTracker"))
      ) {
        return;
      }
    }
    const newCombat: Combat = {
      status: CombatStatusEnum.PREPARING,
      currentTurn: 1,
      selectedCharacterIndex: 0,
      characters: [],
      history: [],
    };
    onCombatChange(newCombat);
  };

  const startCombat = () => {
    if (!ongoingCombat) {
      return;
    }

    onCombatChange({
      ...ongoingCombat,
      status: CombatStatusEnum.ONGOING,
      currentTurn: 1,
      selectedCharacterIndex: 0,
      history: [],
    });
  };

  const updateCharacter = (updatedCharacter: CombatCharacter) => {
    const existingCharacterIndex = ongoingCombat
      ? findCharacterIndexById(ongoingCombat.characters, updatedCharacter.id)
      : -1;
    let updatedCharacters = [...(ongoingCombat?.characters ?? [])];
    if (existingCharacterIndex !== undefined && existingCharacterIndex >= 0) {
      updatedCharacters[existingCharacterIndex] = updatedCharacter;
    } else {
      updatedCharacters = [...updatedCharacters, updatedCharacter];
    }

    if (!ongoingCombat) {
      return;
    }

    onCombatChange({ ...ongoingCombat, characters: updatedCharacters });
  };

  const selectPreviousCharacter = () => {
    if (ongoingCombat === null || ongoingCombat?.characters.length === 0) {
      return;
    }

    // if selected character was the first one, go back to last turn, except if we're still in turn one
    if (!ongoingCombat) {
      return;
    }

    const goBackToPreviousTurn =
      ongoingCombat.selectedCharacterIndex === 0 &&
      ongoingCombat.currentTurn > 1;
    const previousCharacterIndex =
      ongoingCombat.selectedCharacterIndex === 0
        ? ongoingCombat.selectedCharacterIndex
        : ongoingCombat.selectedCharacterIndex - 1;

    onCombatChange({
      ...ongoingCombat,
      selectedCharacterIndex: goBackToPreviousTurn
        ? ongoingCombat.characters.length - 1
        : previousCharacterIndex,
      currentTurn: goBackToPreviousTurn
        ? ongoingCombat.currentTurn - 1
        : ongoingCombat.currentTurn,
    });
  };

  const selectNextCharacter = () => {
    if (ongoingCombat === null || ongoingCombat?.characters.length === 0) {
      return;
    }

    // if selected character was the last one, start from first character again and add one turn
    if (!ongoingCombat) {
      return;
    }

    const goToNextTurn =
      ongoingCombat.selectedCharacterIndex ===
      ongoingCombat.characters.length - 1;

    onCombatChange({
      ...ongoingCombat,
      selectedCharacterIndex: goToNextTurn
        ? 0
        : ongoingCombat.selectedCharacterIndex + 1,
      currentTurn: goToNextTurn
        ? ongoingCombat.currentTurn + 1
        : ongoingCombat.currentTurn,
    });
  };

  const stopCombat = (removeAllCharacters: boolean) => {
    if (!ongoingCombat) {
      return;
    }

    if (removeAllCharacters) {
      onCombatChange(null);
    } else {
      onCombatChange({
        ...ongoingCombat,
        status: CombatStatusEnum.PREPARING,
        currentTurn: 1,
        selectedCharacterIndex: 0,
        characters: ongoingCombat.characters.filter(
          (character) => !character.isNpc,
        ),
        idleCharacters: ongoingCombat.idleCharacters?.filter(
          (character) => !character.isNpc,
        ),
        history: [],
      });
    }

    setIsDrawerOpened(false);
  };

  const currentCharacter =
    ongoingCombat?.characters[ongoingCombat.selectedCharacterIndex];

  return (
    <div className={styles["combat-manager"]}>
      <div
        className={[
          styles["combat-manager__line"],
          styles["combat-manager__line--header"],
        ].join(" ")}
      >
        <h1 className={styles["combat-manager__title"]}>{title}</h1>
        <div className={styles["combat-manager__actions"]}>
          {!ongoingCombat && (
            <ButtonWithIcon
              label={translate("manager.newCombat", "combatTracker")}
              onClick={createNewCombat}
              faIcon="plus"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              variant={
                ongoingCombat ? ButtonVariant.SECONDARY : ButtonVariant.FAB
              }
            />
          )}
          {ongoingCombat && (
            <ButtonWithIcon
              label={translate("manager.addCharacter", "combatTracker")}
              onClick={() => {
                setDrawerContent(DrawerContentEnum.CHARACTER_FORM);
                setIsDrawerOpened(true);
              }}
              faIcon="plus"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              variant={ButtonVariant.SECONDARY}
            />
          )}
          {ongoingCombat &&
            ongoingCombat.status !== CombatStatusEnum.ONGOING &&
            ongoingCombat.characters.length > 0 && (
              <ButtonWithIcon
                label={translate("manager.startCombat", "combatTracker")}
                onClick={startCombat}
                faIcon="play"
                faIconStyle={FaIconStyleEnum.SOLID}
                iconPosition="left"
              />
            )}
          {ongoingCombat?.status === CombatStatusEnum.ONGOING && (
            <ButtonWithIcon
              label={translate("manager.stopCombat", "combatTracker")}
              data-testid="stop-combat"
              onClick={() => {
                setDrawerContent(DrawerContentEnum.STOP_COMBAT_CONFIRMATION);
                setIsDrawerOpened(true);
              }}
              faIcon="stop"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              variant={ButtonVariant.SECONDARY}
            />
          )}
          {ongoingCombat?.status === CombatStatusEnum.ONGOING && (
            <ButtonWithIcon
              label={translate("manager.history", "combatTracker")}
              onClick={() => {
                setDrawerContent(DrawerContentEnum.COMBAT_HISTORY);
                setIsDrawerOpened(true);
              }}
              faIcon="clock-rotate-left"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              variant={ButtonVariant.SECONDARY}
            />
          )}
        </div>
      </div>
      {ongoingCombat?.status === CombatStatusEnum.ONGOING && (
        <ContainerBox
          as="section"
          className={styles["combat-manager__turn"]}
          aria-label={translate("manager.turn", "combatTracker", {
            turn: String(ongoingCombat.currentTurn),
          })}
          data-testid="combat-turn"
        >
          <div className={styles["combat-manager__navigation-slot"]}>
            {displayPreviousPlayerButton && (
              <ButtonWithIcon
                label={translate("manager.previousPlayer", "combatTracker")}
                onClick={selectPreviousCharacter}
                faIcon="backward"
                faIconStyle={FaIconStyleEnum.SOLID}
                iconPosition="left"
                variant={ButtonVariant.SECONDARY}
              />
            )}
          </div>
          <p className={styles["combat-manager__turn-info"]}>
            <span className={styles["combat-manager__turn-number"]}>
              {translate("manager.turn", "combatTracker", {
                turn: String(ongoingCombat.currentTurn),
              })}
            </span>
            {currentCharacter && (
              <span className={styles["combat-manager__current-character"]}>
                {translate("manager.currentCharacter", "combatTracker")}{" "}
                <strong>{currentCharacter.name}</strong>
              </span>
            )}
          </p>
          <div
            className={`${styles["combat-manager__navigation-slot"]} ${styles["combat-manager__navigation-slot--right"]}`}
          >
            <ButtonWithIcon
              label={translate("manager.nextPlayer", "combatTracker")}
              onClick={selectNextCharacter}
              faIcon="forward"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="right"
            />
          </div>
        </ContainerBox>
      )}

      <CustomDrawer
        isOpened={isDrawerOpened}
        onClose={() => setIsDrawerOpened(false)}
        title={
          drawerContent
            ? translate(DRAWER_TITLE_KEYS[drawerContent], "combatTracker")
            : undefined
        }
      >
        {drawerContent === DrawerContentEnum.CHARACTER_FORM && (
          <EditCharacterForm
            initialCharacter={null}
            onSubmit={(updatedCharacter: CombatCharacter) => {
              updateCharacter(updatedCharacter);
              setIsDrawerOpened(false);
            }}
            onSaveAndRestart={updateCharacter}
            currentTurn={getOngoingTurn(ongoingCombat)}
          />
        )}
        {drawerContent === DrawerContentEnum.COMBAT_HISTORY && (
          <CombatHistory combatHistory={ongoingCombat?.history ?? []} />
        )}
        {drawerContent === DrawerContentEnum.STOP_COMBAT_CONFIRMATION && (
          <div>
            <ButtonWithIcon
              label={translate("manager.removeAllCharacters", "combatTracker")}
              onClick={() => stopCombat(true)}
              faIcon="trash"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              variant={ButtonVariant.SECONDARY}
            />
            <ButtonWithIcon
              label={translate("manager.removeOnlyNpcs", "combatTracker")}
              data-testid="stop-combat-keep-players"
              onClick={() => stopCombat(false)}
              faIcon="user-minus"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              variant={ButtonVariant.SECONDARY}
            />
            <ButtonWithIcon
              label={translate("manager.cancel", "combatTracker")}
              onClick={() => setIsDrawerOpened(false)}
              faIcon="arrow-left"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              variant={ButtonVariant.SECONDARY}
            />
          </div>
        )}
      </CustomDrawer>
    </div>
  );
};

export default CombatManager;
