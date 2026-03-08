import { AdventureDto } from "@/app/_lib/model/adventure/dtos/adventure.dto";
import { EditAdventureForm } from "@/app/adventures/[uuid]/edit/components/basic-info/EditBasicInfo";
import { translate } from "@/app/_dictionaries/dictionnary";
import ButtonWithIcon from "@components/_basics/button-with-icon/ButtonWithIcon";
import styles from "@/app/adventures/[uuid]/edit/edit-adventure-page.module.scss";

type BasicInfoDisplayProps = {
  adventure: AdventureDto;
  setIsDrawerOpened: (isOpened: boolean) => void;
  setFormToDisplay: (form: EditAdventureForm) => void;
};

const BasicInfoDisplay = ({
  adventure,
  setIsDrawerOpened,
  setFormToDisplay,
}: BasicInfoDisplayProps) => {
  const translationsNamespace = "editAdventure";

  return (
    <>
      <div className={styles["edit-adventure-page__section__content__button"]}>
        <ButtonWithIcon
          label={translate("basicInfo.edit", translationsNamespace)}
          faIcon="edit"
          iconPosition="left"
          onClick={() => {
            setIsDrawerOpened(true);
            setFormToDisplay(EditAdventureForm.BASIC_DATA);
          }}
        />
      </div>
      <p className={styles["edit-adventure-page__section__content__p"]}>
        {translate("basicInfo.name", translationsNamespace, {
          name: adventure.name,
        })}
      </p>
      <p className={styles["edit-adventure-page__section__content__p"]}>
        {adventure.universe
          ? translate("basicInfo.universe", translationsNamespace, {
              name: adventure.universe.name,
            })
          : "-"}
      </p>
    </>
  );
};

export default BasicInfoDisplay;
