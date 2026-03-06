"use client";

import AdventureTile from "@components/adventures-list/components/AdventureTile.server";
import styles from "./adventure-list.module.scss";
import { AdventureListDto } from "@/app/_lib/model/adventure/dtos/adventure-list.dto";

type AdventuresListProps = {
  adventures: AdventureListDto[];
};

export default function AdventuresList({ adventures }: AdventuresListProps) {
  return (
    <ul className={styles["adventure-list"]}>
      {adventures.map((a) => (
        <AdventureTile key={a.uuid} adventure={a}></AdventureTile>
      ))}
    </ul>
  );
}
