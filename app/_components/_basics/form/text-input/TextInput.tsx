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
  /** Draws attention to the field, e.g. just imported from the wiki */
  isHighlighted?: boolean;
  /** On the input; the field (label + input) gets "<it>-field" */
  "data-testid"?: string;
  /** Shown next to the input, e.g. a preview */
  adornment?: ReactNode;
};

const TextInput = ({
  id,
  label,
  type = "text",
  isHighlighted = false,
  "data-testid": dataTestId,
  adornment,
  ...inputProps
}: TextInputProps) => {
  const input = (
    <input
      type={type}
      id={id}
      className={styles["text-input__input"]}
      {...inputProps}
      data-testid={dataTestId}
    />
  );

  return (
    <div
      className={cx(
        styles["text-input"],
        isHighlighted && styles["text-input--highlighted"],
      )}
      data-testid={dataTestId && `${dataTestId}-field`}
    >
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
