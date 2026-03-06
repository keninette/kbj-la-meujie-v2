"use client";

import { useEffect, useState } from "react";
import { AdventureDto } from "@/app/_lib/model/adventure/dtos/adventure.dto";
import { UniverseDto } from "@/app/_lib/model/universe/dtos/universe.dto";
import EditBasicInfo from "@/app/adventures/[uuid]/edit/components/EditBasicInfo";

type EditBasicInfoLoaderProps = {
  uuid: string;
};

const EditBasicInfoLoader = ({ uuid }: EditBasicInfoLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [adventure, setAdventure] = useState<AdventureDto | null>(null);
  const [universes, setUniverses] = useState<UniverseDto[]>([]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const [adventureResponse, universesResponse] = await Promise.all([
          fetch(`/api/adventures/${uuid}`, { cache: "no-store" }),
          fetch("/api/universes", { cache: "no-store" }),
        ]);

        if (!adventureResponse.ok || !universesResponse.ok) {
          throw new Error("Unable to fetch adventure edit data");
        }

        const [adventureData, universesData] = await Promise.all([
          adventureResponse.json(),
          universesResponse.json(),
        ]);

        if (!isSubscribed) {
          return;
        }

        setAdventure(adventureData as AdventureDto);
        setUniverses(universesData as UniverseDto[]);
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isSubscribed = false;
    };
  }, [uuid]);

  return (
    <EditBasicInfo
      adventure={adventure}
      universes={universes}
      isLoading={isLoading}
      onAdventureUpdated={(updatedAdventure) => setAdventure(updatedAdventure)}
    />
  );
};

export default EditBasicInfoLoader;
