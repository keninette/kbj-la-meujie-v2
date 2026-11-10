import { cx } from "@/app/_lib/class-names";
import styles from "../characters-list.module.scss";
import KebabMenu, {
  KebabMenuItem,
} from "@/app/_components/_basics/kebab-menu/KebabMenu";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import HpBar from "@/app/combat-tracker/_components/hp-bar/HpBar";
import { getMaxAlternativeHp } from "@/app/combat-tracker/_lib/hp.helper";
import CharacterAvatar from "./CharacterAvatar";

export type CharacterListAction = "edit" | "deactivate" | "reactivate";

type CharacterListItemProps = {
  character: CombatCharacter;
  allowedActions: CharacterListAction[];
  isIdle?: boolean;
  isSelected?: boolean;
  /** Shows "play" instead of the initiative of the selected character */
  isCombatOngoing?: boolean;
  onEdit?: (character: CombatCharacter) => void;
  onDeactivate?: (character: CombatCharacter) => void;
  onReactivate?: (character: CombatCharacter) => void;
};

const CharacterListItem = ({
  character,
  allowedActions,
  isIdle = false,
  isSelected = false,
  isCombatOngoing = false,
  onEdit,
  onDeactivate,
  onReactivate,
}: CharacterListItemProps) => {
  const hasAlternativeHp = (character.alternativeHp ?? 0) > 0;

  const name = (
    <span className={styles["characters-list__name"]}>
      {!character.isNpc && (
        <FontAwesomeIcon
          faIcon="user"
          faIconStyle={FaIconStyleEnum.SOLID}
          tooltip={translate("stats.player", "combatTracker")}
        />
      )}
      <span
        className={styles["characters-list__name-text"]}
        title={character.name}
      >
        {character.name}
      </span>
      {character.isDying && (
        <FontAwesomeIcon
          faIcon="hand-holding-heart"
          faIconStyle={FaIconStyleEnum.SOLID}
          tooltip={translate("stats.dying", "combatTracker")}
        />
      )}
    </span>
  );

  const menuItems: KebabMenuItem[] = [
    ...(character.wikiLink
      ? [
          {
            label: translate("list.wiki", "combatTracker"),
            faIcon: "arrow-up-right-from-square",
            href: character.wikiLink,
            openInNewTab: true,
            "data-testid": `wiki-link-${character.id}`,
          },
        ]
      : []),
    ...(allowedActions.includes("edit")
      ? [
          {
            label: translate("list.edit", "combatTracker"),
            faIcon: "pen",
            onClick: () => onEdit?.(character),
            "data-testid": `edit-character-${character.id}`,
          },
        ]
      : []),
    ...(allowedActions.includes("deactivate")
      ? [
          {
            label: translate("list.deactivate", "combatTracker"),
            faIcon: "user-minus",
            onClick: () => onDeactivate?.(character),
            "data-testid": `deactivate-character-${character.id}`,
          },
        ]
      : []),
    ...(allowedActions.includes("reactivate")
      ? [
          {
            label: translate("list.reactivate", "combatTracker"),
            faIcon: "user-plus",
            onClick: () => onReactivate?.(character),
            "data-testid": `reactivate-character-${character.id}`,
          },
        ]
      : []),
  ];

  const menu = menuItems.length > 0 && (
    <span className={styles["characters-list__actions"]}>
      <KebabMenu
        items={menuItems}
        label={translate("list.actions", "combatTracker", {
          character: character.name,
        })}
        data-testid={`character-menu-${character.id}`}
      />
    </span>
  );

  const stateClasses = [
    character.isDead && styles["characters-list__item--dead"],
  ];

  if (isIdle) {
    return (
      <li
        className={cx(
          styles["characters-list__item"],
          styles["characters-list__item--idle"],
          ...stateClasses,
        )}
        data-testid={`character-item-${character.id}`}
      >
        <CharacterAvatar character={character} size={32} />
        {name}
        {menu}
      </li>
    );
  }

  return (
    <li
      className={cx(
        styles["characters-list__card"],
        isSelected && styles["characters-list__card--current"],
        ...stateClasses,
      )}
      aria-current={isSelected ? "true" : undefined}
      data-testid={`character-item-${character.id}`}
    >
      <span className={styles["characters-list__initiative"]}>
        {isSelected && isCombatOngoing ? (
          <FontAwesomeIcon
            faIcon="play"
            faIconStyle={FaIconStyleEnum.SOLID}
            tooltip={translate("list.currentTurn", "combatTracker")}
            data-testid="current-turn-icon"
          />
        ) : (
          character.initiativeScore
        )}
      </span>
      <CharacterAvatar character={character} size={32} />
      <span className={styles["characters-list__card-body"]}>
        {name}
        {/* Like the stats: the alternative hit points first, if any */}
        <HpBar
          isCompact
          label={translate(
            hasAlternativeHp ? "stats.alternativeHp" : "stats.hp",
            "combatTracker",
          )}
          hp={hasAlternativeHp ? (character.alternativeHp ?? 0) : character.hp}
          maxHp={
            hasAlternativeHp
              ? (getMaxAlternativeHp(character) ?? 0)
              : character.maxHp
          }
          tempHp={character.tempHp}
          data-testid={`character-hp-${character.id}`}
        />
      </span>
      {menu}
    </li>
  );
};

export default CharacterListItem;
