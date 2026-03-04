"use client";

import { useServices } from "@hooks/services.hook";
import { useEffect, useState } from "react";
import { AdventureDto } from "@lib/adventure/dtos/adventure.dto";
import styles from "./edit-adventure-page.module.scss";
import EditBasicData from "@/app/adventures/[uuid]/edit/components/EditBasicData";
import LoadingState from "@/app/adventures/[uuid]/edit/components/LoadingState";
import { translate } from "@/app/_dictionaries/dictionnary";

const EditAdventurePage = ({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) => {
  const translationsNamespace = "editAdventure";

  const [uuid, setUuid] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [adventure, setAdventure] = useState<AdventureDto>();

  const { adventureService } = useServices();

  useEffect(() => {
    (async () => {
      const { uuid } = await params;
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

  return (
    <section className={styles["edit-adventure-page__section"]}>
      <h3 className={styles["edit-adventure-page__section__content__title"]}>
        {translate("basicData.title", translationsNamespace)}
      </h3>
      <div className={styles["edit-adventure-page__section__content"]}>
        {isLoading && <LoadingState />}
        {!isLoading && adventure && (
          <EditBasicData adventure={adventure} setAdventure={setAdventure} />
        )}
      </div>
    </section>
  );
};

export default EditAdventurePage;
