import { cx } from "@/app/_lib/class-names";
import styles from "./header.module.scss";
import Image from "next/image";
import Link from "next/link";
import dog from "@/public/assets/themes/default/dog.png";
import dice from "@/public/assets/themes/default/dice.png";
import { translate } from "@/app/_dictionaries/dictionnary";

export default function Header() {
  return (
    <Link href="/" className={cx(styles["header"], styles["header__link"])}>
      <div className={styles["header__logo"]}>
        <Image src={dog} alt={"dog"} height={140} />
        <Image
          src={dice}
          alt={"dice"}
          width={50}
          className={styles["header__logo-dice"]}
        />
      </div>
      <div className={styles["header__text"]}>
        <h1 className={styles["header__text-title"]}>
          {translate("title", "layout")}
        </h1>
        <h2 className={styles["header__text-subtitle"]}>
          {translate("subtitle", "layout")}
        </h2>
      </div>
    </Link>
  );
}
