"use client";

import { useState } from "react";
import { AdventureDto } from "@/app/_lib/model/adventure/dtos/adventure.dto";
import { StoryArcDto } from "@/app/_lib/model/storyArc/dtos/story-arc.dto";
import styles from "../../edit-adventure-page.module.scss";
import StoryArcsDisplay from "@/app/adventures/[uuid]/edit/components/story-arc/StoryArcsDisplay";
import CustomDrawer from "@components/drawer/CustomDrawer";
import StoryArcForm from "@/app/adventures/[uuid]/edit/components/story-arc/StoryArcForm";
import StoryArcsLoadingState from "@/app/adventures/[uuid]/edit/components/story-arc/StoryArcsLoadingState";
import CreateStoryArcForm from "@/app/adventures/[uuid]/edit/components/story-arc/CreateStoryArcForm";

type EditStoryArcsProps = {
  adventure: AdventureDto | null;
  isLoading: boolean;
  onStoryArcUpdated: (updatedStoryArc: StoryArcDto) => void;
  onStoryArcCreated: (createdStoryArc: StoryArcDto) => void;
};

const EditStoryArcs = ({
  adventure,
  isLoading,
  onStoryArcUpdated,
  onStoryArcCreated,
}: EditStoryArcsProps) => {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const [isCreateFormDisplayed, setIsCreateFormDisplayed] = useState(false);
  const [storyArcToEdit, setStoryArcToEdit] = useState<StoryArcDto | null>(
    null,
  );

  if (isLoading) {
    return <StoryArcsLoadingState />;
  }

  if (!adventure) {
    return null;
  }

  return (
    <>
      <StoryArcsDisplay
        storyArcs={adventure.storyArcs ?? []}
        onEditStoryArc={(storyArc) => {
          setStoryArcToEdit(storyArc);
          setIsCreateFormDisplayed(false);
          setIsDrawerOpened(true);
        }}
        onAddStoryArc={() => {
          setStoryArcToEdit(null);
          setIsCreateFormDisplayed(true);
          setIsDrawerOpened(true);
        }}
      />
      <CustomDrawer
        isOpened={isDrawerOpened}
        onClose={() => {
          setIsDrawerOpened(false);
          setIsCreateFormDisplayed(false);
          setStoryArcToEdit(null);
        }}
      >
        {isCreateFormDisplayed && (
          <CreateStoryArcForm
            adventureUuid={adventure.uuid}
            className={styles["edit-adventure-page__form"]}
            onStoryArcCreated={(createdStoryArc) => {
              onStoryArcCreated(createdStoryArc);
              setIsDrawerOpened(false);
            }}
          />
        )}
        {!isCreateFormDisplayed && storyArcToEdit && (
          <StoryArcForm
            adventureUuid={adventure.uuid}
            storyArc={storyArcToEdit}
            className={styles["edit-adventure-page__form"]}
            onStoryArcUpdated={(updatedStoryArc) => {
              onStoryArcUpdated(updatedStoryArc);
              setStoryArcToEdit(updatedStoryArc);
              setIsDrawerOpened(false);
            }}
          />
        )}
      </CustomDrawer>
    </>
  );
};

export default EditStoryArcs;
