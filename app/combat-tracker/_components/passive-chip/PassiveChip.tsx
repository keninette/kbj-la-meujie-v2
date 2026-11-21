import { CombatPassive } from "@/app/_lib/types/combat-passive.type";
import DetailedChip from "@/app/_components/_basics/detailed-chip/DetailedChip";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";
import TranslatedTooltip from "@/app/combat-tracker/_components/translated-tooltip/TranslatedTooltip";
import { translate } from "@/app/_dictionaries/dictionnary";
import { isDisplayableImageUrl } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.images";
import { findBg3Passive } from "@/app/combat-tracker/_lib/bg3-passives";
import { getPassiveText } from "@/app/combat-tracker/_lib/passive-text.helper";
import styles from "./passive-chip.module.scss";

type PassiveChipProps = {
  passive: CombatPassive;
  /** Shows a remove button in the chip, e.g. in the edit form */
  onRemove?: () => void;
};

/**
 * A passive: icon and name (in french when translated). Its description and
 * wiki link in a tooltip, with its original name when the chip shows another one.
 * A Baldur's Gate 3 passive takes them from bg3-passives.ts.
 */
const PassiveChip = ({ passive, onRemove }: PassiveChipProps) => {
  const bg3Passive = findBg3Passive(passive.bg3PassiveId);
  const iconUrl = passive.iconUrl ?? bg3Passive?.iconUrl;
  const wikiLink = passive.wikiLink ?? bg3Passive?.wikiLink;
  const french = getPassiveText(passive, "fr");
  const tooltipTitle = french.name !== passive.name ? passive.name : undefined;

  return (
    <DetailedChip
      icon={
        isDisplayableImageUrl(iconUrl) ? (
          <CharacterPortrait src={iconUrl} alt="" width={32} height={32} />
        ) : (
          // A passive typed by hand, or without an icon on the wiki
          <FontAwesomeIcon
            faIcon="book-open"
            faIconStyle="solid"
            className={styles["passive-chip__default-icon"]}
            aria-hidden
          />
        )
      }
      title={french.name}
      tooltip={
        (french.description || wikiLink) && (
          <TranslatedTooltip
            title={tooltipTitle}
            descriptions={{
              fr: french.description,
              en: getPassiveText(passive, "en").description,
            }}
            wikiLink={wikiLink}
          />
        )
      }
      deleteAction={
        onRemove && {
          onClick: onRemove,
          tooltip: translate("form.remove", "combatTracker"),
        }
      }
      data-testid="passive-chip"
    />
  );
};

export default PassiveChip;
