import styles from "./header.module.scss";
import Image from "next/image";
import dog from "@/public/assets/themes/default/dog.png";
import dice from "@/public/assets/themes/default/dice.png";
import { getDictionary } from "@/app/_dictionaries/dictionnary";

export default function Header() {
  const dict = getDictionary("fr").layout;

  return (
    <div className={styles["header"]}>
      <div className={styles["header__logo"]}>
        <Image src={dog} alt={"dog"} className={styles["header__logo__dog"]} />
        <Image
          src={dice}
          alt={"dice"}
          width={60}
          className={styles["header__logo__dice"]}
        />
      </div>
      <div className={styles["header__text"]}>
        <h1 className={styles["header__text__title"]}>{dict.title}</h1>
        <h2 className={styles["header__text__subtitle"]}>{dict.subtitle}</h2>
      </div>
    </div>
  );
}
