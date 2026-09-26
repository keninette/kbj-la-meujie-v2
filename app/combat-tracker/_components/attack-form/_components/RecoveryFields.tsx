import type { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { translate } from "@/app/_dictionaries/dictionnary";
import { useFormContext } from "react-hook-form";
import type { AttackFormValues } from "../attack-form.helper";
import TargetInput from "./TargetInput";
import styles from "../attack-form.module.scss";

type RecoveryFieldsProps = {
  characters: CombatCharacter[];
  disabledRevive: boolean;
  disabledReanimate: boolean;
  onAddRevive: () => void;
  onAddReanimate: () => void;
};

const RecoveryFields = ({
  characters,
  disabledRevive,
  disabledReanimate,
  onAddRevive,
  onAddReanimate,
}: RecoveryFieldsProps) => {
  const { register } = useFormContext<AttackFormValues>();

  return (
    <>
      {characters.some((character) => character.isDying) && (
        <fieldset className={styles["attack-form__fieldset"]}>
          <h3 className={styles["attack-form__fieldset-title"]}>
            {translate("attack.reviveTitle", "combatTracker")}
          </h3>
          <TargetInput
            characters={characters.filter((character) => character.isDying)}
            registration={register("reviveTargetId")}
            inputName="reviveTargetId"
          />
          <ButtonWithIcon
            variant={ButtonVariant.SECONDARY}
            label={translate("attack.revive", "combatTracker")}
            faIcon="hand-holding-medical"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
            type="button"
            disabled={disabledRevive}
            onClick={onAddRevive}
          />
        </fieldset>
      )}
      {characters.some((character) => character.isDead) && (
        <fieldset className={styles["attack-form__fieldset"]}>
          <h3 className={styles["attack-form__fieldset-title"]}>
            {translate("attack.reanimateTitle", "combatTracker")}
          </h3>
          <TargetInput
            characters={characters.filter((character) => character.isDead)}
            registration={register("reanimateTargetId")}
            inputName="reanimateTargetId"
          />
          <ButtonWithIcon
            variant={ButtonVariant.SECONDARY}
            label={translate("attack.reanimate", "combatTracker")}
            faIcon="heart-pulse"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
            type="button"
            disabled={disabledReanimate}
            onClick={onAddReanimate}
          />
        </fieldset>
      )}
    </>
  );
};

export default RecoveryFields;
