import Fieldset from "@/app/_components/_basics/_form/_fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/_form/_text-input/TextInput";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import AddItemButton from "./AddItemButton";
import { useNewItem } from "../_hooks/use-new-item.hook";
import styles from "./fieldsets.module.scss";

type TextListFieldsetProps = {
  title: string;
  titleIcon?: string;
  /** Also the input's test id, and the base of the button's and the items' ones */
  inputId: string;
  inputLabel: string;
  items: string[];
  onChange: (items: string[]) => void;
  isHighlighted?: boolean;
};

/** A list of names (passives, objects...): removable chips, then an input to add one */
const TextListFieldset = ({
  title,
  titleIcon,
  inputId,
  inputLabel,
  items,
  onChange,
  isHighlighted,
}: TextListFieldsetProps) => {
  const { draft, setDraft, submit, submitOnEnter } = useNewItem("", (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return false;
    }
    onChange([...items, trimmedName]);
    return true;
  });

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
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={submitOnEnter}
          data-testid={inputId}
        />
        <AddItemButton onClick={submit} data-testid={`${inputId}-add-button`} />
      </div>
    </Fieldset>
  );
};

export default TextListFieldset;
