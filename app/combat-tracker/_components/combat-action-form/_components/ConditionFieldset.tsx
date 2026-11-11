import type { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import Fieldset, {
  FieldsetRow,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { Controller, useFormContext } from "react-hook-form";
import ConditionInputs from "@/app/combat-tracker/_components/condition-inputs/ConditionInputs";
import type { CombatActionFormValues } from "../combat-action-form.helper";
import TargetInput from "./TargetInput";

type ConditionFieldsetProps = {
  characters: CombatCharacter[];
  disabled: boolean;
  onAddHistory: () => void;
};

const ConditionFieldset = ({
  characters,
  disabled,
  onAddHistory,
}: ConditionFieldsetProps) => {
  const { register, control } = useFormContext<CombatActionFormValues>();

  return (
    <Fieldset
      title={translate("combatAction.conditions", "combatTracker")}
      titleIcon="fire-flame-curved"
    >
      <FieldsetRow>
        <TargetInput
          characters={characters}
          registration={register("inflictedConditionTargetId")}
          inputName="inflictedConditionTargetName"
        />
      </FieldsetRow>
      <Controller
        name="inflictedCondition"
        control={control}
        render={({ field }) => (
          <ConditionInputs
            draft={field.value}
            onDraftChange={field.onChange}
            onEnter={() => !disabled && onAddHistory()}
          >
            <ButtonWithIcon
              variant={ButtonVariant.SECONDARY}
              label={translate("form.add", "combatTracker")}
              faIcon="plus"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              disabled={disabled}
              onClick={onAddHistory}
            />
          </ConditionInputs>
        )}
      />
    </Fieldset>
  );
};

export default ConditionFieldset;
