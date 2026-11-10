import ButtonWithIcon from "@components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonSize } from "@lib/enums/button-size.enum";

type SubmitButtonProps = {
  label: string;
  disabled?: boolean;
  size?: ButtonSize;
};

const SubmitButton = ({ label, disabled = false, size }: SubmitButtonProps) => {
  return (
    <ButtonWithIcon
      label={label}
      iconPosition="left"
      faIcon="floppy-disk"
      type="submit"
      disabled={disabled}
      size={size}
    />
  );
};

export default SubmitButton;
