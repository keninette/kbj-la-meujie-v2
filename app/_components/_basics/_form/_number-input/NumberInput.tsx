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
};

const NumberInput = ({
  id,
  label,
  className,
  ...inputProps
}: NumberInputProps) => (
  <div className={cx(styles["number-input"], className)}>
    <label htmlFor={id} className={styles["number-input__label"]}>
      {label}
    </label>
    <input
      type="number"
      id={id}
      className={styles["number-input__input"]}
      {...inputProps}
    />
  </div>
);

export default NumberInput;
