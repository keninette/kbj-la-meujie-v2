import { cx } from "@/app/_lib/class-names";
import type { InputHTMLAttributes } from "react";
import styles from "./number-input.module.scss";

type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  id: string;
  label: string;
  /** On the field (label + input), e.g. to highlight it */
  className?: string;
  /** On the input; the field (label + input) gets "<it>-field" */
  "data-testid"?: string;
};

const NumberInput = ({
  id,
  label,
  className,
  "data-testid": dataTestId,
  ...inputProps
}: NumberInputProps) => (
  <div
    className={cx(styles["number-input"], className)}
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
