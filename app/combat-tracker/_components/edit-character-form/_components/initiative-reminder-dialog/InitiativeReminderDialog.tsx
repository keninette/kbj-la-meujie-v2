import CustomDialog from "@/app/_components/_basics/custom-dialog/CustomDialog";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";

type InitiativeReminderDialogProps = {
  isOpened: boolean;
  onBack: () => void;
  onConfirm: () => void;
};

/** Shown when a character is saved without initiative roll */
const InitiativeReminderDialog = ({
  isOpened,
  onBack,
  onConfirm,
}: InitiativeReminderDialogProps) => (
  <CustomDialog
    isOpened={isOpened}
    onClose={onBack}
    title={translate("form.initiativeReminder.title", "combatTracker")}
    actions={
      <>
        <ButtonWithIcon
          label={translate("form.initiativeReminder.back", "combatTracker")}
          onClick={onBack}
          faIcon="arrow-left"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          variant={ButtonVariant.SECONDARY}
          data-testid="initiative-reminder-back"
        />
        <ButtonWithIcon
          label={translate("form.initiativeReminder.confirm", "combatTracker")}
          onClick={onConfirm}
          faIcon="floppy-disk"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          data-testid="initiative-reminder-confirm"
        />
      </>
    }
  >
    <p data-testid="initiative-reminder">
      {translate("form.initiativeReminder.message", "combatTracker")}
    </p>
  </CustomDialog>
);

export default InitiativeReminderDialog;
