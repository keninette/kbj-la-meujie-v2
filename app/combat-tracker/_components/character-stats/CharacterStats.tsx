import { cx } from "@/app/_lib/class-names";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import styles from "./character-stats.module.scss";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { useId, useState } from "react";
import CustomDrawer from "@/app/_components/_basics/custom-drawer/CustomDrawer";
import AttackForm from "../attack-form/AttackForm";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import ContainerBox from "@/app/_components/_basics/container-box/ContainerBox";
import IdentitySection from "./_components/identity-section/IdentitySection";
import StatsSection from "./_components/stats-section/StatsSection";
import PassivesSection from "./_components/passives-section/PassivesSection";
import SpellSlotsSection from "./_components/spell-slots-section/SpellSlotsSection";
import ActionsList from "../actions-list/ActionsList";
import { describeState } from "@/app/combat-tracker/_lib/combat-state.helper";

type CharacterStatsProps = {
  characters?: CombatCharacter[];
  selectedCharacter: CombatCharacter;
  onCharacterChange: (character: CombatCharacter) => void;
  onCharactersChange: (characters: CombatCharacter[]) => void;
  onHistoryEdited: (historyEntry: string[]) => void;
  isCombatOngoing: boolean;
  currentTurn?: number;
  onEdit?: (character: CombatCharacter) => void;
  onDeactivate?: (character: CombatCharacter) => void;
  [key: string]: unknown;
};

const CharacterStats = ({
  selectedCharacter,
  characters,
  onCharacterChange,
  onCharactersChange,
  onHistoryEdited,
  isCombatOngoing,
  currentTurn,
  onEdit,
  onDeactivate,
  ...restProps
}: CharacterStatsProps) => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const nameId = useId();

  const updateCharacter = (updatedCharacter: CombatCharacter) => {
    onCharacterChange(updatedCharacter);
  };

  const onDeathSaveFail = () => {
    const updatedCharacter = { ...selectedCharacter };
    if (updatedCharacter.deathSaveThrowsLeft > 0) {
      updatedCharacter.deathSaveThrowsLeft -= 1;
    }

    if (updatedCharacter.deathSaveThrowsLeft <= 0) {
      updatedCharacter.isDead = true;
      updatedCharacter.isDying = false;
      updatedCharacter.deathSaveThrowsLeft = 3;
    }

    updateCharacter(updatedCharacter);
  };

  const onRemoveState = (stateId: string) => {
    const stateToRemove = (selectedCharacter.states ?? []).find(
      (state) => state.id === stateId,
    );
    if (!stateToRemove) {
      return;
    }

    const updatedCharacter = {
      ...selectedCharacter,
      states: (selectedCharacter.states ?? []).filter(
        (state) => state.id !== stateId,
      ),
    };

    onHistoryEdited([
      `${selectedCharacter.name} perd l'état ${stateToRemove.name}`,
    ]);
    updateCharacter(updatedCharacter);
  };

  return (
    <>
      <ContainerBox
        as="section"
        aria-labelledby={nameId}
        className={cx(
          styles["character-stats"],
          selectedCharacter.isDead
            ? styles["character-stats--disabled-like"]
            : undefined,
        )}
        {...restProps}
      >
        <IdentitySection
          character={selectedCharacter}
          nameId={nameId}
          isCombatOngoing={isCombatOngoing}
          onPlay={() => setIsDrawerOpened(true)}
          onDeathSaveFail={onDeathSaveFail}
          onEdit={onEdit}
          onDeactivate={onDeactivate}
        />
        <StatsSection character={selectedCharacter} />
        <PassivesSection passives={selectedCharacter.passives} />
        <SpellSlotsSection spellSlotsLeft={selectedCharacter.spellSlotsLeft} />
        {selectedCharacter.actions && selectedCharacter.actions.length > 0 && (
          <div
            className={cx(
              styles["character-stats__line--vertical"],
              styles["character-stats__line"],
            )}
            data-testid="character-actions"
          >
            <div>
              <FontAwesomeIcon
                faIcon="hand-fist"
                faIconStyle={FaIconStyleEnum.SOLID}
              />
              {translate("stats.actions", "combatTracker")} :
            </div>
            <ActionsList
              actions={selectedCharacter.actions}
              className={styles["character-stats__line--indented"]}
            />
          </div>
        )}
        {selectedCharacter.usableObjects &&
          selectedCharacter.usableObjects.length > 0 && (
            <div
              className={cx(
                styles["character-stats__line--vertical"],
                styles["character-stats__line"],
              )}
              data-testid="character-usable-objects"
            >
              <div>
                <FontAwesomeIcon
                  faIcon="bag-shopping"
                  faIconStyle={FaIconStyleEnum.SOLID}
                />
                {translate("stats.usableObjects", "combatTracker")} :
              </div>
              <div className={styles["character-stats__line"]}>
                {selectedCharacter.usableObjects.map((usableObject, index) => (
                  <div
                    className={styles["character-stats__line--indented"]}
                    key={`${usableObject}-${index}`}
                  >
                    ⚫ {usableObject}
                  </div>
                ))}
              </div>
            </div>
          )}
        {selectedCharacter.states && selectedCharacter.states.length > 0 && (
          <div
            className={cx(
              styles["character-stats__line--vertical"],
              styles["character-stats__line"],
            )}
          >
            <div>
              <FontAwesomeIcon
                faIcon="fire-flame-curved"
                faIconStyle={FaIconStyleEnum.SOLID}
              />
              {translate("form.states", "combatTracker")} :
            </div>
            <div
              className={cx(
                styles["character-stats__line"],
                styles["character-stats__line--vertical-content"],
              )}
            >
              {selectedCharacter.states.map((state) => (
                <div
                  className={styles["character-stats__line__subcontent"]}
                  key={state.id}
                >
                  <span>{describeState(state)}</span>
                  <IconButton
                    variant={ButtonVariant.SECONDARY}
                    tooltip={translate("form.remove", "combatTracker")}
                    faIcon="xmark"
                    faIconStyle={FaIconStyleEnum.SOLID}
                    onClick={() => onRemoveState(state.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </ContainerBox>
      <CustomDrawer
        isOpened={isDrawerOpened}
        onClose={() => setIsDrawerOpened(false)}
        title={translate("attack.turnTitle", "combatTracker", {
          character: selectedCharacter.name,
        })}
      >
        <AttackForm
          characters={characters!}
          selectedCharacter={selectedCharacter}
          onCharactersChange={(updatedCharacters) => {
            onCharactersChange(updatedCharacters);
            setIsDrawerOpened(false);
          }}
          onHistoryEdited={onHistoryEdited}
          currentTurn={currentTurn}
        />
      </CustomDrawer>
    </>
  );
};

export default CharacterStats;
