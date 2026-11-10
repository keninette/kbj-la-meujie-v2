import ButtonWithIcon from "@components/_basics/button-with-icon/ButtonWithIcon";

type SubmitButtonProps = {
  label: string;
  disabled?: boolean;
  /** Id of the form it submits, when it is outside of it */
  form?: string;
};

const SubmitButton = ({ label, disabled = false, form }: SubmitButtonProps) => {
  return (
    <ButtonWithIcon
      label={label}
      iconPosition="left"
      faIcon="floppy-disk"
      type="submit"
      disabled={disabled}
      form={form}
    />
  );
};

export default SubmitButton;
