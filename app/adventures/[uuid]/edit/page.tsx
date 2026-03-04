import styles from "./edit-adventure-page.module.scss";
import EditBasicInfoLoader from "./components/EditBasicInfoLoader";
import { translate } from "@/app/_dictionaries/dictionnary";

const EditAdventurePage = async ({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) => {
  const translationsNamespace = "editAdventure";
  const { uuid } = await params;

  return (
    <section className={styles["edit-adventure-page__section"]}>
      <h3 className={styles["edit-adventure-page__section__content__title"]}>
        {translate("basicData.title", translationsNamespace)}
      </h3>
      <div className={styles["edit-adventure-page__section__content"]}>
        <EditBasicInfoLoader uuid={uuid} />
      </div>
    </section>
  );
};

export default EditAdventurePage;
