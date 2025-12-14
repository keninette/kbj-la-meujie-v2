"use client";

import { useServices } from "@hooks/services.hook";
import { useEffect, useState } from "react";
import { AdventureDto } from "@lib/adventure/dtos/adventure.dto";
import styles from "./edit-adventure-page.module.scss";
import EditAdventure from "@/app/adventures/[uuid]/edit/components/EditAdventure";

const EditAdventurePage = ({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) => {
  const [uuid, setUuid] = useState<string>();
  const { adventureService } = useServices();
  const [isLoading, setIsLoading] = useState(true);
  const [adventure, setAdventure] = useState<AdventureDto>();

  useEffect(() => {
    (async () => {
      const { uuid } = await params;
      console.log(uuid);
      setUuid(uuid);
    })();
  }, [params]);

  useEffect(() => {
    async function load() {
      if (!uuid) return;

      try {
        const data = await adventureService.getOne(uuid);
        setAdventure(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [adventureService, uuid]); // Only loaded once, so we're safe

  console.log(uuid, adventure);
  return (
    <section className={styles["edit-adventure-page__section"]}>
      {!isLoading && adventure && <EditAdventure adventure={adventure} />}
    </section>
  );
};

export default EditAdventurePage;
