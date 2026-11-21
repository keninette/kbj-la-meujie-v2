import Chip from "@/app/_components/_basics/chip/Chip";
import ActionResourceIcon from "@/app/combat-tracker/_components/action-resource-icon/ActionResourceIcon";
import { getActionResourceName } from "@/app/combat-tracker/_lib/action-resource.helper";
import styles from "../../character-stats.module.scss";

type ActionResourceChipsProps = {
  actionResourcesLeft: Record<string, number>;
};

/**
 * The action resources left, as chips: their icon (a spell slot's level in a
 * square) then their count, greyed out at 0. Their name is in the tooltip.
 */
const ActionResourceChips = ({
  actionResourcesLeft,
}: ActionResourceChipsProps) => (
  <ul
    className={styles["character-stats__resource-chips"]}
    data-testid="character-action-resources"
  >
    {Object.entries(actionResourcesLeft).map(([id, count]) => (
      <li key={id}>
        <Chip
          label={String(count)}
          tooltip={getActionResourceName(id)}
          icon={<ActionResourceIcon id={id} />}
          isDisabled={count === 0}
          data-testid={`action-resource-${id}`}
        />
      </li>
    ))}
  </ul>
);

export default ActionResourceChips;
