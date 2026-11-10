import { cx } from "@/app/_lib/class-names";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { CombatStatusEnum } from "@/app/_lib/enums/combat-status.enum";
import { Combat } from "@/app/_lib/types/combat.type";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import {
  findCharacterIndexById,
  getFirstTurnPosition,
  getNextTurnPosition,
  getOngoingTurn,
  getPreviousTurnPosition,
} from "@/app/_lib/combat/combat.helper";
import { useState } from "react";
import ContainerBox from "@/app/_components/_basics/container-box/ContainerBox";
import CustomDrawer from "@/app/_components/_basics/custom-drawer/CustomDrawer";
import CustomDialog from "@/app/_components/_basics/custom-dialog/CustomDialog";
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
}

const DRAWER_TITLE_KEYS: Record<DrawerContentEnum, string> = {
  [DrawerContentEnum.CHARACTER_FORM]: "form.addCharacter",
  [DrawerContentEnum.COMBAT_HISTORY]: "history.title",
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
  const [isStopDialogOpened, setIsStopDialogOpened] = useState(false);
  // Changed on each opening of the character form: remounts it, which clears it
  const [characterFormOpeningCount, setCharacterFormOpeningCount] = useState(0);
  const isCharacterFormOpened =
    isDrawerOpened && drawerContent === DrawerContentEnum.CHARACTER_FORM;
  const displayPreviousPlayerButton =
    !!ongoingCombat && getPreviousTurnPosition(ongoingCombat) !== null;

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
      ...getFirstTurnPosition(ongoingCombat.characters),
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

  // Dead characters are skipped (see combat.helper)
  const selectPreviousCharacter = () => {
    const position = ongoingCombat && getPreviousTurnPosition(ongoingCombat);
    if (ongoingCombat && position) {
      onCombatChange({ ...ongoingCombat, ...position });
    }
  };

  const selectNextCharacter = () => {
    const position = ongoingCombat && getNextTurnPosition(ongoingCombat);
    if (ongoingCombat && position) {
      onCombatChange({ ...ongoingCombat, ...position });
    }
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

    setIsStopDialogOpened(false);
  };

  const currentCharacter =
    ongoingCombat?.characters[ongoingCombat.selectedCharacterIndex];

  return (
    <div className={styles["combat-manager"]}>
      <div
        className={cx(
          styles["combat-manager__line"],
          styles["combat-manager__line--header"],
        )}
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
                setCharacterFormOpeningCount((count) => count + 1);
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
              onClick={() => setIsStopDialogOpened(true)}
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

      {/* Has its own drawer, for its buttons */}
      <EditCharacterForm
        key={characterFormOpeningCount}
        isOpened={isCharacterFormOpened}
        onClose={() => setIsDrawerOpened(false)}
        title={translate(
          DRAWER_TITLE_KEYS[DrawerContentEnum.CHARACTER_FORM],
          "combatTracker",
        )}
        initialCharacter={null}
        onSubmit={(updatedCharacter: CombatCharacter) => {
          updateCharacter(updatedCharacter);
          setIsDrawerOpened(false);
        }}
        onSaveAndRestart={updateCharacter}
        currentTurn={getOngoingTurn(ongoingCombat)}
      />
      <CustomDrawer
        isOpened={isDrawerOpened && !isCharacterFormOpened}
        onClose={() => setIsDrawerOpened(false)}
        title={
          drawerContent
            ? translate(DRAWER_TITLE_KEYS[drawerContent], "combatTracker")
            : ""
        }
      >
        {drawerContent === DrawerContentEnum.COMBAT_HISTORY && (
          <CombatHistory combatHistory={ongoingCombat?.history ?? []} />
        )}
      </CustomDrawer>
      <CustomDialog
        isOpened={isStopDialogOpened}
        onClose={() => setIsStopDialogOpened(false)}
        title={translate("manager.stopTitle", "combatTracker")}
        actions={
          <>
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
              label={translate("manager.removeAllCharacters", "combatTracker")}
              onClick={() => stopCombat(true)}
              faIcon="trash"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              variant={ButtonVariant.SECONDARY}
            />
          </>
        }
      />
    </div>
  );
};

export default CombatManager;
