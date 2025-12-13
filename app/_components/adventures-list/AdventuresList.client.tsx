"use client";

import { useEffect, useState } from "react";
import { useServices } from "@hooks/services.hook";
import { Adventure } from "@lib/adventure/adventure.entity";
import Skeleton from "@components/_basics/skeleton/Skeleton.server";
import AdventureTile from "@components/adventures-list/components/AdventureTile.server";
import styles from "./adventure-list.module.scss";

export default function AdventuresList() {
  const { adventureService } = useServices();
  const [loading, setLoading] = useState(true);
  const [adventures, setAdventures] = useState<Adventure[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await adventureService.getAll();
        setAdventures(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [adventureService]); // Only loaded once, so we're safe

  return (
    <ul className={styles["adventure-list"]}>
      {loading && (
        <li key="li-1">
          <Skeleton key="skeleton-1" type={"square"} size={"l"} />
        </li>
      )}
      {!loading &&
        adventures.map((a) => (
          <AdventureTile key={a.id} adventure={a}></AdventureTile>
        ))}
    </ul>
  );
}
