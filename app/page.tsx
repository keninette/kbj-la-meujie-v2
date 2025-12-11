import styles from "./page.module.scss";
import Header from "@components/header/Header.server";
import AdventuresListClient from "@components/adventures-list/AdventuresList.client";

export default function Home() {
  return (
    <div className={styles["page"]}>
      <main>
        <Header />
        <AdventuresListClient />
      </main>
    </div>
  );
}
