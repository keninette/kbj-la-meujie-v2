import DetailedChip from "@/app/_components/_basics/detailed-chip/DetailedChip";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { CombatCondition } from "@/app/_lib/types/combat-condition.type";
import { findBg3Condition } from "@/app/combat-tracker/_lib/bg3-conditions";
import {
  describeConditionDuration,
  describeConditionSave,
  getConditionName,
} from "@/app/combat-tracker/_lib/combat-condition.helper";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";

type ConditionChipProps = {
  condition: CombatCondition;
  onRemove: () => void;
  "data-testid"?: string;
};

/**
 * A condition: its icon, its name, and under it its duration and saving
 * throw, e.g. "3 tours (depuis le tour 2) · 🛡 CON DD 13"
 */
const ConditionChip = ({
  condition,
  onRemove,
  "data-testid": dataTestId,
}: ConditionChipProps) => {
  const bg3Condition = findBg3Condition(condition.bg3ConditionId);
  const duration = describeConditionDuration(condition);
  const save = describeConditionSave(condition);

  return (
    <DetailedChip
      icon={
        bg3Condition && (
          <CharacterPortrait
            src={bg3Condition.iconUrl}
            alt=""
            width={32}
            height={32}
          />
        )
      }
      title={getConditionName(condition)}
      subtitle={
        (duration || save) && (
          <>
            {duration}
            {duration && save && " · "}
            {save && (
              <>
                <FontAwesomeIcon
                  faIcon="shield-halved"
                  faIconStyle={FaIconStyleEnum.SOLID}
                  tooltip={translate("stats.savingThrow", "combatTracker")}
                />{" "}
                {save}
              </>
            )}
          </>
        )
      }
      deleteAction={{
        onClick: onRemove,
        tooltip: translate("form.remove", "combatTracker"),
      }}
      data-testid={dataTestId}
    />
  );
};

export default ConditionChip;
