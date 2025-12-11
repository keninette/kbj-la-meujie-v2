import styles from "./page.module.scss";
import Header from "@components/header/Header.server";
import AdventuresListClient from "@components/adventures-list/AdventuresList.client";
import { translate } from "@/app/_dictionaries/dictionnary";
import Nav from "@components/nav/Nav";

export default function Home() {
  const translationsNamespace = "layout";

  return (
    <div className={styles["page"]}>
      <main>
        <Header />
        <Nav />
        <section className={styles["page__section"]}>
          <h3 className={styles["page__section__title"]}>
            {translate("adventures", translationsNamespace)}
          </h3>
          <AdventuresListClient />
        </section>
      </main>
    </div>
  );
}
