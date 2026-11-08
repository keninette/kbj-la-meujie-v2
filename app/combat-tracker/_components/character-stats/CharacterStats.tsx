import { cx } from "@/app/_lib/class-names";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import styles from "./character-stats.module.scss";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { useId, useState } from "react";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";
import { isDisplayableImageUrl } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.images";
import CustomDrawer from "@/app/_components/_basics/custom-drawer/CustomDrawer";
import AttackForm from "../attack-form/AttackForm";
import { getMaxAlternativeHp } from "../attack-form/attack-form.helper";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import ContainerBox from "@/app/_components/_basics/container-box/ContainerBox";
import Chip from "@/app/_components/_basics/chip/Chip";
import LinkWithIcon from "@/app/_components/_basics/link-with-icon/LinkWithIcon";
import { FaIconSizeEnum } from "@/app/_lib/enums/fa-icon.size.enum";
import ActionsList from "../actions-list/ActionsList";
import NpcAttitudeIcon from "../npc-attitude-icon/NpcAttitudeIcon";
import { describeState } from "@/app/combat-tracker/_lib/combat-state.helper";
import { getHpLevel, getHpPercent } from "@/app/combat-tracker/_lib/hp.helper";

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

  const hpPercent = getHpPercent(selectedCharacter);

  const emptyStatClass = cx(
    styles["character-stats__stat--low"],
    styles["character-stats__stat"],
  );
  const getHpClass = () =>
    cx(
      styles[`character-stats__stat--${getHpLevel(hpPercent)}`],
      styles["character-stats__stat"],
    );

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
        <header className={styles["character-stats__header"]}>
          <span className={styles["character-stats__picture-frame"]}>
            {isDisplayableImageUrl(selectedCharacter.imageUrl) ? (
              <CharacterPortrait
                src={selectedCharacter.imageUrl}
                alt={selectedCharacter.name}
                width={75}
                height={75}
                className={styles["character-stats__picture"]}
                data-testid="character-picture"
              />
            ) : (
              <span className={styles["character-stats__initial"]} aria-hidden>
                {selectedCharacter.name.trim().charAt(0).toUpperCase()}
              </span>
            )}
          </span>
          <div className={styles["character-stats__identity"]}>
            <h2 id={nameId} className={styles["character-stats__name"]}>
              {!selectedCharacter.isNpc && (
                <FontAwesomeIcon
                  faIcon="user"
                  faIconStyle={FaIconStyleEnum.SOLID}
                  faSize={FaIconSizeEnum.SM}
                  tooltip={translate("stats.player", "combatTracker")}
                />
              )}
              <span>{selectedCharacter.name}</span>
              {selectedCharacter.isNpc && selectedCharacter.attitude && (
                <Chip
                  label={translate(
                    `attitude.${selectedCharacter.attitude}`,
                    "combatTracker",
                  )}
                  icon={
                    <NpcAttitudeIcon attitude={selectedCharacter.attitude} />
                  }
                  tooltip={translate("form.attitude", "combatTracker")}
                  data-testid="character-attitude"
                />
              )}
            </h2>
            {selectedCharacter.shortDescription && (
              <p
                className={styles["character-stats__short-description"]}
                data-testid="character-short-description"
              >
                {selectedCharacter.shortDescription}
              </p>
            )}
            <span className={styles["character-stats__actions"]}>
              {selectedCharacter.wikiLink && (
                <LinkWithIcon
                  href={selectedCharacter.wikiLink}
                  title={translate("list.wiki", "combatTracker")}
                  faIcon="arrow-up-right-from-square"
                  faIconStyle={FaIconStyleEnum.SOLID}
                  openInNewTab
                  data-testid="character-stats-wiki-link"
                />
              )}
              {onEdit && (
                <IconButton
                  variant={ButtonVariant.TERTIARY}
                  faIcon="pen"
                  faIconStyle={FaIconStyleEnum.SOLID}
                  tooltip={translate("list.edit", "combatTracker")}
                  onClick={() => onEdit(selectedCharacter)}
                  data-testid="character-stats-edit"
                />
              )}
              {onDeactivate && (
                <IconButton
                  variant={ButtonVariant.TERTIARY}
                  faIcon="user-minus"
                  faIconStyle={FaIconStyleEnum.SOLID}
                  tooltip={translate("list.deactivate", "combatTracker")}
                  onClick={() => onDeactivate(selectedCharacter)}
                  data-testid="character-stats-deactivate"
                />
              )}
            </span>
          </div>
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
        </header>

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
                {+selectedCharacter.alternativeHp} /{" "}
                {getMaxAlternativeHp(selectedCharacter)}
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
              className={cx(
                styles["character-stats__line--vertical"],
                styles["character-stats__line"],
              )}
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
                  ([name, slots]) => (
                    <div
                      className={styles["character-stats__line--indented"]}
                      key={name}
                    >
                      {" "}
                      ✨ {name} :{" "}
                      <span className={slots === 0 ? emptyStatClass : ""}>
                        {slots}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        {selectedCharacter.passives &&
          selectedCharacter.passives.length > 0 && (
            <div
              className={cx(
                styles["character-stats__line--vertical"],
                styles["character-stats__line"],
              )}
              data-testid="character-passives"
            >
              <div>
                <FontAwesomeIcon
                  faIcon="book-open"
                  faIconStyle={FaIconStyleEnum.SOLID}
                />
                {translate("stats.passives", "combatTracker")} :
              </div>
              <div className={styles["character-stats__line"]}>
                {selectedCharacter.passives.map((passive, index) => (
                  <div
                    className={styles["character-stats__line--indented"]}
                    key={`${passive}-${index}`}
                  >
                    ⚫ {passive}
                  </div>
                ))}
              </div>
            </div>
          )}
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
