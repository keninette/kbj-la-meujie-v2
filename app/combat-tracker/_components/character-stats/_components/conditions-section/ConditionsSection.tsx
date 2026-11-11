import Tile from "@/app/_components/_basics/tile/Tile";
import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatCondition } from "@/app/_lib/types/combat-condition.type";
import ConditionChip from "@/app/combat-tracker/_components/condition-chip/ConditionChip";
import styles from "../../character-stats.module.scss";

type ConditionsSectionProps = {
  conditions?: CombatCondition[];
  onRemoveCondition: (conditionId: string) => void;
};

/** The conditions of the character, as chips that can be removed */
const ConditionsSection = ({
  conditions = [],
  onRemoveCondition,
}: ConditionsSectionProps) => {
  if (conditions.length === 0) {
    return null;
  }

  return (
    <Tile
      title={translate("form.conditions", "combatTracker")}
      data-testid="character-conditions"
    >
      <ul className={styles["character-stats__chips"]}>
        {conditions.map((condition) => (
          <li key={condition.id}>
            <ConditionChip
              condition={condition}
              onRemove={() => onRemoveCondition(condition.id)}
              data-testid={`condition-${condition.id}`}
            />
          </li>
        ))}
      </ul>
    </Tile>
  );
};

export default ConditionsSection;
