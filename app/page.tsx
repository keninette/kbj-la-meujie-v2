import styles from "./home.module.scss";
import AdventuresListClient from "@components/adventures-list/AdventuresList.client";
import { translate } from "@/app/_dictionaries/dictionnary";

export default function Home() {
  const translationsNamespace = "layout";

  return (
    <section className={styles["home__section"]}>
      <h3 className={styles["home__section__title"]}>
        {translate("adventures", translationsNamespace)}
      </h3>
      <AdventuresListClient />
    </section>
  );
}
