import type { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import Fieldset, {
  FieldsetRow,
} from "@/app/_components/_basics/form/fieldset/Fieldset";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { useFormContext } from "react-hook-form";
import type { CombatActionFormValues } from "../combat-action-form.helper";
import TargetInput from "./TargetInput";

type ReanimateFieldsetProps = {
  /** The dead characters */
  characters: CombatCharacter[];
  disabled: boolean;
  onAddHistory: () => void;
};

const ReanimateFieldset = ({
  characters,
  disabled,
  onAddHistory,
}: ReanimateFieldsetProps) => {
  const { register } = useFormContext<CombatActionFormValues>();

  return (
    <Fieldset
      title={translate("combatAction.reanimateTitle", "combatTracker")}
      titleIcon="heart-pulse"
    >
      <FieldsetRow>
        <TargetInput
          characters={characters}
          registration={register("reanimateTargetId")}
          inputName="reanimateTargetId"
        />
        <ButtonWithIcon
          variant={ButtonVariant.SECONDARY}
          label={translate("combatAction.reanimate", "combatTracker")}
          faIcon="heart-pulse"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          disabled={disabled}
          onClick={onAddHistory}
        />
      </FieldsetRow>
    </Fieldset>
  );
};

export default ReanimateFieldset;
