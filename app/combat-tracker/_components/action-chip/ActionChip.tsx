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
import { findClassResourceName } from "@/app/combat-tracker/_lib/action-resource.helper";
import { getActionText } from "@/app/combat-tracker/_lib/action-text.helper";
import TranslatedTooltip from "@/app/combat-tracker/_components/translated-tooltip/TranslatedTooltip";
import ActionCostIcon from "./ActionCostIcon";

type ActionChipProps = {
  action: CombatAction;
  /** In a group of actions: its cost is not repeated, the group title shows it */
  group?: ActionGroup;
  /** Shows a remove button in the chip, e.g. in the edit form */
  onRemove?: () => void;
};

/**
 * An action: icon, name (in french when translated), costs and details. Its
 * item, description and wiki link in a tooltip, with its original name when
 * the chip shows another one.
 */
const ActionChip = ({ action, group, onRemove }: ActionChipProps) => {
  const costs = action.costs
    .map(parseActionCost)
    .filter((cost) => cost.kind !== group);
  const french = getActionText(action, "fr");
  // Not translated but spends a class resource: "Forme sauvage" for
  // "Wild Shape: Bear", whose name moves to the tooltip, and its variant
  // ("Bear") to the subtitle, to tell the forms apart
  const resourceName =
    french.name === action.name ? findClassResourceName(action) : undefined;
  const title = resourceName ?? french.name;
  const variant = resourceName
    ? action.name.split(": ").slice(1).join(": ")
    : undefined;
  // "Bear · 2d6+FOR [icon] Tranchant · 1d4 [icon] Feu · CON · concentration"
  const details = [
    variant,
    ...(action.damages ?? []).map((damage, index) => (
      <DamageText key={`damage-${index}`} damage={damage} />
    )),
    describeActionDetails(action),
  ].filter(Boolean);
  const tooltipTitle = [title !== action.name && action.name, action.item]
    .filter(Boolean)
    .join(" · ");

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
      title={title}
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
        (tooltipTitle || action.description) && (
          <TranslatedTooltip
            title={tooltipTitle}
            descriptions={{
              fr: french.description,
              en: getActionText(action, "en").description,
            }}
            wikiLink={action.wikiLink}
          />
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
