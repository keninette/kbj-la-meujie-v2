import type { InputHTMLAttributes } from "react";
import styles from "./checkbox-input.module.scss";

type CheckboxInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  id: string;
  label: string;
  className?: string;
};

const CheckboxInput = ({
  id,
  label,
  className,
  ...inputProps
}: CheckboxInputProps) => (
  <label
    htmlFor={id}
    className={[styles["checkbox-input"], className].filter(Boolean).join(" ")}
  >
    <input
      type="checkbox"
      id={id}
      className={styles["checkbox-input__input"]}
      {...inputProps}
    />
    {label}
  </label>
);

export default CheckboxInput;
