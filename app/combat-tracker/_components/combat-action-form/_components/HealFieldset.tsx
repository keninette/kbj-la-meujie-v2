import type { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import Fieldset, {
  FieldsetRow,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import NumberInput from "@/app/_components/_basics/form/number-input/NumberInput";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { useFormContext } from "react-hook-form";
import type { CombatActionFormValues } from "../combat-action-form.helper";
import TargetInput from "./TargetInput";

type HealFieldsetProps = {
  characters: CombatCharacter[];
  disabled: boolean;
  onAddHistory: () => void;
};

const HealFieldset = ({
  characters,
  disabled,
  onAddHistory,
}: HealFieldsetProps) => {
  const { register } = useFormContext<CombatActionFormValues>();

  return (
    <Fieldset
      title={translate("combatAction.heal", "combatTracker")}
      titleIcon="heart"
    >
      <FieldsetRow>
        <TargetInput
          characters={characters.filter((character) => !character.isDead)}
          registration={register("healTargetId")}
          inputName="healTargetId"
        />
        <NumberInput
          id="healAmount"
          label={translate("combatAction.healAmount", "combatTracker")}
          min="0"
          {...register("healAmount", {
            setValueAs: (value) => (value === "" ? 0 : Number(value)),
          })}
          data-testid="healAmount"
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

export default HealFieldset;
