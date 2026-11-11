import { CombatActionDamage } from "@/app/_lib/types/combat-action.type";
import { cx } from "@/app/_lib/class-names";
import { translate } from "@/app/_dictionaries/dictionnary";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";
import { DAMAGE_TYPE_ICON_URLS } from "@/app/combat-tracker/_lib/bg3-damage-types";
import { describeDamage } from "@/app/combat-tracker/_lib/combat-action.helper";
import styles from "./damage-text.module.scss";

type DamageTextProps = { damage: CombatActionDamage };

/** "1d6 (1d8)+FOR", then its type's icon and name, in its color, like in the game */
const DamageText = ({ damage }: DamageTextProps) => (
  <span className={styles["damage-text"]}>
    {describeDamage(damage)}
    {damage.type && (
      <>
        {/* Read as "1d4 Feu"; on screen, the gap separates them */}{" "}
        <CharacterPortrait
          src={DAMAGE_TYPE_ICON_URLS[damage.type]}
          alt=""
          width={12}
          height={12}
          className={styles["damage-text__icon"]}
        />
        <span
          className={cx(
            styles["damage-text__type"],
            styles[`damage-text__type--${damage.type}`],
          )}
        >
          {translate(`damageType.${damage.type}`, "combatTracker")}
        </span>
      </>
    )}
  </span>
);

export default DamageText;
