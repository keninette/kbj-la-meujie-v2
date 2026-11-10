import Chip from "@/app/_components/_basics/chip/Chip";
import Tile from "@/app/_components/_basics/tile/Tile";
import styles from "../../character-stats.module.scss";

type ChipListSectionProps = {
  title: string;
  items?: string[];
  "data-testid"?: string;
};

/** A list of the character, e.g. its passives, as chips. Hidden when empty */
const ChipListSection = ({
  title,
  items = [],
  "data-testid": dataTestId,
}: ChipListSectionProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <Tile title={title} data-testid={dataTestId}>
      <ul className={styles["character-stats__chips"]}>
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>
            <Chip label={item} />
          </li>
        ))}
      </ul>
    </Tile>
  );
};

export default ChipListSection;
