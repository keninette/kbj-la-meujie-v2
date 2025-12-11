import styles from "./nav.module.scss";
import Link from "next/link";

const Nav = () => {
  return (
    <nav className={styles["nav"]}>
      <ul className={styles["nav__list"]}>
        <li className={styles["nav__list__item"]}>
          <Link href={"#"} className={styles["nav__list__item__link"]}>
            Créer une aventure
          </Link>
        </li>
        <li className={styles["nav__list__item"]}>
          <Link href={"#"} className={styles["nav__list__item__link"]}>
            Gérer les groupes
          </Link>
        </li>
        <li className={styles["nav__list__item"]}>
          <Link href={"#"} className={styles["nav__list__item__link"]}>
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
