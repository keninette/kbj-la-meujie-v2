import CustomDialog from "@/app/_components/_basics/custom-dialog/CustomDialog";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { CombatPassive } from "@/app/_lib/types/combat-passive.type";
import PassiveChip from "@/app/combat-tracker/_components/passive-chip/PassiveChip";

type ExistingPassiveDialogProps = {
  passive: CombatPassive;
  /** The character already has it: there's nothing to add */
  isOnCharacter: boolean;
  onAdd: () => void;
  onClose: () => void;
};

/**
 * Shown when a passive imported from the wiki is already in the list, or
 * when the character already has the one being added
 */
const ExistingPassiveDialog = ({
  passive,
  isOnCharacter,
  onAdd,
  onClose,
}: ExistingPassiveDialogProps) => (
  <CustomDialog
    isOpened
    onClose={onClose}
    title={translate("form.existingPassive.title", "combatTracker")}
    actions={
      !isOnCharacter && (
        <ButtonWithIcon
          label={translate("form.existingPassive.add", "combatTracker")}
          onClick={onAdd}
          faIcon="plus"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          data-testid="existing-passive-add"
        />
      )
    }
  >
    <p>
      {translate(
        isOnCharacter
          ? "form.existingPassive.onCharacter"
          : "form.existingPassive.inList",
        "combatTracker",
      )}
    </p>
    <PassiveChip passive={passive} />
  </CustomDialog>
);

export default ExistingPassiveDialog;
