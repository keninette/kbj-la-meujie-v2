import ButtonWithIcon from "@components/_basics/button-with-icon/ButtonWithIcon";

type SubmitButtonProps = {
  label: string;
};

const SubmitButton = ({ label }: SubmitButtonProps) => {
  return (
    <ButtonWithIcon
      label={label}
      iconPosition="left"
      faIcon="floppy-disk"
      type="submit"
    />
  );
};

export default SubmitButton;
