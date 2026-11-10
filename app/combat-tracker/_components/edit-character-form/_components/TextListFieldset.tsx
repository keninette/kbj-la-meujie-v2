import Fieldset, {
  FieldsetChips,
  FieldsetRow,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/form/text-input/TextInput";
import Chip from "@/app/_components/_basics/chip/Chip";
import { translate } from "@/app/_dictionaries/dictionnary";
import AddItemButton from "./AddItemButton";
import { useNewItem } from "../_hooks/use-new-item.hook";

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
      <FieldsetChips>
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>
            <Chip
              label={item}
              deleteAction={{
                onClick: () => onChange(items.filter((_, i) => i !== index)),
                tooltip: translate("form.remove", "combatTracker"),
              }}
              data-testid={`${inputId}-item-${index}`}
            />
          </li>
        ))}
      </FieldsetChips>
      <FieldsetRow>
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
      </FieldsetRow>
    </Fieldset>
  );
};

export default TextListFieldset;
