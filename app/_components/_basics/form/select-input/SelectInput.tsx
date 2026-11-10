import { cx } from "@/app/_lib/class-names";
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
  /** On the select; the field (label + select) gets "<it>-field" */
  "data-testid"?: string;
  children: ReactNode;
};

const SelectInput = ({
  id,
  label,
  className,
  "data-testid": dataTestId,
  children,
  ...selectProps
}: SelectInputProps) => (
  <div
    className={cx(styles["select-input"], className)}
    data-testid={dataTestId && `${dataTestId}-field`}
  >
    <label htmlFor={id} className={styles["select-input__label"]}>
      {label}
    </label>
    <select
      id={id}
      className={styles["select-input__input"]}
      {...selectProps}
      data-testid={dataTestId}
    >
      {children}
    </select>
  </div>
);

export default SelectInput;
