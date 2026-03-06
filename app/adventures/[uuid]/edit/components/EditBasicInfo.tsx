"use client";

import { AdventureDto } from "@/app/_lib/model/adventure/dtos/adventure.dto";
import { UniverseDto } from "@/app/_lib/model/universe/dtos/universe.dto";
import styles from "../edit-adventure-page.module.scss";
import { useState } from "react";
import BasicInfoForm from "@/app/adventures/[uuid]/edit/components/BasicInfoForm";
import CustomDrawer from "@components/drawer/CustomDrawer";
import BasicInfoDisplay from "@/app/adventures/[uuid]/edit/components/BasicInfoDisplay";
import LoadingState from "@/app/adventures/[uuid]/edit/components/LoadingState";

type EditAdventureProps = {
  adventure: AdventureDto | null;
  universes: UniverseDto[];
  isLoading: boolean;
  onAdventureUpdated: (updatedAdventure: AdventureDto) => void;
};

export enum EditAdventureForm {
  BASIC_DATA = "BASIC_DATA",
}

const EditBasicInfo = ({
  adventure,
  universes,
  isLoading,
  onAdventureUpdated,
}: EditAdventureProps) => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const [formToDisplay, setFormToDisplay] = useState<EditAdventureForm>();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!adventure) {
    return null;
  }

  return (
    <>
      <BasicInfoDisplay
        adventure={adventure}
        setFormToDisplay={setFormToDisplay}
        setIsDrawerOpened={setIsDrawerOpened}
      />
      <CustomDrawer
        isOpened={isDrawerOpened}
        onClose={() => setIsDrawerOpened(false)}
      >
        {formToDisplay === EditAdventureForm.BASIC_DATA && (
          <BasicInfoForm
            adventure={adventure}
            universes={universes}
            className={styles["edit-adventure-page__form"]}
            onAdventureUpdated={(updatedAdventure) => {
              onAdventureUpdated(updatedAdventure);
              setIsDrawerOpened(false);
            }}
          />
        )}
      </CustomDrawer>
    </>
  );
};

export default EditBasicInfo;
