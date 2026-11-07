import { CombatHistoryEntry } from "@/app/_lib/types/combat-history-entry.type";
import { translate } from "@/app/_dictionaries/dictionnary";

type CombatHistoryProps = {
  combatHistory: CombatHistoryEntry[];
};

const CombatHistory = ({ combatHistory }: CombatHistoryProps) => {
  return (
    <div>
      {combatHistory.length === 0 ? (
        <p>{translate("history.empty", "combatTracker")}</p>
      ) : (
        <ul>
          {combatHistory.map((entry) => (
            <li key={entry.id}>
              {translate("manager.turn", "combatTracker", {
                turn: entry.turn.toString(),
              })}{" "}
              : {entry.action}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CombatHistory;
