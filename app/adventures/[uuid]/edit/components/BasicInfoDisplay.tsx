import { AdventureDto } from "@/app/_lib/model/adventure/dtos/adventure.dto";
import { EditAdventureForm } from "@/app/adventures/[uuid]/edit/components/EditBasicInfo";
import { translate } from "@/app/_dictionaries/dictionnary";
import ButtonWithIcon from "@components/_basics/button-with-icon/ButtonWithIcon";
import styles from "@/app/adventures/[uuid]/edit/edit-adventure-page.module.scss";

type BasicDataDisplayProps = {
  adventure: AdventureDto;
  setIsDrawerOpened: (isOpened: boolean) => void;
  setFormToDisplay: (form: EditAdventureForm) => void;
};

const BasicInfoDisplay = ({
  adventure,
  setIsDrawerOpened,
  setFormToDisplay,
}: BasicDataDisplayProps) => {
  const translationsNamespace = "editAdventure";

  return (
    <>
      <p className={styles["edit-adventure-page__section__content__p"]}>
        {translate("basicData.name", translationsNamespace, {
          name: adventure.name,
        })}
      </p>
      <p className={styles["edit-adventure-page__section__content__p"]}>
        {adventure.universe
          ? translate("basicData.universe", translationsNamespace, {
              name: adventure.universe.name,
            })
          : "-"}
      </p>
      <div className={styles["edit-adventure-page__section__content__button"]}>
        <ButtonWithIcon
          label={translate("basicData.edit", translationsNamespace)}
          faIcon="edit"
          iconPosition="left"
          onClick={() => {
            setIsDrawerOpened(true);
            setFormToDisplay(EditAdventureForm.BASIC_DATA);
          }}
        />
      </div>
    </>
  );
};

export default BasicInfoDisplay;
