"use client";

import AdventureTile from "@components/adventures-list/components/AdventureTile.server";
import styles from "./adventure-list.module.scss";
import { AdventureListDto } from "@lib/model/adventure/dtos/adventure-list.dto";
import Skeleton from "../_basics/skeleton/Skeleton.server";

type AdventuresListProps = {
  adventures: AdventureListDto[];
  areAdventuresLoading: boolean;
};

export default function AdventuresList({
  adventures,
  areAdventuresLoading,
}: AdventuresListProps) {
  return (
    <ul className={styles["adventure-list"]}>
      {areAdventuresLoading ? (
        <>
          <Skeleton type={"rectangle"} width={"300px"} height={"100px"} />
          <Skeleton type={"rectangle"} width={"300px"} height={"100px"} />
          <Skeleton type={"rectangle"} width={"300px"} height={"100px"} />
        </>
      ) : (
        adventures.map((a) => (
          <AdventureTile key={a.uuid} adventure={a}></AdventureTile>
        ))
      )}
    </ul>
  );
}
