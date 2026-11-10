import Chip from "@/app/_components/_basics/chip/Chip";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import Tile from "@/app/_components/_basics/tile/Tile";
import { translate } from "@/app/_dictionaries/dictionnary";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import styles from "../../character-stats.module.scss";

type ConsumablesSectionProps = {
  consumables?: string[];
};

/** The consumables of the character, e.g. "Potion de soin", as chips */
const ConsumablesSection = ({ consumables = [] }: ConsumablesSectionProps) => {
  if (consumables.length === 0) {
    return null;
  }

  return (
    <Tile
      title={translate("stats.usableObjects", "combatTracker")}
      data-testid="character-consumables"
    >
      <ul className={styles["character-stats__chips"]}>
        {consumables.map((consumable, index) => (
          <li key={`${consumable}-${index}`}>
            <Chip
              label={consumable}
            />
          </li>
        ))}
      </ul>
    </Tile>
  );
};

export default ConsumablesSection;
