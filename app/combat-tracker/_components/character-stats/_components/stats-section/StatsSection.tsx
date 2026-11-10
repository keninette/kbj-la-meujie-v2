import { useState, type CSSProperties } from "react";
import { cx } from "@/app/_lib/class-names";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import Tile from "@/app/_components/_basics/tile/Tile";
import { translate } from "@/app/_dictionaries/dictionnary";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { getMaxAlternativeHp } from "@/app/combat-tracker/_components/attack-form/attack-form.helper";
import { ABILITIES } from "@/app/_lib/enums/ability.enum";
import {
  formatModifier,
  getAbilityModifier,
  getInitiativeBonus,
} from "@/app/combat-tracker/_lib/ability.helper";
import HpBar from "../hp-bar/HpBar";
import DeathSaves from "../death-saves/DeathSaves";
import styles from "../../character-stats.module.scss";

type StatsSectionProps = {
  character: CombatCharacter;
  /** Adds the button to fail a death saving throw, e.g. during the combat */
  onDeathSaveFail?: () => void;
};

/**
 * Hit points (or the death saving throws of a downed character), armor
 * class, initiative, movement, and the ability modifiers with the saving
 * throws
 */
const StatsSection = ({ character, onDeathSaveFail }: StatsSectionProps) => {
  const hasAlternativeHp =
    typeof character.alternativeHp === "number" && character.alternativeHp > 0;
  // The alternative hit points are shown first, the regular ones on demand.
  // Kept per character: selecting another one shows its alternative ones.
  const [regularHpShownFor, setRegularHpShownFor] = useState<string>();
  const showAlternativeHp =
    hasAlternativeHp && regularHpShownFor !== character.id;
  const abilities = ABILITIES.filter(
    (ability) => typeof character.abilities?.[ability] === "number",
  );
  const hasSavingThrows = abilities.some(
    (ability) => typeof character.savingThrows?.[ability] === "number",
  );
  const initiativeBonus = getInitiativeBonus(character);
  const hasInitiativeBonus = initiativeBonus !== undefined;

  // Lost in this order: temporary, alternative, then normal hit points.
  // The temporary ones always go on the alternative bar when there are
  // alternative hit points, even while the regular bar is shown.
  return (
    <div className={styles["character-stats__tiles"]}>
      <Tile
        title={translate(
          character.isDying
            ? "stats.deathSaves"
            : showAlternativeHp
              ? "stats.alternativeHitPoints"
              : "stats.hitPoints",
          "combatTracker",
        )}
        className={styles["character-stats__hp-tile"]}
      >
        {/* Down: no hit points left to show */}
        {character.isDying ? (
          <DeathSaves
            savesLeft={character.deathSaveThrowsLeft}
            onFail={onDeathSaveFail}
          />
        ) : showAlternativeHp ? (
          <HpBar
            label={translate("stats.alternativeHp", "combatTracker")}
            hp={character.alternativeHp ?? 0}
            maxHp={getMaxAlternativeHp(character) ?? 0}
            tempHp={character.tempHp}
            onSwitch={() => setRegularHpShownFor(character.id)}
            switchTooltip={translate("stats.showHp", "combatTracker")}
            data-testid="alternative-hp-bar"
          />
        ) : (
          <HpBar
            label={translate("stats.hp", "combatTracker")}
            hp={+character.hp}
            maxHp={character.maxHp}
            tempHp={hasAlternativeHp ? undefined : character.tempHp}
            onSwitch={
              hasAlternativeHp
                ? () => setRegularHpShownFor(undefined)
                : undefined
            }
            switchTooltip={translate(
              "stats.showAlternativeHp",
              "combatTracker",
            )}
            data-testid="hp-bar"
          />
        )}
      </Tile>
      <Tile
        title={translate("stats.ac", "combatTracker")}
        data-testid="ac-tile"
      >
        <span className={styles["character-stats__tile-value"]}>
          <FontAwesomeIcon
            faIcon="shield-halved"
            faIconStyle={FaIconStyleEnum.SOLID}
            className={styles["character-stats__tile-icon"]}
            aria-hidden
          />
          {+character.ac}
        </span>
      </Tile>
      <Tile
        title={translate("stats.initiative", "combatTracker")}
        data-testid="initiative-tile"
      >
        <span className={styles["character-stats__tile-value"]}>
          <FontAwesomeIcon
            faIcon="dice-d20"
            faIconStyle={FaIconStyleEnum.SOLID}
            className={styles["character-stats__tile-icon"]}
            aria-hidden
          />
          {character.initiativeScore}
        </span>
      </Tile>
      {!!character.movement && (
        <Tile
          title={translate("stats.movement", "combatTracker")}
          data-testid="movement-tile"
        >
          <span className={styles["character-stats__tile-value"]}>
            <FontAwesomeIcon
              faIcon="person-running"
              faIconStyle={FaIconStyleEnum.SOLID}
              className={styles["character-stats__tile-icon"]}
              aria-hidden
            />
            {translate("stats.movementValue", "combatTracker", {
              movement: String(character.movement),
            })}
          </span>
        </Tile>
      )}
      {typeof character.proficiencyBonus === "number" && (
        <Tile
          title={translate("stats.proficiencyBonus", "combatTracker")}
          data-testid="proficiency-bonus-tile"
        >
          <span
            className={styles["character-stats__tile-value"]}
            title={translate("stats.proficiencyBonusTooltip", "combatTracker")}
          >
            <FontAwesomeIcon
              faIcon="medal"
              faIconStyle={FaIconStyleEnum.SOLID}
              className={styles["character-stats__tile-icon"]}
              aria-hidden
            />
            {formatModifier(character.proficiencyBonus)}
          </span>
        </Tile>
      )}
      {abilities.length > 0 && (
        <Tile
          title={translate("stats.abilities", "combatTracker")}
          className={styles["character-stats__abilities-tile"]}
          data-testid="abilities-tile"
        >
          {/*
           * One column per ability, the row titles on the left, then the
           * initiative bonus after a separator
           */}
          <div
            className={cx(
              styles["character-stats__abilities"],
              hasInitiativeBonus &&
                styles["character-stats__abilities--with-initiative"],
            )}
            style={
              {
                "--abilities-count": abilities.length,
                "--abilities-rows": hasSavingThrows ? 3 : 2,
              } as CSSProperties
            }
          >
            {hasInitiativeBonus && (
              <span
                className={styles["character-stats__abilities-separator"]}
                aria-hidden
              />
            )}
            <span />
            {abilities.map((ability) => (
              <abbr
                key={ability}
                className={styles["character-stats__ability-name"]}
                title={translate(`ability.${ability}.name`, "combatTracker")}
              >
                {translate(`ability.${ability}`, "combatTracker")}
              </abbr>
            ))}
            {hasInitiativeBonus && (
              <abbr
                className={styles["character-stats__ability-name"]}
                title={translate("stats.initiativeBonus.name", "combatTracker")}
              >
                {translate("stats.initiativeBonus", "combatTracker")}
              </abbr>
            )}
            <span />
            {abilities.map((ability) => (
              <span
                key={ability}
                className={styles["character-stats__ability-modifier"]}
                data-testid={`ability-${ability}`}
              >
                {formatModifier(
                  getAbilityModifier(character.abilities![ability]!),
                )}
              </span>
            ))}
            {hasInitiativeBonus && (
              <span
                className={styles["character-stats__ability-modifier"]}
                data-testid="initiative-bonus"
              >
                {formatModifier(initiativeBonus)}
              </span>
            )}
            {hasSavingThrows && (
              <>
                <abbr
                  className={cx(
                    styles["character-stats__ability-name"],
                    styles["character-stats__abilities-row-title"],
                  )}
                  title={translate("stats.savingThrows.name", "combatTracker")}
                >
                  {translate("stats.savingThrows", "combatTracker")}
                </abbr>
                {abilities.map((ability) => {
                  const savingThrow = character.savingThrows?.[ability];
                  return (
                    <span
                      key={ability}
                      className={styles["character-stats__saving-throw"]}
                      data-testid={`saving-throw-${ability}`}
                    >
                      {typeof savingThrow === "number" &&
                        formatModifier(savingThrow)}
                    </span>
                  );
                })}
              </>
            )}
          </div>
        </Tile>
      )}
    </div>
  );
};

export default StatsSection;
