"use client";

import { AdventureDto } from "@lib/adventure/dtos/adventure.dto";
import { UniverseDto } from "@lib/universe/dtos/universe.dto";
import styles from "../edit-adventure-page.module.scss";
import { useState } from "react";
import BasicDataForm from "@/app/adventures/[uuid]/edit/components/BasicDataForm";
import CustomDrawer from "@components/drawer/CustomDrawer";
import BasicDataDisplay from "@/app/adventures/[uuid]/edit/components/BasicDataDisplay";

type EditAdventureProps = {
  adventure: AdventureDto;
  universes: UniverseDto[];
};

export enum EditAdventureForm {
  BASIC_DATA = "BASIC_DATA",
}

const EditBasicData = ({ adventure, universes }: EditAdventureProps) => {
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
            universes={universes}
            className={styles["edit-adventure-page__form"]}
          />
        )}
      </CustomDrawer>
    </>
  );
};

export default EditBasicData;
