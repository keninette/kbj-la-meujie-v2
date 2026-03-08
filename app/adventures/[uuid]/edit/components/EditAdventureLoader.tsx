"use client";

import { useEffect, useState } from "react";
import styles from "../edit-adventure-page.module.scss";
import { translate } from "@/app/_dictionaries/dictionnary";
import { AdventureDto } from "@/app/_lib/model/adventure/dtos/adventure.dto";
import { StoryArcDto } from "@/app/_lib/model/storyArc/dtos/story-arc.dto";
import EditBasicInfoLoader from "@/app/adventures/[uuid]/edit/components/basic-info/EditBasicInfoLoader";
import EditStoryArcs from "./story-arc/EditStoryArcs";

type EditAdventureLoaderProps = {
  uuid: string;
};

const EditAdventureLoader = ({ uuid }: EditAdventureLoaderProps) => {
  const [isAdventureLoading, setIsAdventureLoading] = useState(true);
  const [adventure, setAdventure] = useState<AdventureDto | null>(null);
  const translationsNamespace = "editAdventure";

  useEffect(() => {
    let isSubscribed = true;

    const fetchAdventure = async () => {
      setIsAdventureLoading(true);

      try {
        const adventureResponse = await fetch(`/api/adventures/${uuid}`, {
          cache: "no-store",
        });

        if (!adventureResponse.ok) {
          throw new Error("Unable to fetch adventure edit data");
        }

        const adventureData = await adventureResponse.json();

        if (!isSubscribed) {
          return;
        }

        setAdventure(adventureData as AdventureDto);
      } finally {
        if (isSubscribed) {
          setIsAdventureLoading(false);
        }
      }
    };

    fetchAdventure();

    return () => {
      isSubscribed = false;
    };
  }, [uuid]);

  const onAdventureUpdated = (updatedAdventure: AdventureDto) => {
    setAdventure(updatedAdventure);
  };

  const onStoryArcUpdated = (updatedStoryArc: StoryArcDto) => {
    setAdventure((previousAdventure) => {
      if (!previousAdventure) {
        return previousAdventure;
      }

      return {
        ...previousAdventure,
        storyArcs:
          previousAdventure.storyArcs?.map((storyArc) =>
            storyArc.uuid === updatedStoryArc.uuid ? updatedStoryArc : storyArc,
          ) ?? [],
      };
    });
  };

  const onStoryArcCreated = (createdStoryArc: StoryArcDto) => {
    setAdventure((previousAdventure) => {
      if (!previousAdventure) {
        return previousAdventure;
      }

      return {
        ...previousAdventure,
        storyArcs: [...(previousAdventure.storyArcs ?? []), createdStoryArc],
      };
    });
  };

  return (
    <>
      <section className={styles["edit-adventure-page__section"]}>
        <h3 className={styles["edit-adventure-page__section__content__title"]}>
          {translate("basicInfo.title", translationsNamespace)}
        </h3>
        <div className={styles["edit-adventure-page__section__content"]}>
          <EditBasicInfoLoader
            uuid={uuid}
            adventure={adventure}
            isAdventureLoading={isAdventureLoading}
            onAdventureUpdated={onAdventureUpdated}
          />
        </div>
      </section>
      <section className={styles["edit-adventure-page__section"]}>
        <h3 className={styles["edit-adventure-page__section__content__title"]}>
          {translate("storyArc.title", translationsNamespace)}
        </h3>
        <div className={styles["edit-adventure-page__section__content"]}>
          <EditStoryArcs
            adventure={adventure}
            isLoading={isAdventureLoading}
            onStoryArcUpdated={onStoryArcUpdated}
            onStoryArcCreated={onStoryArcCreated}
          />
        </div>
      </section>
    </>
  );
};

export default EditAdventureLoader;
