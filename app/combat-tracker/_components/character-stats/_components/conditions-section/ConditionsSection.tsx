import Chip from "@/app/_components/_basics/chip/Chip";
import Tile from "@/app/_components/_basics/tile/Tile";
import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatCondition } from "@/app/_lib/types/combat-condition.type";
import { describeCondition } from "@/app/combat-tracker/_lib/combat-condition.helper";
import styles from "../../character-stats.module.scss";

type ConditionsSectionProps = {
  conditions?: CombatCondition[];
  onRemoveCondition: (conditionId: string) => void;
};

/** The conditions of the character, e.g. "Poisoned", as chips that can be removed */
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
            <Chip
              label={describeCondition(condition)}
              deleteAction={{
                onClick: () => onRemoveCondition(condition.id),
                tooltip: translate("form.remove", "combatTracker"),
              }}
              data-testid={`condition-${condition.id}`}
            />
          </li>
        ))}
      </ul>
    </Tile>
  );
};

export default ConditionsSection;
