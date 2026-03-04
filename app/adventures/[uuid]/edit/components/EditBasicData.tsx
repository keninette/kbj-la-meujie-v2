import { AdventureDto } from "@lib/adventure/dtos/adventure.dto";
import styles from "../edit-adventure-page.module.scss";
import { translate } from "@/app/_dictionaries/dictionnary";
import { useState } from "react";
import BasicDataForm from "@/app/adventures/[uuid]/edit/components/BasicDataForm";
import CustomDrawer from "@components/drawer/CustomDrawer";
import BasicDataDisplay from "@/app/adventures/[uuid]/edit/components/BasicDataDisplay";

type EditAdventureProps = {
  adventure: AdventureDto;
};

export enum EditAdventureForm {
  BASIC_DATA = "BASIC_DATA",
}

const EditBasicData = ({ adventure }: EditAdventureProps) => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const [formToDisplay, setFormToDisplay] = useState<EditAdventureForm>();

  return (
    <>
      <BasicDataDisplay
        adventure={adventure}
        setFormToDisplay={setFormToDisplay}
        setIsDrawerOpened={setIsDrawerOpened}
      />
      <CustomDrawer
        isOpened={isDrawerOpened}
        onClose={() => setIsDrawerOpened(false)}
      >
        {formToDisplay === EditAdventureForm.BASIC_DATA && (
          <BasicDataForm
            adventure={adventure}
            className={styles["edit-adventure-page__form"]}
          />
        )}
      </CustomDrawer>
    </>
  );
};

export default EditBasicData;
