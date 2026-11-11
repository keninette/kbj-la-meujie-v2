import { cx } from "@/app/_lib/class-names";
import styles from "./tile.module.scss";

type TileProps = {
  title: string;
  /** Shown on the title line, on the right, e.g. the resources of a character */
  titleAdornment?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
};

/** A small card with a title, e.g. a stat of a character */
const Tile = ({
  title,
  titleAdornment,
  children,
  className,
  "data-testid": dataTestId,
}: TileProps) => (
  <div className={cx(styles["tile"], className)} data-testid={dataTestId}>
    <div className={styles["tile__header"]}>
      <span className={styles["tile__title"]}>{title}</span>
      {titleAdornment}
    </div>
    {children}
  </div>
);

export default Tile;
