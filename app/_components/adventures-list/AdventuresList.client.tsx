"use client";

import { useEffect, useState } from "react";
import { useServices } from "@hooks/services.hook";
import Skeleton from "@components/_basics/skeleton/Skeleton.server";
import AdventureTile from "@components/adventures-list/components/AdventureTile.server";
import styles from "./adventure-list.module.scss";
import { AdventureListDto } from "@lib/adventure/dtos/adventure-list.dto";

export default function AdventuresList() {
  const { adventureService } = useServices();
  const [isLoading, setIsLoading] = useState(true);
  const [adventures, setAdventures] = useState<AdventureListDto[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await adventureService.getAll();
        setAdventures(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [adventureService]); // Only loaded once, so we're safe

  return (
    <ul className={styles["adventure-list"]}>
      {isLoading && (
        <li key="li-1">
          <Skeleton
            key="skeleton-1"
            type={"rectangle"}
            width={"400px"}
            height={"100px"}
          />
        </li>
      )}
      {!isLoading &&
        adventures.map((a) => (
          <AdventureTile key={a.uuid} adventure={a}></AdventureTile>
        ))}
    </ul>
  );
}
