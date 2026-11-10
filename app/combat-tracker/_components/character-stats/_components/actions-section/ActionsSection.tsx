import Tile from "@/app/_components/_basics/tile/Tile";
import { translate } from "@/app/_dictionaries/dictionnary";
import { CombatAction } from "@/app/_lib/types/combat-action.type";
import {
  ACTION_GROUPS,
  getActionGroup,
} from "@/app/combat-tracker/_lib/combat-action.helper";
import ActionChip from "@/app/combat-tracker/_components/action-chip/ActionChip";
import styles from "../../character-stats.module.scss";

type ActionsSectionProps = {
  actions?: CombatAction[];
};

/** The actions of the character, one line per group: actions, then bonus actions */
const ActionsSection = ({ actions = [] }: ActionsSectionProps) => {
  if (actions.length === 0) {
    return null;
  }

  // Empty groups are skipped, e.g. no bonus action
  const groups = ACTION_GROUPS.map((group) => ({
    group,
    actions: actions.filter((action) => getActionGroup(action) === group),
  })).filter((column) => column.actions.length > 0);

  return (
    <Tile
      title={translate("stats.actions", "combatTracker")}
      data-testid="character-actions"
    >
      <div className={styles["character-stats__action-groups"]}>
        {groups.map(({ group, actions: groupActions }) => (
          <section
            key={group}
            className={styles["character-stats__action-group"]}
            data-testid={`action-group-${group}`}
          >
            <h3 className={styles["character-stats__action-group-title"]}>
              {translate(`actions.group.${group}`, "combatTracker")}
            </h3>
            <ul className={styles["character-stats__action-chips"]}>
              {groupActions.map((action, index) => (
                <li
                  key={`${action.name}-${index}`}
                  className={styles["character-stats__action-item"]}
                >
                  <ActionChip action={action} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Tile>
  );
};

export default ActionsSection;
