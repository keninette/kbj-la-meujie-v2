import ButtonWithIcon from "@components/_basics/button-with-icon/ButtonWithIcon";

type SubmitButtonProps = {
  label: string;
  onClick: (e: React.MouseEvent) => void;
};

const SubmitButton = ({ label, onClick }: SubmitButtonProps) => {
  return (
    <ButtonWithIcon label={label} iconPosition="left" faIcon="floppy-disk" />
  );
};

export default SubmitButton;
