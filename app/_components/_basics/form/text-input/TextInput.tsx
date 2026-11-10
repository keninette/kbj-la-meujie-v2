import { cx } from "@/app/_lib/class-names";
import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./text-input.module.scss";

type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  id: string;
  label: string;
  /** "url" for a link */
  type?: "text" | "url";
  /** On the field (label + input), e.g. to highlight it */
  className?: string;
  /** Shown next to the input, e.g. a preview */
  adornment?: ReactNode;
};

const TextInput = ({
  id,
  label,
  type = "text",
  className,
  adornment,
  ...inputProps
}: TextInputProps) => {
  const input = (
    <input
      type={type}
      id={id}
      className={styles["text-input__input"]}
      {...inputProps}
    />
  );

  return (
    <div className={cx(styles["text-input"], className)}>
      <label htmlFor={id} className={styles["text-input__label"]}>
        {label}
      </label>
      {adornment ? (
        <div className={styles["text-input__with-adornment"]}>
          {input}
          {adornment}
        </div>
      ) : (
        input
      )}
    </div>
  );
};

export default TextInput;
