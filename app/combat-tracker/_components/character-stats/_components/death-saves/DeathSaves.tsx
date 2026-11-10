import { cx } from "@/app/_lib/class-names";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { ButtonSize } from "@/app/_lib/enums/button-size.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import styles from "./death-saves.module.scss";

/** A character dies on the third failed death saving throw */
const DEATH_SAVES_COUNT = 3;

type DeathSavesProps = {
  savesLeft: number;
  /** Adds the button to fail a save, e.g. during the combat only */
  onFail?: () => void;
};

/** The death saving throws of a downed character: failed ones first */
const DeathSaves = ({ savesLeft, onFail }: DeathSavesProps) => {
  const failures = DEATH_SAVES_COUNT - savesLeft;

  return (
    <div className={styles["death-saves"]}>
      <span
        className={styles["death-saves__track"]}
        role="img"
        aria-label={translate("stats.deathSavesLeft", "combatTracker", {
          count: String(savesLeft),
        })}
        data-testid="death-saves"
      >
        {Array.from({ length: DEATH_SAVES_COUNT }, (_, index) => {
          const isFailed = index < failures;
          return (
            <span
              key={index}
              className={cx(
                styles["death-saves__save"],
                isFailed && styles["death-saves__save--failed"],
              )}
              data-testid={isFailed ? "death-save-failed" : "death-save-left"}
            >
              {isFailed && (
                <FontAwesomeIcon
                  faIcon="xmark"
                  faIconStyle={FaIconStyleEnum.SOLID}
                  aria-hidden
                />
              )}
            </span>
          );
        })}
      </span>
      {onFail && (
        <ButtonWithIcon
          variant={ButtonVariant.SECONDARY}
          size={ButtonSize.XS}
          label={translate("stats.deathSaveFail", "combatTracker")}
          faIcon="heart-crack"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          type="button"
          onClick={onFail}
          data-testid="death-save-fail"
        />
      )}
    </div>
  );
};

export default DeathSaves;
