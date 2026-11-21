import Tile from "@/app/_components/_basics/tile/Tile";
import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatPassive } from "@/app/_lib/types/combat-passive.type";
import PassiveChip from "@/app/combat-tracker/_components/passive-chip/PassiveChip";
import styles from "../../character-stats.module.scss";

type PassivesSectionProps = {
  passives?: CombatPassive[];
};

/** The passives of the character, as chips. Hidden when empty */
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
          <li key={`${passive.name}-${index}`}>
            <PassiveChip passive={passive} />
          </li>
        ))}
      </ul>
    </Tile>
  );
};

export default PassivesSection;
