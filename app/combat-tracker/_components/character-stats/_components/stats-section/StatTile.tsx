import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import Tile from "@/app/_components/_basics/tile/Tile";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import styles from "../../character-stats.module.scss";

type StatTileProps = {
  title: string;
  /** Font Awesome icon before the value, e.g. "shield-halved" */
  icon: string;
  value: React.ReactNode;
  /** Tooltip of the value, if any */
  valueTitle?: string;
  "data-testid"?: string;
};

/** A single stat of the character, e.g. its armor class, with an icon */
const StatTile = ({
  title,
  icon,
  value,
  valueTitle,
  "data-testid": dataTestId,
}: StatTileProps) => (
  <Tile title={title} data-testid={dataTestId}>
    <span className={styles["character-stats__tile-value"]} title={valueTitle}>
      <FontAwesomeIcon
        faIcon={icon}
        faIconStyle={FaIconStyleEnum.SOLID}
        className={styles["character-stats__tile-icon"]}
        aria-hidden
      />
      {value}
    </span>
  </Tile>
);

export default StatTile;
