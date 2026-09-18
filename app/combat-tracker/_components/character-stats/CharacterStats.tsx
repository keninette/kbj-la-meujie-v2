import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { CombatCharacter, CombatHistoryEntry } from "../../page";
import styles from "./character-stats.module.scss";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { useEffect, useState } from "react";
import CustomDrawer from "@/app/_components/drawer/CustomDrawer";
import AttackForm from "../attack-form/AttackForm";

type CharacterStatsProps = {
  characters?: CombatCharacter[];
  selectedCharacter: CombatCharacter;
  onCharacterChange: (character: CombatCharacter) => void;
  onHistoryEdited: (historyEntry: string[]) => void;
  [key: string]: unknown;
};

const CharacterStats = ({
  selectedCharacter,
  characters,
  onCharacterChange,
  onHistoryEdited,
  combatCurrentTurn,
  ...restProps
}: CharacterStatsProps) => {
  const [character, setCharacter] =
    useState<CombatCharacter>(selectedCharacter);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const hpPercent =
    character?.maxHp > 0 ? (character?.hp / character?.maxHp) * 100 : 0;

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

  const onRevive = () => {
    const updatedCharacter = { ...character };
    updatedCharacter.hp = 1;
    updatedCharacter.isDead = false;
    updatedCharacter.isDying = false;
    updatedCharacter.deathSaveThrowsLeft = 3;
    setCharacter(updatedCharacter);
  };

  const onDeathSaveFail = () => {
    const updatedCharacter = { ...character };
    if (updatedCharacter.deathSaveThrowsLeft > 0) {
      updatedCharacter.deathSaveThrowsLeft -= 1;
    }

    if (updatedCharacter.deathSaveThrowsLeft <= 0) {
      updatedCharacter.isDead = true;
      updatedCharacter.isDying = false;
      updatedCharacter.deathSaveThrowsLeft = 3;
    }

    setCharacter(updatedCharacter);
  };

  useEffect(() => {
    onCharacterChange(character);
  }, [character]);

  useEffect(() => {
    setCharacter(selectedCharacter);
  }, [selectedCharacter]);

  return (
    <>
      <div
        className={[
          styles["character-stats"],
          character?.isDead ? styles["character-stats--disabled-like"] : "",
        ].join(" ")}
        {...restProps}
      >
        <div className={styles["character-stats__line"]}>
          <h3 className={styles["character-stats__line"]}>
            {character.isDying && <>💀 </>}
            {character.isDead && <>☠️ </>}
            {character?.name}
          </h3>
          {!character.isDying && !character.isDead && (
            <ButtonWithIcon
              variant={ButtonVariant.FAB}
              label="Jouer"
              faIcon="dice-d20"
              iconPosition="left"
              faIconStyle={FaIconStyleEnum.SOLID}
              type="button"
              onClick={() => {
                setIsDrawerOpened(true);
              }}
            />
          )}
          {(character.isDying || character.isDead) && (
            <ButtonWithIcon
              variant={ButtonVariant.FAB}
              label="Relever"
              faIcon="hand-holding-medical"
              iconPosition="left"
              faIconStyle={FaIconStyleEnum.SOLID}
              type="button"
              onClick={onRevive}
            />
          )}
          {character.isDying && (
            <ButtonWithIcon
              variant={ButtonVariant.SECONDARY}
              label="Rater un jet de sauvegarde"
              faIcon="heart-circle-minus"
              iconPosition="left"
              faIconStyle={FaIconStyleEnum.SOLID}
              type="button"
              onClick={onDeathSaveFail}
            />
          )}
        </div>
        <div className={styles["character-stats__line"]}>
          <p>
            <span className={styles["character-stats__line__icon"]}>💉</span> PV
            : <span className={getHpClass()}>{+character?.hp}</span> /{" "}
            {character?.maxHp}
          </p>
          <p>
            <span className={styles["character-stats__line__icon"]}>🛡️</span> CA
            : {+character?.ac}
          </p>
          <p>
            <span className={styles["character-stats__line__icon"]}>🎲</span>{" "}
            Initiative : {character?.initiativeScore}
          </p>
        </div>
        {character?.spellSlotsLeft &&
          Object.entries(character?.spellSlotsLeft).length > 0 && (
            <div
              className={[
                styles["character-stats__line--vertical"],
                styles["character-stats__line"],
              ].join(" ")}
            >
              <p>
                <span className={styles["character-stats__line__icon"]}>
                  🧙‍♂️
                </span>{" "}
                Emplacements de sorts :
              </p>
              <div className={styles["character-stats__line"]}>
                {Object.entries(character?.spellSlotsLeft).map(
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
        <div className={styles["character-stats__line"]}>
          {character.isDying && (
            <>
              💀 À terre, jet(s) de sauvegarde contre la mort restant(s) :{" "}
              {character.deathSaveThrowsLeft}
            </>
          )}
        </div>
        {character.states && character.states.length > 0 && (
          <div
            className={[
              styles["character-stats__line--vertical"],
              styles["character-stats__line"],
            ].join(" ")}
          >
            <div className={styles["character-stats__line"]}>
              {character.states.map((state) => (
                <div
                  className={styles["character-stats__line"]}
                  key={state.name}
                >
                  {state.name} pendant {state.numberOfTurns ?? "-"} tours,{" "}
                  {state.saveThrowStat ?? "-"} DD {state.saveThrowDc ?? "-"}
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
          selectedCharacter={character}
          onCharacterChange={(character: CombatCharacter) => {
            onCharacterChange(character);
            setIsDrawerOpened(false);
          }}
          onHistoryEdited={onHistoryEdited}
        />
      </CustomDrawer>
    </>
  );
};

export default CharacterStats;
