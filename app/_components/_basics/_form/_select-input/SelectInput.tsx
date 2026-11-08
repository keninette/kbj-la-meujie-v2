import type { ReactNode, SelectHTMLAttributes } from "react";
import styles from "./select-input.module.scss";

type SelectInputProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "className"
> & {
  id: string;
  label: string;
  /** On the field (label + select), e.g. to highlight it */
  className?: string;
  children: ReactNode;
};

const SelectInput = ({
  id,
  label,
  className,
  children,
  ...selectProps
}: SelectInputProps) => (
  <div
    className={[styles["select-input"], className].filter(Boolean).join(" ")}
  >
    <label htmlFor={id} className={styles["select-input__label"]}>
      {label}
    </label>
    <select id={id} className={styles["select-input__input"]} {...selectProps}>
      {children}
    </select>
  </div>
);

export default SelectInput;
