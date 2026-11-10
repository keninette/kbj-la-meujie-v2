import Chip from "@/app/_components/_basics/chip/Chip";
import Tile from "@/app/_components/_basics/tile/Tile";
import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatState } from "@/app/_lib/types/combat-state.type";
import { describeState } from "@/app/combat-tracker/_lib/combat-state.helper";
import styles from "../../character-stats.module.scss";

type StatesSectionProps = {
  states?: CombatState[];
  onRemoveState: (stateId: string) => void;
};

/** The states of the character, e.g. "Poisoned", as chips that can be removed */
const StatesSection = ({ states = [], onRemoveState }: StatesSectionProps) => {
  if (states.length === 0) {
    return null;
  }

  return (
    <Tile
      title={translate("form.states", "combatTracker")}
      data-testid="character-states"
    >
      <ul className={styles["character-stats__chips"]}>
        {states.map((state) => (
          <li key={state.id}>
            <Chip
              label={describeState(state)}
              deleteAction={{
                onClick: () => onRemoveState(state.id),
                tooltip: translate("form.remove", "combatTracker"),
              }}
              data-testid={`state-${state.id}`}
            />
          </li>
        ))}
      </ul>
    </Tile>
  );
};

export default StatesSection;
