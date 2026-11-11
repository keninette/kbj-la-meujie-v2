import { useState } from "react";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import LinkWithIcon from "@/app/_components/_basics/link-with-icon/LinkWithIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import type { TextLanguage } from "@/app/_lib/types/text-language.type";
import styles from "./translated-tooltip.module.scss";

type TranslatedTooltipProps = {
  /** In bold above the description, e.g. the original name of an action */
  title?: string;
  descriptions: Record<TextLanguage, string>;
  wikiLink?: string;
};

/**
 * The description of something from the game (a condition, an action), in
 * french or in english with the switch in the corner, and its wiki link
 */
const TranslatedTooltip = ({
  title,
  descriptions,
  wikiLink,
}: TranslatedTooltipProps) => {
  const [language, setLanguage] = useState<TextLanguage>("fr");

  return (
    <span className={styles["translated-tooltip"]}>
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
        className={styles["translated-tooltip__switch"]}
        data-testid="language-switch"
      />
      {title && (
        <strong className={styles["translated-tooltip__title"]}>{title}</strong>
      )}
      {descriptions[language]}
      {wikiLink && (
        <LinkWithIcon
          href={wikiLink}
          label={translate("stats.wikiLink", "combatTracker")}
          faIcon="arrow-up-right-from-square"
          iconPosition="right"
          faIconStyle={FaIconStyleEnum.SOLID}
          openInNewTab
          className={styles["translated-tooltip__wiki-link"]}
          data-testid="wiki-link"
        />
      )}
    </span>
  );
};

export default TranslatedTooltip;
