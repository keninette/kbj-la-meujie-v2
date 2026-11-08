import type { CSSProperties } from "react";
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
} from "@/app/combat-tracker/_lib/ability.helper";
import HpBar from "../hp-bar/HpBar";
import styles from "../../character-stats.module.scss";

type StatsSectionProps = {
  character: CombatCharacter;
};

/**
 * Hit points, armor class, initiative, movement, and the ability modifiers
 * with the saving throws
 */
const StatsSection = ({ character }: StatsSectionProps) => {
  const hasAlternativeHp =
    typeof character.alternativeHp === "number" && character.alternativeHp > 0;
  const abilities = ABILITIES.filter(
    (ability) => typeof character.abilities?.[ability] === "number",
  );
  const hasSavingThrows = abilities.some(
    (ability) => typeof character.savingThrows?.[ability] === "number",
  );

  // Lost in this order: temporary, alternative, then normal hit points.
  // The temporary ones go on the first bar.
  return (
    <div className={styles["character-stats__tiles"]}>
      <Tile
        title={translate("stats.hitPoints", "combatTracker")}
        className={styles["character-stats__hp-tile"]}
      >
        <div className={styles["character-stats__hp-bars"]}>
          {hasAlternativeHp && (
            <HpBar
              label={translate("stats.alternativeHp", "combatTracker")}
              hp={character.alternativeHp ?? 0}
              maxHp={getMaxAlternativeHp(character) ?? 0}
              tempHp={character.tempHp}
              data-testid="alternative-hp-bar"
            />
          )}
          <HpBar
            label={translate("stats.hp", "combatTracker")}
            hp={+character.hp}
            maxHp={character.maxHp}
            tempHp={hasAlternativeHp ? undefined : character.tempHp}
            data-testid="hp-bar"
          />
        </div>
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
      {abilities.length > 0 && (
        <Tile
          title={translate("stats.abilities", "combatTracker")}
          className={styles["character-stats__abilities-tile"]}
          data-testid="abilities-tile"
        >
          {/* One column per ability, the row titles on the left */}
          <div
            className={styles["character-stats__abilities"]}
            style={{ "--abilities-count": abilities.length } as CSSProperties}
          >
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
