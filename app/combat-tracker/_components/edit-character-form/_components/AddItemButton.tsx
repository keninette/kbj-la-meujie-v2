import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";

type AddItemButtonProps = {
  onClick: () => void;
  "data-testid"?: string;
};

/** The "Add" button of a list fieldset: never submits the form */
const AddItemButton = ({
  onClick,
  "data-testid": dataTestId,
}: AddItemButtonProps) => (
  <ButtonWithIcon
    variant={ButtonVariant.SECONDARY}
    label={translate("form.add", "combatTracker")}
    faIcon="plus"
    faIconStyle={FaIconStyleEnum.SOLID}
    iconPosition="left"
    type="button"
    onClick={onClick}
    data-testid={dataTestId}
  />
);

export default AddItemButton;
