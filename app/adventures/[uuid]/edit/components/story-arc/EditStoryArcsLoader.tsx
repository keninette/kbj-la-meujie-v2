"use client";

import { AdventureDto } from "@/app/_lib/model/adventure/dtos/adventure.dto";
import { StoryArcDto } from "@/app/_lib/model/storyArc/dtos/story-arc.dto";
import EditStoryArcs from "@/app/adventures/[uuid]/edit/components/story-arc/EditStoryArcs";

type EditStoryArcsLoaderProps = {
  adventure: AdventureDto | null;
  isAdventureLoading: boolean;
  onStoryArcUpdated: (updatedStoryArc: StoryArcDto) => void;
  onStoryArcCreated: (createdStoryArc: StoryArcDto) => void;
};

const EditStoryArcsLoader = ({
  adventure,
  isAdventureLoading,
  onStoryArcUpdated,
  onStoryArcCreated,
}: EditStoryArcsLoaderProps) => {
  return (
    <EditStoryArcs
      adventure={adventure}
      isLoading={isAdventureLoading}
      onStoryArcUpdated={onStoryArcUpdated}
      onStoryArcCreated={onStoryArcCreated}
    />
  );
};

export default EditStoryArcsLoader;
