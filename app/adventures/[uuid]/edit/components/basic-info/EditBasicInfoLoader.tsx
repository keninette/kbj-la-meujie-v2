"use client";

import { useEffect, useState } from "react";
import { AdventureDto } from "@/app/_lib/model/adventure/dtos/adventure.dto";
import { UniverseDto } from "@/app/_lib/model/universe/dtos/universe.dto";
import EditBasicInfo from "@/app/adventures/[uuid]/edit/components/basic-info/EditBasicInfo";

type EditBasicInfoLoaderProps = {
  uuid: string;
  adventure: AdventureDto | null;
  isAdventureLoading: boolean;
  onAdventureUpdated: (updatedAdventure: AdventureDto) => void;
};

const EditBasicInfoLoader = ({
  uuid,
  adventure,
  isAdventureLoading,
  onAdventureUpdated,
}: EditBasicInfoLoaderProps) => {
  const [isUniversesLoading, setIsUniversesLoading] = useState(true);
  const [universes, setUniverses] = useState<UniverseDto[]>([]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchUniverses = async () => {
      setIsUniversesLoading(true);

      try {
        const universesResponse = await fetch("/api/universes", {
          cache: "no-store",
        });

        if (!universesResponse.ok) {
          throw new Error("Unable to fetch universes for adventure edit");
        }

        const universesData = await universesResponse.json();

        if (!isSubscribed) {
          return;
        }

        setUniverses(universesData as UniverseDto[]);
      } finally {
        if (isSubscribed) {
          setIsUniversesLoading(false);
        }
      }
    };

    fetchUniverses();

    return () => {
      isSubscribed = false;
    };
  }, [uuid]);

  return (
    <EditBasicInfo
      adventure={adventure}
      universes={universes}
      isLoading={isAdventureLoading || isUniversesLoading}
      onAdventureUpdated={onAdventureUpdated}
    />
  );
};

export default EditBasicInfoLoader;
