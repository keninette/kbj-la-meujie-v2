import styles from "../characters-list.module.scss";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { translate } from "@/app/_dictionaries/dictionnary";

export type CharacterListAction = "edit" | "removeFromCombat" | "addToCombat";

type CharacterListItemProps = {
  character: CombatCharacter;
  allowedActions: CharacterListAction[];
  isIdle?: boolean;
  isSelected?: boolean;
  onEdit?: (character: CombatCharacter) => void;
  onRemoveFromCombat?: (character: CombatCharacter) => void;
  onAddToCombat?: (character: CombatCharacter) => void;
};

const CharacterListItem = ({
  character,
  allowedActions,
  isIdle = false,
  isSelected = false,
  onEdit,
  onRemoveFromCombat,
  onAddToCombat,
}: CharacterListItemProps) => {
  return (
    <li className={isSelected ? styles["characters-list__item--active"] : ""}>
      <div
        className={[
          styles["characters-list__item"],
          isIdle ? styles["characters-list__item--idle"] : "",
          character.isDying ? styles["characters-list__item--down"] : "",
          character.isDead ? styles["characters-list__item--dead"] : "",
        ].join(" ")}
      >
        {character.isDying && (
          <FontAwesomeIcon
            faIcon="hand-holding-heart"
            faIconStyle={FaIconStyleEnum.SOLID}
            tooltip={translate("stats.dying", "combatTracker")}
          />
        )}
        {character.isDead && (
          <FontAwesomeIcon
            faIcon="skull"
            faIconStyle={FaIconStyleEnum.SOLID}
            tooltip={translate("stats.dead", "combatTracker")}
          />
        )}
        {!character.isNpc && (
          <FontAwesomeIcon
            faIcon="user"
            faIconStyle={FaIconStyleEnum.SOLID}
            tooltip={translate("stats.player", "combatTracker")}
          />
        )}
        <p>{character.name}</p>
        {allowedActions.includes("edit") && (
          <IconButton
            variant={ButtonVariant.TERTIARY}
            faIcon="pen"
            faIconStyle={FaIconStyleEnum.SOLID}
            type="button"
            tooltip={translate("list.edit", "combatTracker")}
            onClick={() => onEdit?.(character)}
          />
        )}
        {allowedActions.includes("removeFromCombat") && (
          <IconButton
            variant={ButtonVariant.TERTIARY}
            faIcon="pause"
            faIconStyle={FaIconStyleEnum.SOLID}
            type="button"
            tooltip={translate("list.pause", "combatTracker")}
            onClick={() => onRemoveFromCombat?.(character)}
          />
        )}
        {allowedActions.includes("addToCombat") && (
          <IconButton
            variant={ButtonVariant.TERTIARY}
            faIcon="play"
            faIconStyle={FaIconStyleEnum.SOLID}
            type="button"
            tooltip={translate("list.resume", "combatTracker")}
            onClick={() => onAddToCombat?.(character)}
          />
        )}
      </div>
    </li>
  );
};

export default CharacterListItem;
