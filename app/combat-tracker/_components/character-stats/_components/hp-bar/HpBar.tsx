import { cx } from "@/app/_lib/class-names";
import { translate } from "@/app/_dictionaries/dictionnary";
import { getHpLevel, getHpPercent } from "@/app/combat-tracker/_lib/hp.helper";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import styles from "./hp-bar.module.scss";

type HpBarProps = {
  /** Not shown (the tile title says it): names the bar for screen readers */
  label: string;
  hp: number;
  maxHp: number;
  /** Lost first: drawn before the hit points, and may go over the max */
  tempHp?: number;
  /** Adds a button, e.g. to show other hit points */
  onSwitch?: () => void;
  switchTooltip?: string;
  "data-testid"?: string;
};

/** Hit points left out of the max, as a number and a bar */
const HpBar = ({
  label,
  hp,
  maxHp,
  tempHp = 0,
  onSwitch,
  switchTooltip,
  "data-testid": dataTestId,
}: HpBarProps) => {
  const temp = Math.max(tempHp, 0);
  const current = Math.max(hp, 0);
  // With temporary hit points, the total may be over the max: the bar then
  // shows the total, so that nothing overflows
  const scale = Math.max(maxHp, current + temp, 1);
  const level = getHpLevel(getHpPercent({ hp: current, maxHp }));

  return (
    <div
      className={styles["hp-bar"]}
      role="group"
      aria-label={label}
      data-testid={dataTestId}
    >
      {/* Changes with the hit points shown: fades in again on switch */}
      <span className={styles["hp-bar__header"]} key={label}>
        <span className={styles["hp-bar__amount"]}>
          <span className={styles["hp-bar__value"]}>
            <strong className={styles[`hp-bar__value--${level}`]}>{hp}</strong>{" "}
            / {maxHp}
          </span>
          {temp > 0 && (
            <span
              className={styles["hp-bar__temp"]}
              data-testid={dataTestId && `${dataTestId}-temp`}
            >
              {translate("stats.tempHpBonus", "combatTracker", {
                count: String(temp),
              })}
            </span>
          )}
        </span>
        {onSwitch && (
          <button
            type="button"
            className={styles["hp-bar__switch"]}
            title={switchTooltip}
            aria-label={switchTooltip}
            onClick={onSwitch}
            data-testid={dataTestId && `${dataTestId}-switch`}
          >
            <FontAwesomeIcon
              faIcon="right-left"
              faIconStyle={FaIconStyleEnum.SOLID}
              aria-hidden
            />
          </button>
        )}
      </span>
      <span className={styles["hp-bar__track"]} aria-hidden>
        {/* Always there, so that it grows and shrinks smoothly */}
        <span
          className={cx(styles["hp-bar__fill"], styles["hp-bar__fill--temp"])}
          style={{ width: `${(temp / scale) * 100}%` }}
        />
        <span
          className={cx(
            styles["hp-bar__fill"],
            styles[`hp-bar__fill--${level}`],
          )}
          style={{ width: `${(current / scale) * 100}%` }}
        />
      </span>
    </div>
  );
};

export default HpBar;
