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

type AttackFieldsetProps = {
  characters: CombatCharacter[];
  disabled: boolean;
  onAddHistory: () => void;
};

const AttackFieldset = ({
  characters,
  disabled,
  onAddHistory,
}: AttackFieldsetProps) => {
  const { register } = useFormContext<CombatActionFormValues>();

  return (
    <Fieldset
      title={translate("combatAction.attack", "combatTracker")}
      titleIcon="hand-fist"
    >
      <FieldsetRow>
        <TargetInput
          characters={characters}
          registration={register("attackTargetId")}
          inputName="targetName"
        />
        <NumberInput
          id="attackDamage"
          label={translate("combatAction.damage", "combatTracker")}
          min="0"
          {...register("attackDamage", {
            setValueAs: (value) => (value === "" ? 0 : Number(value)),
          })}
          data-testid="attackDamage"
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

export default AttackFieldset;
