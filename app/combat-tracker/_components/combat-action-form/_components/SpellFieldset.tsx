import type { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import Fieldset, {
  FieldsetRow,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import SelectInput from "@/app/_components/_basics/form/select-input/SelectInput";
import TextInput from "@/app/_components/_basics/form/text-input/TextInput";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { useFormContext } from "react-hook-form";
import type { CombatActionFormValues } from "../combat-action-form.helper";
import { getActionResourceName } from "@/app/combat-tracker/_lib/action-resource.helper";

type SpellFieldsetProps = {
  selectedCharacter: CombatCharacter;
  disabled: boolean;
  onAddHistory: () => void;
};

const SpellFieldset = ({
  selectedCharacter,
  disabled,
  onAddHistory,
}: SpellFieldsetProps) => {
  const { register } = useFormContext<CombatActionFormValues>();
  const actionResources = Object.entries(
    selectedCharacter.actionResourcesLeft ?? {},
  );

  return (
    <Fieldset
      title={translate("combatAction.spellUsed", "combatTracker")}
      titleIcon="wand-sparkles"
    >
      <FieldsetRow>
        {actionResources.length > 0 && (
          <SelectInput
            id="spellUsedLevel"
            label={translate("form.nameOrLevel", "combatTracker")}
            {...register("spellUsedLevel", {
              setValueAs: (value) => (value === "" ? null : String(value)),
            })}
          >
            <option value="">
              {translate("combatAction.chooseLevel", "combatTracker")}
            </option>
            {actionResources.map(([id, count]) => (
              <option key={id} value={id} disabled={count <= 0}>
                {getActionResourceName(id)} (
                {translate("combatAction.slotsRemaining", "combatTracker", {
                  count: String(count),
                })}
                )
              </option>
            ))}
          </SelectInput>
        )}
        <TextInput
          id="spellUsedName"
          label={translate("form.name", "combatTracker")}
          {...register("spellUsedName")}
        />
        <ButtonWithIcon
          variant={ButtonVariant.SECONDARY}
          label={translate("combatAction.validate", "combatTracker")}
          faIcon="check"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          disabled={disabled}
          onClick={onAddHistory}
        />
      </FieldsetRow>
    </Fieldset>
  );
};

export default SpellFieldset;
