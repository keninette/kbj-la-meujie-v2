"use client";

import { useState, type ReactNode } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import { cx } from "@/app/_lib/class-names";
import styles from "./autocomplete-input.module.scss";

export type AutocompleteOption = {
  value: string;
  label: string;
  /** Shown before the label, e.g. a small image */
  icon?: ReactNode;
  /** Shown in the list instead of the icon and label, e.g. a chip. The label
   * is still the searched text, and the one shown once picked. */
  display?: ReactNode;
  /** Also searched, e.g. the original english name */
  keywords?: string;
};

// Searches the label and the keywords, case and accents ignored
const filterOptions = createFilterOptions<AutocompleteOption>({
  stringify: (option) => `${option.label} ${option.keywords ?? ""}`,
});

type AutocompleteInputProps = {
  id: string;
  label: string;
  options: AutocompleteOption[];
  value: string | null;
  /** Called with the picked option's value, or null when the text is erased */
  onChange: (value: string | null) => void;
  /** Empties the input once an option is picked, e.g. to add it to a list */
  isClearedOnSelect?: boolean;
  "data-testid"?: string;
};

/**
 * A search input that filters a list of options as you type, on their label
 * and keywords (case and accents ignored).
 */
const AutocompleteInput = ({
  id,
  label,
  options,
  value,
  onChange,
  isClearedOnSelect = false,
  "data-testid": dataTestId,
}: AutocompleteInputProps) => {
  // Controlled: while the input has the focus, MUI would keep the picked label
  const [inputValue, setInputValue] = useState("");

  return (
    <div
      className={styles["autocomplete-input"]}
      data-testid={dataTestId && `${dataTestId}-field`}
    >
      <label htmlFor={id} className={styles["autocomplete-input__label"]}>
        {label}
      </label>
      <Autocomplete
        id={id}
        options={options}
        value={options.find((option) => option.value === value) ?? null}
        onChange={(_event, option) => onChange(option?.value ?? null)}
        inputValue={inputValue}
        onInputChange={(_event, text, reason) => {
          setInputValue(
            isClearedOnSelect && reason === "selectOption" ? "" : text,
          );
          if (reason === "input" && text === "") {
            onChange(null);
          }
        }}
        getOptionLabel={(option) => option.label}
        filterOptions={filterOptions}
        // Not the label: two options may share one (two "Unarmoured Defence")
        getOptionKey={(option) => option.value}
        isOptionEqualToValue={(option, selected) =>
          option.value === selected.value
        }
        autoHighlight
        noOptionsText={translate("autocompleteInput.noResult", "components")}
        slotProps={{
          paper: { className: styles["autocomplete-input__paper"] },
        }}
        renderOption={({ key, className, ...optionProps }, option) => (
          <li
            key={key}
            {...optionProps}
            className={cx(className, styles["autocomplete-input__option"])}
            data-testid={`${id}-option-${option.value}`}
          >
            {option.display ?? (
              <>
                {option.icon}
                {option.label}
              </>
            )}
          </li>
        )}
        renderInput={(params) => (
          <div
            ref={params.InputProps.ref}
            className={styles["autocomplete-input__search"]}
          >
            <FontAwesomeIcon
              faIcon="magnifying-glass"
              faIconStyle="solid"
              className={styles["autocomplete-input__icon"]}
              aria-hidden
            />
            <input
              {...params.inputProps}
              type="search"
              placeholder={translate(
                "autocompleteInput.placeholder",
                "components",
              )}
              className={styles["autocomplete-input__input"]}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                }
              }}
              data-testid={dataTestId}
            />
          </div>
        )}
      />
    </div>
  );
};

export default AutocompleteInput;
