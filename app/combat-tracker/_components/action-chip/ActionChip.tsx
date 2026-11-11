import { Fragment } from "react";
import { CombatAction } from "@/app/_lib/types/combat-action.type";
import DetailedChip from "@/app/_components/_basics/detailed-chip/DetailedChip";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";
import { translate } from "@/app/_dictionaries/dictionnary";
import { isDisplayableImageUrl } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.images";
import {
  ActionGroup,
  describeActionDetails,
  parseActionCost,
} from "@/app/combat-tracker/_lib/combat-action.helper";
import DamageText from "@/app/combat-tracker/_components/damage-text/DamageText";
import ActionCostIcon from "./ActionCostIcon";

type ActionChipProps = {
  action: CombatAction;
  /** In a group of actions: its cost is not repeated, the group title shows it */
  group?: ActionGroup;
  /** Shows a remove button in the chip, e.g. in the edit form */
  onRemove?: () => void;
};

/** An action: icon, name, costs and details. Its item and description in a tooltip. */
const ActionChip = ({ action, group, onRemove }: ActionChipProps) => {
  const costs = action.costs
    .map(parseActionCost)
    .filter((cost) => cost.kind !== group);
  // "2d6+FOR [icon] Tranchant · 1d4 [icon] Feu · CON · concentration"
  const details = [
    ...(action.damages ?? []).map((damage, index) => (
      <DamageText key={`damage-${index}`} damage={damage} />
    )),
    describeActionDetails(action),
  ].filter(Boolean);

  return (
    <DetailedChip
      icon={
        isDisplayableImageUrl(action.iconUrl) ? (
          <CharacterPortrait
            src={action.iconUrl}
            alt=""
            width={32}
            height={32}
          />
        ) : undefined
      }
      title={action.name}
      titleAdornment={costs.map((cost, index) => (
        <ActionCostIcon key={`${cost.kind}-${index}`} cost={cost} />
      ))}
      subtitle={
        details.length > 0 &&
        details.map((detail, index) => (
          <Fragment key={index}>
            {index > 0 && " · "}
            {detail}
          </Fragment>
        ))
      }
      tooltip={
        (action.item || action.description) && (
          <>
            {action.item && <strong>{action.item}</strong>}
            {action.item && action.description && <br />}
            {action.description}
          </>
        )
      }
      deleteAction={
        onRemove && {
          onClick: onRemove,
          tooltip: translate("form.remove", "combatTracker"),
        }
      }
      data-testid="action-chip"
    />
  );
};

export default ActionChip;
