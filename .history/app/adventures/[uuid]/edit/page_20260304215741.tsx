import styles from "./edit-adventure-page.module.scss";
import EditBasicData from "@/app/adventures/[uuid]/edit/components/EditBasicData";
import { translate } from "@/app/_dictionaries/dictionnary";
import { getAdventureService, getUniverseService } from "@lib/registry";

const EditAdventurePage = async ({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) => {
  const translationsNamespace = "editAdventure";
  const { uuid } = await params;

  const [adventure, universes] = await Promise.all([
    getAdventureService().getOne(uuid),
    getUniverseService().getAll(),
  ]);

  return (
    <section className={styles["edit-adventure-page__section"]}>
      <h3 className={styles["edit-adventure-page__section__content__title"]}>
        {translate("basicData.title", translationsNamespace)}
      </h3>
      <div className={styles["edit-adventure-page__section__content"]}>
        <EditBasicData adventure={adventure} universes={universes} />
      </div>
    </section>
  );
};

export default EditAdventurePage;
