import { cx } from "@/app/_lib/class-names";
import type { InputHTMLAttributes } from "react";
import styles from "./number-input.module.scss";

type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  id: string;
  label: string;
  /** Draws attention to the field, e.g. just imported from the wiki */
  isHighlighted?: boolean;
  /** On the input; the field (label + input) gets "<it>-field" */
  "data-testid"?: string;
};

const NumberInput = ({
  id,
  label,
  isHighlighted = false,
  "data-testid": dataTestId,
  ...inputProps
}: NumberInputProps) => (
  <div
    className={cx(
      styles["number-input"],
      isHighlighted && styles["number-input--highlighted"],
    )}
    data-testid={dataTestId && `${dataTestId}-field`}
  >
    <label htmlFor={id} className={styles["number-input__label"]}>
      {label}
    </label>
    <input
      type="number"
      id={id}
      className={styles["number-input__input"]}
      {...inputProps}
      data-testid={dataTestId}
    />
  </div>
);

export default NumberInput;
