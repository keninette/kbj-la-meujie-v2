import styles from "./home.module.scss";
import AdventuresList from "@components/adventures-list/AdventuresList.client";
import { translate } from "@/app/_dictionaries/dictionnary";
import { getAdventureService } from "@lib/registry";

export default async function Home() {
  const translationsNamespace = "layout";
  const adventures = await getAdventureService().getAll();

  return (
    <section className={styles["home__section"]}>
      <h3 className={styles["home__section__title"]}>
        {translate("adventures", translationsNamespace)}
      </h3>
      <AdventuresList adventures={adventures} />
    </section>
  );
}
