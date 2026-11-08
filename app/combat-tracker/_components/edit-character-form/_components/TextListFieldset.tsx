import { useState } from "react";
import Fieldset from "@/app/_components/_basics/_form/_fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/_form/_text-input/TextInput";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import styles from "./fieldsets.module.scss";

type TextListFieldsetProps = {
  title: string;
  titleIcon?: string;
  inputId: string;
  inputLabel: string;
  items: string[];
  onChange: (items: string[]) => void;
  isHighlighted?: boolean;
};

const TextListFieldset = ({
  title,
  titleIcon,
  inputId,
  inputLabel,
  items,
  onChange,
  isHighlighted,
}: TextListFieldsetProps) => {
  const [name, setName] = useState("");

  const add = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }
    onChange([...items, trimmedName]);
    setName("");
  };

  return (
    <Fieldset title={title} titleIcon={titleIcon} isHighlighted={isHighlighted}>
      <ul className={styles["fieldsets__chips"]}>
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className={styles["fieldsets__chip"]}
            data-testid={`${inputId}-item-${index}`}
          >
            {item}
            <IconButton
              variant={ButtonVariant.TERTIARY}
              tooltip={translate("form.remove", "combatTracker")}
              faIcon="xmark"
              faIconStyle={FaIconStyleEnum.SOLID}
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            />
          </li>
        ))}
      </ul>
      <div className={styles["fieldsets__row"]}>
        <TextInput
          id={inputId}
          name={inputId}
          label={inputLabel}
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          data-testid={inputId}
        />
        <ButtonWithIcon
          variant={ButtonVariant.SECONDARY}
          label={translate("form.add", "combatTracker")}
          faIcon="plus"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          type="button"
          onClick={add}
          data-testid={`${inputId}-add-button`}
        />
      </div>
    </Fieldset>
  );
};

export default TextListFieldset;
