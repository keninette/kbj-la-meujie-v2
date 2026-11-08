import Chip from "@/app/_components/_basics/chip/Chip";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import Tile from "@/app/_components/_basics/tile/Tile";
import { translate } from "@/app/_dictionaries/dictionnary";
import { cx } from "@/app/_lib/class-names";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import styles from "../../character-stats.module.scss";

type SpellSlotsSectionProps = {
  spellSlotsLeft?: Record<string, number>;
};

/** "1" -> a spell slot of level 1, "wldshp" -> another resource */
const isSpellLevel = (name: string) => /^\d+$/.test(name);

/**
 * The spell slots left, as chips: the level in a square, then the count.
 * Other resources (e.g. "wldshp") show a wand and their name instead.
 */
const SpellSlotsSection = ({ spellSlotsLeft = {} }: SpellSlotsSectionProps) => {
  const slots = Object.entries(spellSlotsLeft);
  if (slots.length === 0) {
    return null;
  }

  return (
    <Tile
      title={translate("stats.spells", "combatTracker")}
      data-testid="character-spell-slots"
    >
      <ul className={styles["character-stats__chips"]}>
        {slots.map(([name, count]) => {
          const isLevel = isSpellLevel(name);
          return (
            <li key={name}>
              <Chip
                label={isLevel ? String(count) : `${name} ${count}`}
                tooltip={
                  isLevel
                    ? translate("stats.spellSlotLevel", "combatTracker", {
                        level: name,
                      })
                    : name
                }
                icon={
                  isLevel ? (
                    <span
                      className={styles["character-stats__spell-level"]}
                      aria-hidden
                    >
                      {name}
                    </span>
                  ) : (
                    <FontAwesomeIcon
                      faIcon="wand-sparkles"
                      faIconStyle={FaIconStyleEnum.SOLID}
                      className={styles["character-stats__tile-icon"]}
                      aria-hidden
                    />
                  )
                }
                className={cx(
                  count === 0 && styles["character-stats__chip--empty"],
                )}
                data-testid={`spell-slot-${name}`}
              />
            </li>
          );
        })}
      </ul>
    </Tile>
  );
};

export default SpellSlotsSection;
