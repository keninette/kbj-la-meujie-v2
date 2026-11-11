import { useState } from "react";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import LinkWithIcon from "@/app/_components/_basics/link-with-icon/LinkWithIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import type { Bg3Condition } from "@/app/combat-tracker/_lib/bg3-conditions";
import {
  ConditionLanguage,
  getConditionText,
} from "@/app/combat-tracker/_lib/condition-text.helper";
import styles from "./condition-chip.module.scss";

type ConditionTooltipProps = {
  bg3Condition: Bg3Condition;
};

/**
 * The description of a Baldur's Gate 3 condition, in french or in english
 * with the switch in the corner, and the link to its wiki page
 */
const ConditionTooltip = ({ bg3Condition }: ConditionTooltipProps) => {
  const [language, setLanguage] = useState<ConditionLanguage>("fr");

  return (
    <span className={styles["condition-chip__tooltip"]}>
      <IconButton
        variant={ButtonVariant.TERTIARY}
        faIcon="right-left"
        faIconStyle={FaIconStyleEnum.SOLID}
        size="small"
        tooltip={translate(
          language === "fr"
            ? "stats.showEnglishDescription"
            : "stats.showFrenchDescription",
          "combatTracker",
        )}
        showTooltip={false}
        onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
        className={styles["condition-chip__switch"]}
        data-testid="condition-language-switch"
      />
      {getConditionText(bg3Condition, language).description}
      <LinkWithIcon
        href={bg3Condition.wikiLink}
        label={translate("stats.wikiLink", "combatTracker")}
        faIcon="arrow-up-right-from-square"
        iconPosition="right"
        faIconStyle={FaIconStyleEnum.SOLID}
        openInNewTab
        className={styles["condition-chip__wiki-link"]}
        data-testid="condition-wiki-link"
      />
    </span>
  );
};

export default ConditionTooltip;
