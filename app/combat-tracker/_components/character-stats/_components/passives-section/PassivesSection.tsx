import Chip from "@/app/_components/_basics/chip/Chip";
import Tile from "@/app/_components/_basics/tile/Tile";
import { translate } from "@/app/_dictionaries/dictionnary";
import styles from "../../character-stats.module.scss";

type PassivesSectionProps = {
  passives?: string[];
};

/** The passives of the character, e.g. "Darkvision", as chips */
const PassivesSection = ({ passives = [] }: PassivesSectionProps) => {
  if (passives.length === 0) {
    return null;
  }

  return (
    <Tile
      title={translate("stats.passives", "combatTracker")}
      data-testid="character-passives"
    >
      <ul className={styles["character-stats__chips"]}>
        {passives.map((passive, index) => (
          <li key={`${passive}-${index}`}>
            <Chip label={passive} />
          </li>
        ))}
      </ul>
    </Tile>
  );
};

export default PassivesSection;
