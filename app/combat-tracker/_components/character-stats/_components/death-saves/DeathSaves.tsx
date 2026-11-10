import { useState } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Tooltip from "@mui/material/Tooltip";
import { cx } from "@/app/_lib/class-names";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import styles from "./death-saves.module.scss";

/** A character is stabilized after three successful death saving throws */
const DEATH_SAVES_COUNT = 3;

type DeathSavesProps = {
  /** Successes still needed */
  savesLeft: number;
  /** Both given, e.g. during the combat only: the next save can be recorded */
  onSuccess?: () => void;
  onFail?: () => void;
};

/**
 * The death saving throws of a downed character, successful ones first.
 * Clicking the next one asks whether it succeeded or failed.
 */
const DeathSaves = ({ savesLeft, onSuccess, onFail }: DeathSavesProps) => {
  const [isChoiceOpened, setIsChoiceOpened] = useState(false);
  const successes = DEATH_SAVES_COUNT - savesLeft;
  const canRecord = onSuccess !== undefined && onFail !== undefined;

  const record = (onRecord: () => void) => {
    setIsChoiceOpened(false);
    onRecord();
  };

  const choices = (
    <span className={styles["death-saves__choices"]}>
      <button
        type="button"
        className={cx(
          styles["death-saves__save"],
          styles["death-saves__save--button"],
          styles["death-saves__save--success"],
        )}
        title={translate("stats.deathSaveSuccess", "combatTracker")}
        aria-label={translate("stats.deathSaveSuccess", "combatTracker")}
        onClick={() => record(onSuccess!)}
        data-testid="death-save-choice-success"
      >
        <FontAwesomeIcon
          faIcon="check"
          faIconStyle={FaIconStyleEnum.SOLID}
          aria-hidden
        />
      </button>
      <button
        type="button"
        className={cx(
          styles["death-saves__save"],
          styles["death-saves__save--button"],
          styles["death-saves__save--fail"],
        )}
        title={translate("stats.deathSaveFail", "combatTracker")}
        aria-label={translate("stats.deathSaveFail", "combatTracker")}
        onClick={() => record(onFail!)}
        data-testid="death-save-choice-fail"
      >
        <FontAwesomeIcon
          faIcon="xmark"
          faIconStyle={FaIconStyleEnum.SOLID}
          aria-hidden
        />
      </button>
    </span>
  );

  return (
    <span
      className={styles["death-saves"]}
      role="group"
      aria-label={translate("stats.deathSavesLeft", "combatTracker", {
        count: String(savesLeft),
      })}
      data-testid="death-saves"
    >
      {Array.from({ length: DEATH_SAVES_COUNT }, (_, index) => {
        if (index < successes) {
          return (
            <span
              key={index}
              className={cx(
                styles["death-saves__save"],
                styles["death-saves__save--success"],
              )}
              data-testid="death-save-success"
            >
              <FontAwesomeIcon
                faIcon="check"
                faIconStyle={FaIconStyleEnum.SOLID}
                aria-hidden
              />
            </span>
          );
        }

        // Only the next save can be recorded, so they fill in order
        if (index === successes && canRecord) {
          return (
            <ClickAwayListener
              key={index}
              onClickAway={() => setIsChoiceOpened(false)}
            >
              {/* Holds the tooltip too: a click in it is not "away" */}
              <span className={styles["death-saves__next"]}>
                <Tooltip
                  open={isChoiceOpened}
                  onClose={() => setIsChoiceOpened(false)}
                  title={choices}
                  arrow
                  placement="top"
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  slotProps={{
                    popper: { disablePortal: true },
                    tooltip: { className: styles["death-saves__tooltip"] },
                    arrow: { className: styles["death-saves__tooltip-arrow"] },
                  }}
                >
                  <button
                    type="button"
                    className={cx(
                      styles["death-saves__save"],
                      styles["death-saves__save--button"],
                    )}
                    // No title: MUI forbids it on the child of a Tooltip
                    aria-label={translate(
                      "stats.deathSaveRecord",
                      "combatTracker",
                    )}
                    aria-expanded={isChoiceOpened}
                    onClick={() => setIsChoiceOpened((opened) => !opened)}
                    data-testid="death-save-next"
                  />
                </Tooltip>
              </span>
            </ClickAwayListener>
          );
        }

        return (
          <span
            key={index}
            className={styles["death-saves__save"]}
            data-testid="death-save-left"
          />
        );
      })}
    </span>
  );
};

export default DeathSaves;
