import { CombatHistoryEntry } from "@/app/_lib/types/combat-history-entry.type";
import { translate } from "@/app/_dictionaries/dictionnary";
import styles from "./combat-history.module.scss";

type CombatHistoryProps = {
  combatHistory: CombatHistoryEntry[];
};

const CombatHistory = ({ combatHistory }: CombatHistoryProps) => {
  return (
    <div className={styles["combat-history"]}>
      <h2>{translate("history.title", "combatTracker")}</h2>
      {combatHistory.length === 0 ? (
        <p>{translate("history.empty", "combatTracker")}</p>
      ) : (
        <ul>
          {combatHistory.map((entry) => (
            <li key={entry.id}>
              Tour {entry.turn} : {entry.action}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CombatHistory;
