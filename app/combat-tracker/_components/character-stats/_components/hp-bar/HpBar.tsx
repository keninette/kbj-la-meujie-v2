import { cx } from "@/app/_lib/class-names";
import { translate } from "@/app/_dictionaries/dictionnary";
import { getHpLevel, getHpPercent } from "@/app/combat-tracker/_lib/hp.helper";
import styles from "./hp-bar.module.scss";

type HpBarProps = {
  /** Shown above the end of the bar */
  label: string;
  hp: number;
  maxHp: number;
  /** Lost first: drawn before the hit points, and may go over the max */
  tempHp?: number;
  "data-testid"?: string;
};

/** Hit points left out of the max, as a number and a bar */
const HpBar = ({
  label,
  hp,
  maxHp,
  tempHp = 0,
  "data-testid": dataTestId,
}: HpBarProps) => {
  const temp = Math.max(tempHp, 0);
  const current = Math.max(hp, 0);
  // With temporary hit points, the total may be over the max: the bar then
  // shows the total, so that nothing overflows
  const scale = Math.max(maxHp, current + temp, 1);
  const level = getHpLevel(getHpPercent({ hp: current, maxHp }));

  return (
    <div className={styles["hp-bar"]} data-testid={dataTestId}>
      <span className={styles["hp-bar__header"]}>
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
        <span className={styles["hp-bar__label"]}>{label}</span>
      </span>
      <span className={styles["hp-bar__track"]} aria-hidden>
        {temp > 0 && (
          <span
            className={cx(styles["hp-bar__fill"], styles["hp-bar__fill--temp"])}
            style={{ width: `${(temp / scale) * 100}%` }}
          />
        )}
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
