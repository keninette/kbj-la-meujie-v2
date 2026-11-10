"use client";

import { FaIconStyleEnum } from "@lib/enums/fa-icon.style.enum";
import styles from "./split-button.module.scss";
import { useState } from "react";
import { ButtonVariant } from "@lib/enums/button-variant.enum";
import { ButtonSize } from "@lib/enums/button-size.enum";
import { cx } from "@/app/_lib/class-names";

type SplitButtonOption = {
  label: string;
  onClick: () => void;
};

type SplitButtonProps = {
  options: SplitButtonOption[];
  faIcon?: string;
  faIconStyle?: FaIconStyleEnum;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const SplitButton = ({
  options,
  faIcon,
  faIconStyle = FaIconStyleEnum.REGULAR,
  variant = ButtonVariant.FAB,
  size = ButtonSize.M,
}: SplitButtonProps) => {
  const [selectedOption, setSelectedOption] = useState<SplitButtonOption>(
    options?.[0],
  );
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const splitButtonVariantClass = `split-button--${variant}`;

  return (
    <div
      className={cx(
        styles["split-button"],
        styles[splitButtonVariantClass],
        size === ButtonSize.XS && styles["split-button--xs"],
      )}
    >
      <div className={styles["split-button__buttons"]}>
        <div>
          <i
            className={`fa-${faIconStyle} fa-${faIcon} ${styles["split-button__buttons__icon"]}`}
          />
          <button
            className={`${styles["split-button__button"]} ${styles["split-button__buttons__label"]}`}
            onClick={selectedOption.onClick}
          >
            {selectedOption.label}
          </button>
        </div>
        <button
          className={styles["split-button__button"]}
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <i
            className={`fa-solid fa-chevron-down ${styles["split-button__buttons__chevron"]}`}
          />
        </button>
      </div>
      {showDropdown && (
        <ul className={styles["split-button__dropdown"]}>
          {options.map((option) => {
            return (
              <li
                key={`li_${option.label}`}
                className={styles["split-button__dropdown__label"]}
              >
                <i
                  className={`fa-${faIconStyle} fa-${faIcon} ${styles["split-button__buttons__icon"]}`}
                />
                <button
                  className={`${styles["split-button__button"]} ${styles["split-button__dropdown__label__text"]}`}
                  key={`button_${option.label}`}
                  onClick={() => {
                    setSelectedOption(option);
                    setShowDropdown(false);
                    option.onClick();
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SplitButton;
