import { cx } from "@/app/_lib/class-names";
import styles from "./tile.module.scss";

type TileProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
};

/** A small card with a title, e.g. a stat of a character */
const Tile = ({
  title,
  children,
  className,
  "data-testid": dataTestId,
}: TileProps) => (
  <div className={cx(styles["tile"], className)} data-testid={dataTestId}>
    <span className={styles["tile__title"]}>{title}</span>
    {children}
  </div>
);

export default Tile;
