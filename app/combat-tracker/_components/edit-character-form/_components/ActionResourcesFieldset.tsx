import Fieldset, {
  FieldsetRow,
  FieldsetChips,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/form/text-input/TextInput";
import NumberInput from "@/app/_components/_basics/form/number-input/NumberInput";
import Chip from "@/app/_components/_basics/chip/Chip";
import { translate } from "@/app/_dictionaries/dictionnary";
import AddItemButton from "./AddItemButton";
import { useNewItem } from "../_hooks/use-new-item.hook";
import { getActionResourceName } from "@/app/combat-tracker/_lib/action-resource.helper";
import { normalizeActionResourceId } from "@/app/combat-tracker/_lib/bg3-action-resources";

type ActionResourcesFieldsetProps = {
  /** Uses left, by id: level ("1") or resource ("rage") */
  actionResources: Record<string, number>;
  onChange: (actionResources: Record<string, number>) => void;
  isHighlighted?: boolean;
};

const ActionResourcesFieldset = ({
  actionResources,
  onChange,
  isHighlighted,
}: ActionResourcesFieldsetProps) => {
  const { draft, setDraft, submit, submitOnEnter } = useNewItem(
    { name: "", value: 0 },
    ({ name, value }) => {
      // "spell1" or "Wild Shape", as on the wiki: "1", "wldshp"
      const id = normalizeActionResourceId(name);
      if (!id || !Number.isInteger(value) || value < 0) {
        return false;
      }
      onChange({ ...actionResources, [id]: value });
      return true;
    },
  );

  const remove = (resourceId: string) => {
    onChange(
      Object.fromEntries(
        Object.entries(actionResources).filter(([id]) => id !== resourceId),
      ),
    );
  };

  return (
    <Fieldset
      title={translate("form.actionResources", "combatTracker")}
      titleIcon="wand-sparkles"
      isHighlighted={isHighlighted}
    >
      <FieldsetChips>
        {Object.entries(actionResources).map(([id, count]) => (
          <li key={id}>
            <Chip
              label={`${getActionResourceName(id)} : ${count}`}
              deleteAction={{
                onClick: () => remove(id),
                tooltip: translate("form.remove", "combatTracker"),
              }}
            />
          </li>
        ))}
      </FieldsetChips>
      <FieldsetRow>
        <TextInput
          id="actionResourceName"
          name="actionResourceName"
          label={translate("form.nameOrLevel", "combatTracker")}
          value={draft.name}
          onChange={(event) => {
            const name = event.target.value;
            setDraft((resource) => ({ ...resource, name }));
          }}
          onKeyDown={submitOnEnter}
          data-testid="actionResourceName"
        />
        <NumberInput
          id="actionResourceValue"
          name="actionResourceValue"
          label={translate("form.value", "combatTracker")}
          step="any"
          value={draft.value}
          onChange={(event) => {
            const value = +event.target.value;
            setDraft((resource) => ({ ...resource, value }));
          }}
          onKeyDown={submitOnEnter}
          data-testid="actionResourceValue"
        />
        <AddItemButton onClick={submit} data-testid="addActionResource" />
      </FieldsetRow>
    </Fieldset>
  );
};

export default ActionResourcesFieldset;
