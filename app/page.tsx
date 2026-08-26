"use client";

import styles from "./home.module.scss";
import AdventuresList from "@components/adventures-list/AdventuresList.client";
import { translate } from "@/app/_dictionaries/dictionnary";
import { useEffect, useState } from "react";
import { AdventureListDto } from "./_lib/model/adventure/dtos/adventure-list.dto";

export default function Home() {
  const translationsNamespace = "layout";
  const [adventures, setAdventures] = useState<AdventureListDto[]>([]);
  const [areAdventuresLoading, setAreAdventuresLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    const fetchAdventures = async () => {
      setAreAdventuresLoading(true);

      try {
        const adventuresResponse = await fetch("/api/adventures", {
          cache: "no-store",
        });

        if (!adventuresResponse.ok) {
          throw new Error("Unable to fetch adventures");
        }

        const adventuresData = await adventuresResponse.json();

        if (!isSubscribed) {
          return;
        }

        setAdventures(adventuresData as AdventureListDto[]);
      } finally {
        if (isSubscribed) {
          setAreAdventuresLoading(false);
        }
      }
    };

    fetchAdventures();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <section className={styles["home__section"]}>
      <h3 className={styles["home__section__title"]}>
        {translate("adventures", translationsNamespace)}
      </h3>
      <AdventuresList
        adventures={adventures}
        areAdventuresLoading={areAdventuresLoading}
      />
    </section>
  );
}
