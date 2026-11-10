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

type ReviveFieldsetProps = {
  /** The dying characters */
  characters: CombatCharacter[];
  disabled: boolean;
  onAddHistory: () => void;
};

const ReviveFieldset = ({
  characters,
  disabled,
  onAddHistory,
}: ReviveFieldsetProps) => {
  const { register } = useFormContext<CombatActionFormValues>();

  return (
    <Fieldset
      title={translate("combatAction.reviveTitle", "combatTracker")}
      titleIcon="hand-holding-medical"
    >
      <FieldsetRow>
        <TargetInput
          characters={characters}
          registration={register("reviveTargetId")}
          inputName="reviveTargetId"
        />
        <ButtonWithIcon
          variant={ButtonVariant.SECONDARY}
          label={translate("combatAction.revive", "combatTracker")}
          faIcon="hand-holding-medical"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          disabled={disabled}
          onClick={onAddHistory}
        />
      </FieldsetRow>
    </Fieldset>
  );
};

export default ReviveFieldset;
