import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import styles from "./character-stats.module.scss";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { useState } from "react";
import CustomDrawer from "@/app/_components/drawer/CustomDrawer";
import AttackForm from "../attack-form/AttackForm";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";

type CharacterStatsProps = {
  characters?: CombatCharacter[];
  selectedCharacter: CombatCharacter;
  onCharacterChange: (character: CombatCharacter) => void;
  onCharactersChange: (characters: CombatCharacter[]) => void;
  onHistoryEdited: (historyEntry: string[]) => void;
  isCombatOngoing: boolean;
  [key: string]: unknown;
};

const CharacterStats = ({
  selectedCharacter,
  characters,
  onCharacterChange,
  onCharactersChange,
  onHistoryEdited,
  isCombatOngoing,
  ...restProps
}: CharacterStatsProps) => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const hpPercent =
    selectedCharacter.maxHp > 0
      ? (selectedCharacter.hp / selectedCharacter.maxHp) * 100
      : 0;

  const emptyStatClass = [
    styles["character-stats__stat--low"],
    styles["character-stats__stat"],
  ].join(" ");
  const getHpClass = () => {
    let className = styles["character-stats__stat--low"];
    if (hpPercent >= 25) className = styles["character-stats__stat--medium"];
    if (hpPercent > 75) className = styles["character-stats__stat--high"];
    return [className, styles["character-stats__stat"]].join(" ");
  };

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
      <div
        className={[
          styles["character-stats"],
          selectedCharacter.isDead
            ? styles["character-stats--disabled-like"]
            : "",
        ].join(" ")}
        {...restProps}
      >
        <div className={styles["character-stats__line"]}>
          <h3>
            {!selectedCharacter.isNpc && (
              <FontAwesomeIcon
                faIcon="user"
                faIconStyle={FaIconStyleEnum.SOLID}
                tooltip={translate("stats.player", "combatTracker")}
              />
            )}
            {selectedCharacter.name}
          </h3>
          {isCombatOngoing &&
            !selectedCharacter.isDying &&
            !selectedCharacter.isDead && (
              <ButtonWithIcon
                variant={ButtonVariant.FAB}
                label={translate("stats.play", "combatTracker")}
                faIcon="dice-d20"
                iconPosition="left"
                faIconStyle={FaIconStyleEnum.SOLID}
                type="button"
                onClick={() => {
                  setIsDrawerOpened(true);
                }}
              />
            )}
          {isCombatOngoing && selectedCharacter.isDying && (
            <ButtonWithIcon
              variant={ButtonVariant.SECONDARY}
              label={translate("stats.deathSaveFail", "combatTracker")}
              faIcon="heart-circle-minus"
              iconPosition="left"
              faIconStyle={FaIconStyleEnum.SOLID}
              type="button"
              onClick={onDeathSaveFail}
            />
          )}
        </div>

        {selectedCharacter.isDying && (
          <div className={styles["character-stats__line"]}>
            <FontAwesomeIcon
              faIcon="hand-holding-heart"
              faIconStyle={FaIconStyleEnum.SOLID}
              tooltip={translate("stats.dying", "combatTracker")}
            />
            {translate("stats.downDescription", "combatTracker")}{" "}
            {selectedCharacter.deathSaveThrowsLeft}
          </div>
        )}
        {selectedCharacter.isDead && (
          <div className={styles["character-stats__line"]}>
            <FontAwesomeIcon
              faIcon="skull"
              faIconStyle={FaIconStyleEnum.SOLID}
              tooltip={translate("stats.dead", "combatTracker")}
            />
            {translate("stats.dead", "combatTracker")}
          </div>
        )}

        <div className={styles["character-stats__line"]}>
          <p>
            <span>❤</span> {translate("stats.hp", "combatTracker")} :{" "}
            <span className={getHpClass()}>{+selectedCharacter.hp}</span> /{" "}
            {selectedCharacter.maxHp}
          </p>
          {typeof selectedCharacter.tempHp === "number" &&
            selectedCharacter.tempHp > 0 && (
              <p>
                <span>💙</span> {translate("stats.tempHp", "combatTracker")} :{" "}
                {+selectedCharacter.tempHp}
              </p>
            )}
          {typeof selectedCharacter.alternativeHp === "number" &&
            selectedCharacter.alternativeHp > 0 && (
              <p>
                <span>💙</span>{" "}
                {translate("stats.alternativeHp", "combatTracker")} :{" "}
                {+selectedCharacter.alternativeHp}
              </p>
            )}
          <p>
            <span>🛡️</span> {translate("stats.ac", "combatTracker")} :{" "}
            {+selectedCharacter.ac}
          </p>
          <p>
            <span>🎲</span> {translate("stats.initiative", "combatTracker")} :{" "}
            {selectedCharacter.initiativeScore}
          </p>
        </div>
        {selectedCharacter.spellSlotsLeft &&
          Object.entries(selectedCharacter.spellSlotsLeft).length > 0 && (
            <div
              className={[
                styles["character-stats__line--vertical"],
                styles["character-stats__line"],
              ].join(" ")}
            >
              <div>
                <FontAwesomeIcon
                  faIcon="wand-sparkles"
                  faIconStyle={FaIconStyleEnum.SOLID}
                />
                {translate("stats.spellSlots", "combatTracker")} :
              </div>
              <div className={styles["character-stats__line"]}>
                {Object.entries(selectedCharacter.spellSlotsLeft).map(
                  ([level, slots]) => (
                    <div
                      className={styles["character-stats__line--indented"]}
                      key={level}
                    >
                      {" "}
                      🔹 niv. {level} :{" "}
                      <span className={slots === 0 ? emptyStatClass : ""}>
                        {slots}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        {selectedCharacter.states && selectedCharacter.states.length > 0 && (
          <div
            className={[
              styles["character-stats__line--vertical"],
              styles["character-stats__line"],
            ].join(" ")}
          >
            <div>
              <FontAwesomeIcon
                faIcon="fire-flame-curved"
                faIconStyle={FaIconStyleEnum.SOLID}
              />
              {translate("form.states", "combatTracker")} :
            </div>
            <div
              className={[
                styles["character-stats__line"],
                styles["character-stats__line--vertical-content"],
              ].join(" ")}
            >
              {selectedCharacter.states.map((state) => (
                <div
                  className={styles["character-stats__line__subcontent"]}
                  key={state.id}
                >
                  <span>
                    {state.name}
                    {state.numberOfTurns !== undefined && (
                      <>
                        {" "}
                        {translate("stats.stateDuration", "combatTracker", {
                          duration: String(state.numberOfTurns),
                        })}
                      </>
                    )}
                    {state.saveThrowStat && <>, {state.saveThrowStat}</>}
                    {state.saveThrowDc !== undefined && (
                      <>
                        {state.saveThrowStat ? " " : ", "}
                        {translate("stats.saveDc", "combatTracker")}{" "}
                        {state.saveThrowDc}
                      </>
                    )}
                  </span>
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
      </div>
      <CustomDrawer
        isOpened={isDrawerOpened}
        onClose={() => setIsDrawerOpened(false)}
      >
        <AttackForm
          characters={characters!}
          selectedCharacter={selectedCharacter}
          onCharactersChange={(updatedCharacters) => {
            onCharactersChange(updatedCharacters);
            setIsDrawerOpened(false);
          }}
          onHistoryEdited={onHistoryEdited}
        />
      </CustomDrawer>
    </>
  );
};

export default CharacterStats;
