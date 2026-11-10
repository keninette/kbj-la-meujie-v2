import { cx } from "@/app/_lib/class-names";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import styles from "./character-stats.module.scss";
import { useId, useState } from "react";
import CombatActionForm from "../combat-action-form/CombatActionForm";
import { translate } from "@/app/_dictionaries/dictionnary";
import ContainerBox from "@/app/_components/_basics/container-box/ContainerBox";
import IdentitySection from "./_components/identity-section/IdentitySection";
import StatsSection from "./_components/stats-section/StatsSection";
import ChipListSection from "./_components/chip-list-section/ChipListSection";
import SpellSlotsSection from "./_components/spell-slots-section/SpellSlotsSection";
import ActionsSection from "./_components/actions-section/ActionsSection";
import StatesSection from "./_components/states-section/StatesSection";

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
  // Changed on each opening: remounts the form, which clears it
  const [drawerOpeningCount, setDrawerOpeningCount] = useState(0);
  const nameId = useId();

  const updateCharacter = (updatedCharacter: CombatCharacter) => {
    onCharacterChange(updatedCharacter);
  };

  // After the third success, the character is stabilized: nothing changes until helped by other character
  const onDeathSaveSuccess = () => {
    updateCharacter({
      ...selectedCharacter,
      deathSaveThrowsLeft: Math.max(
        selectedCharacter.deathSaveThrowsLeft - 1,
        0,
      ),
    });
  };

  // A single failed death saving throw is enough to die
  const onDeathSaveFail = () => {
    updateCharacter({
      ...selectedCharacter,
      isDead: true,
      isDying: false,
      deathSaveThrowsLeft: 3,
    });
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
          onPlay={() => {
            setIsDrawerOpened(true);
            setDrawerOpeningCount((count) => count + 1);
          }}
          onEdit={onEdit}
          onDeactivate={onDeactivate}
        />
        <StatsSection
          character={selectedCharacter}
          onDeathSaveSuccess={isCombatOngoing ? onDeathSaveSuccess : undefined}
          onDeathSaveFail={isCombatOngoing ? onDeathSaveFail : undefined}
        />
        <ChipListSection
          title={translate("stats.passives", "combatTracker")}
          items={selectedCharacter.passives}
          data-testid="character-passives"
        />
        <SpellSlotsSection spellSlotsLeft={selectedCharacter.spellSlotsLeft} />
        <ActionsSection actions={selectedCharacter.actions} />
        <StatesSection
          states={selectedCharacter.states}
          onRemoveState={onRemoveState}
        />
        <ChipListSection
          title={translate("stats.usableObjects", "combatTracker")}
          items={selectedCharacter.usableObjects}
          data-testid="character-consumables"
        />
      </ContainerBox>
      <CombatActionForm
        key={drawerOpeningCount}
        isOpened={isDrawerOpened}
        onClose={() => setIsDrawerOpened(false)}
        title={translate("combatAction.turnTitle", "combatTracker", {
          character: selectedCharacter.name,
        })}
        characters={characters ?? []}
        selectedCharacter={selectedCharacter}
        onCharactersChange={(updatedCharacters) => {
          onCharactersChange(updatedCharacters);
          setIsDrawerOpened(false);
        }}
        onHistoryEdited={onHistoryEdited}
        currentTurn={currentTurn}
      />
    </>
  );
};

export default CharacterStats;
