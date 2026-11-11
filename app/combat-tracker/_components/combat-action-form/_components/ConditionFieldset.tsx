import type { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import Fieldset, {
  FieldsetRow,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import NumberInput from "@/app/_components/_basics/form/number-input/NumberInput";
import TextInput from "@/app/_components/_basics/form/text-input/TextInput";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { useFormContext } from "react-hook-form";
import type { CombatActionFormValues } from "../combat-action-form.helper";
import TargetInput from "./TargetInput";

type ConditionFieldsetProps = {
  characters: CombatCharacter[];
  disabled: boolean;
  onAddHistory: () => void;
};

const toNumber = (value: string) => (value === "" ? 0 : Number(value));

const ConditionFieldset = ({
  characters,
  disabled,
  onAddHistory,
}: ConditionFieldsetProps) => {
  const { register } = useFormContext<CombatActionFormValues>();

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
        <TextInput
          id="inflictedConditionName"
          label={translate("form.name", "combatTracker")}
          {...register("inflictedConditionName")}
        />
      </FieldsetRow>
      <FieldsetRow>
        <NumberInput
          id="inflictedConditionDuration"
          label={translate("combatAction.duration", "combatTracker")}
          {...register("inflictedConditionDuration", { setValueAs: toNumber })}
        />
        <TextInput
          id="inflictedConditionSaveThrowStat"
          label={translate("combatAction.saveStat", "combatTracker")}
          placeholder="CON"
          {...register("inflictedConditionSaveThrowStat")}
        />
        <NumberInput
          id="inflictedConditionSaveThrowDc"
          label={translate("combatAction.saveDc", "combatTracker")}
          {...register("inflictedConditionSaveThrowDc", {
            setValueAs: toNumber,
          })}
        />
        <ButtonWithIcon
          variant={ButtonVariant.SECONDARY}
          label={translate("form.add", "combatTracker")}
          faIcon="plus"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          disabled={disabled}
          onClick={onAddHistory}
        />
      </FieldsetRow>
    </Fieldset>
  );
};

export default ConditionFieldset;
