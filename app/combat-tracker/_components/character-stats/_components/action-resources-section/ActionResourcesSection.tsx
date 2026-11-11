import Chip from "@/app/_components/_basics/chip/Chip";
import Tile from "@/app/_components/_basics/tile/Tile";
import { translate } from "@/app/_dictionaries/dictionnary";
import { cx } from "@/app/_lib/class-names";
import ActionResourceIcon from "@/app/combat-tracker/_components/action-resource-icon/ActionResourceIcon";
import { getActionResourceName } from "@/app/combat-tracker/_lib/action-resource.helper";
import styles from "../../character-stats.module.scss";

type ActionResourcesSectionProps = {
  actionResourcesLeft?: Record<string, number>;
};

/**
 * The action resources left, as chips: their icon (a spell slot's level in a
 * square) then their count. Their name is in the tooltip.
 */
const ActionResourcesSection = ({
  actionResourcesLeft = {},
}: ActionResourcesSectionProps) => {
  const resources = Object.entries(actionResourcesLeft);
  if (resources.length === 0) {
    return null;
  }

  return (
    <Tile
      title={translate("stats.actionResources", "combatTracker")}
      data-testid="character-action-resources"
    >
      <ul className={styles["character-stats__chips"]}>
        {resources.map(([id, count]) => (
          <li key={id}>
            <Chip
              label={String(count)}
              tooltip={getActionResourceName(id)}
              icon={<ActionResourceIcon id={id} />}
              className={cx(
                count === 0 && styles["character-stats__chip--empty"],
              )}
              data-testid={`action-resource-${id}`}
            />
          </li>
        ))}
      </ul>
    </Tile>
  );
};

export default ActionResourcesSection;
