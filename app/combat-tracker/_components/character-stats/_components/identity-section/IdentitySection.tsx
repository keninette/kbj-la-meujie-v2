import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import Chip from "@/app/_components/_basics/chip/Chip";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import LinkWithIcon from "@/app/_components/_basics/link-with-icon/LinkWithIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconSizeEnum } from "@/app/_lib/enums/fa-icon.size.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";
import NpcAttitudeIcon from "@/app/combat-tracker/_components/npc-attitude-icon/NpcAttitudeIcon";
import { isDisplayableImageUrl } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.images";
import styles from "../../character-stats.module.scss";

type IdentitySectionProps = {
  character: CombatCharacter;
  /** Id of the name, which labels the whole character stats */
  nameId: string;
  isCombatOngoing: boolean;
  onPlay: () => void;
  onEdit?: (character: CombatCharacter) => void;
  onDeactivate?: (character: CombatCharacter) => void;
};

/** Portrait, name, description and actions of the character, then whether it is dead */
const IdentitySection = ({
  character,
  nameId,
  isCombatOngoing,
  onPlay,
  onEdit,
  onDeactivate,
}: IdentitySectionProps) => (
  <>
    <header className={styles["character-stats__header"]}>
      <span className={styles["character-stats__picture-frame"]}>
        {isDisplayableImageUrl(character.imageUrl) ? (
          <CharacterPortrait
            src={character.imageUrl}
            alt={character.name}
            width={75}
            height={75}
            className={styles["character-stats__picture"]}
            data-testid="character-picture"
          />
        ) : (
          <span className={styles["character-stats__initial"]} aria-hidden>
            {character.name.trim().charAt(0).toUpperCase()}
          </span>
        )}
      </span>
      <div className={styles["character-stats__identity"]}>
        <h2 id={nameId} className={styles["character-stats__name"]}>
          {!character.isNpc && (
            <FontAwesomeIcon
              faIcon="user"
              faIconStyle={FaIconStyleEnum.SOLID}
              faSize={FaIconSizeEnum.SM}
              tooltip={translate("stats.player", "combatTracker")}
            />
          )}
          <span>{character.name}</span>
          {character.isNpc && character.attitude && (
            <Chip
              label={translate(
                `attitude.${character.attitude}`,
                "combatTracker",
              )}
              icon={<NpcAttitudeIcon attitude={character.attitude} />}
              tooltip={translate("form.attitude", "combatTracker")}
              data-testid="character-attitude"
            />
          )}
        </h2>
        {character.shortDescription && (
          <p
            className={styles["character-stats__short-description"]}
            data-testid="character-short-description"
          >
            {character.shortDescription}
          </p>
        )}
        <span className={styles["character-stats__actions"]}>
          {character.wikiLink && (
            <LinkWithIcon
              href={character.wikiLink}
              title={translate("list.wiki", "combatTracker")}
              faIcon="arrow-up-right-from-square"
              faIconStyle={FaIconStyleEnum.SOLID}
              openInNewTab
              data-testid="character-stats-wiki-link"
            />
          )}
          {onEdit && (
            <IconButton
              variant={ButtonVariant.TERTIARY}
              faIcon="pen"
              faIconStyle={FaIconStyleEnum.SOLID}
              tooltip={translate("list.edit", "combatTracker")}
              onClick={() => onEdit(character)}
              data-testid="character-stats-edit"
            />
          )}
          {onDeactivate && (
            <IconButton
              variant={ButtonVariant.TERTIARY}
              faIcon="user-minus"
              faIconStyle={FaIconStyleEnum.SOLID}
              tooltip={translate("list.deactivate", "combatTracker")}
              onClick={() => onDeactivate(character)}
              data-testid="character-stats-deactivate"
            />
          )}
        </span>
      </div>
      {isCombatOngoing && !character.isDying && !character.isDead && (
        <ButtonWithIcon
          variant={ButtonVariant.FAB}
          label={translate("stats.play", "combatTracker")}
          faIcon="dice-d20"
          iconPosition="left"
          faIconStyle={FaIconStyleEnum.SOLID}
          type="button"
          onClick={onPlay}
        />
      )}
    </header>

    {character.isDead && (
      <div className={styles["character-stats__line"]}>
        <FontAwesomeIcon
          faIcon="skull"
          faIconStyle={FaIconStyleEnum.SOLID}
          tooltip={translate("stats.dead", "combatTracker")}
        />
        {translate("stats.dead", "combatTracker")}
      </div>
    )}
  </>
);

export default IdentitySection;
