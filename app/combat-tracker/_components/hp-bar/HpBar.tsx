import { cx } from "@/app/_lib/class-names";
import { translate } from "@/app/_dictionaries/dictionnary";
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
  /** Only the thinner bar: the values are in its label and tooltip */
  isCompact?: boolean;
  "data-testid"?: string;
};

type HpLevel = "low" | "medium" | "high";

/** Color of the hit points: under 25 % low, over 75 % high */
const getHpLevel = (hpPercent: number): HpLevel => {
  if (hpPercent > 75) {
    return "high";
  }
  return hpPercent >= 25 ? "medium" : "low";
};

/** Hit points left out of the max, as a number and a bar */
const HpBar = ({
  label,
  hp,
  maxHp,
  tempHp = 0,
  onSwitch,
  switchTooltip,
  isCompact = false,
  "data-testid": dataTestId,
}: HpBarProps) => {
  const temp = Math.max(tempHp, 0);
  const current = Math.max(hp, 0);
  // With temporary hit points, the total may be over the max: the bar then
  // shows the total, so that nothing overflows
  const scale = Math.max(maxHp, current + temp, 1);
  // 0 % when the max is unknown
  const level = getHpLevel(maxHp > 0 ? (current / maxHp) * 100 : 0);
  const tempHpBonus = translate("stats.tempHpBonus", "combatTracker", {
    count: String(temp),
  });
  // e.g. "PV : 12 / 20 (+ 5 PV temporaires)"
  const summary = isCompact
    ? translate("stats.hpSummary", "combatTracker", {
        label,
        hp: String(hp),
        maxHp: String(maxHp),
      }) + (temp > 0 ? ` (${tempHpBonus})` : "")
    : undefined;

  return (
    <div
      className={cx(styles["hp-bar"], isCompact && styles["hp-bar--compact"])}
      role="group"
      aria-label={summary ?? label}
      title={summary}
      data-testid={dataTestId}
    >
      {/* Changes with the hit points shown: fades in again on switch */}
      {!isCompact && (
        <span className={styles["hp-bar__header"]} key={label}>
          <span className={styles["hp-bar__amount"]}>
            <span className={styles["hp-bar__value"]}>
              <strong
                className={cx(
                  styles["hp-bar__current"],
                  styles[`hp-bar__current--${level}`],
                )}
              >
                {hp}
              </strong>{" "}
              / {maxHp}
            </span>
            {temp > 0 && (
              <span
                className={styles["hp-bar__temp"]}
                data-testid={dataTestId && `${dataTestId}-temp`}
              >
                {tempHpBonus}
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
      )}
      <span className={styles["hp-bar__track"]} aria-hidden>
        {/* Always there, so that it grows and shrinks smoothly */}
        <span
          className={cx(styles["hp-bar__fill"], styles["hp-bar__fill--temp"])}
          style={{ width: `${(temp / scale) * 100}%` }}
          data-testid={dataTestId && `${dataTestId}-fill-temp`}
        />
        <span
          className={cx(
            styles["hp-bar__fill"],
            styles[`hp-bar__fill--${level}`],
          )}
          style={{ width: `${(current / scale) * 100}%` }}
          data-testid={dataTestId && `${dataTestId}-fill`}
        />
      </span>
    </div>
  );
};

export default HpBar;
