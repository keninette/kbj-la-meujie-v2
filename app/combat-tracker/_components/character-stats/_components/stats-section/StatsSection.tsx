import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import Tile from "@/app/_components/_basics/tile/Tile";
import { translate } from "@/app/_dictionaries/dictionnary";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { getMaxAlternativeHp } from "@/app/combat-tracker/_components/attack-form/attack-form.helper";
import HpBar from "../hp-bar/HpBar";
import styles from "../../character-stats.module.scss";

type StatsSectionProps = {
  character: CombatCharacter;
};

/** Hit points, armor class and initiative of the character */
const StatsSection = ({ character }: StatsSectionProps) => {
  const hasAlternativeHp =
    typeof character.alternativeHp === "number" && character.alternativeHp > 0;

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
    </div>
  );
};

export default StatsSection;
