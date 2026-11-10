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

type StateFieldsetProps = {
  characters: CombatCharacter[];
  disabled: boolean;
  onAddHistory: () => void;
};

const toNumber = (value: string) => (value === "" ? 0 : Number(value));

const StateFieldset = ({
  characters,
  disabled,
  onAddHistory,
}: StateFieldsetProps) => {
  const { register } = useFormContext<CombatActionFormValues>();

  return (
    <Fieldset
      title={translate("combatAction.states", "combatTracker")}
      titleIcon="fire-flame-curved"
    >
      <FieldsetRow>
        <TargetInput
          characters={characters}
          registration={register("inflictedStateTargetId")}
          inputName="inflictedStateTargetName"
        />
        <TextInput
          id="inflictedStateName"
          label={translate("form.name", "combatTracker")}
          {...register("inflictedStateName")}
        />
      </FieldsetRow>
      <FieldsetRow>
        <NumberInput
          id="inflictedStateDuration"
          label={translate("combatAction.duration", "combatTracker")}
          {...register("inflictedStateDuration", { setValueAs: toNumber })}
        />
        <TextInput
          id="inflictedStateSaveThrowStat"
          label={translate("combatAction.saveStat", "combatTracker")}
          placeholder="CON"
          {...register("inflictedStateSaveThrowStat")}
        />
        <NumberInput
          id="inflictedStateSaveThrowDc"
          label={translate("combatAction.saveDc", "combatTracker")}
          {...register("inflictedStateSaveThrowDc", { setValueAs: toNumber })}
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

export default StateFieldset;
