import styles from "./nav.module.scss";
import Link from "next/link";

const Nav = () => {
  return (
    <nav className={styles["nav"]}>
      <ul className={styles["nav__list"]}>
        <li className={styles["nav__list-item"]}>
          <Link
            href={"/combat-tracker"}
            className={styles["nav__list-item-link"]}
          >
            Combat tracker
          </Link>
        </li>
        <li className={styles["nav__list-item"]}>
          <Link href={"#"} className={styles["nav__list-item-link"]}>
            Créer une aventure
          </Link>
        </li>
        <li className={styles["nav__list-item"]}>
          <Link href={"#"} className={styles["nav__list-item-link"]}>
            Gérer les groupes
          </Link>
        </li>
        <li className={styles["nav__list-item"]}>
          <Link href={"#"} className={styles["nav__list-item-link"]}>
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
