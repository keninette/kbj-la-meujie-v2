import ButtonWithIcon from "@components/_basics/button-with-icon/ButtonWithIcon";

type SubmitButtonProps = {
  label: string;
  disabled?: boolean;
};

const SubmitButton = ({ label, disabled = false }: SubmitButtonProps) => {
  return (
    <ButtonWithIcon
      label={label}
      iconPosition="left"
      faIcon="floppy-disk"
      type="submit"
      disabled={disabled}
    />
  );
};

export default SubmitButton;
