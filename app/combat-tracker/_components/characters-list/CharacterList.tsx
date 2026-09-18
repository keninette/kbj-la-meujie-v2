"use client";

import styles from "./characters-list.module.scss";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import IconButton from "@/app/_components/_basics/icon-button/IconButton";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { translate } from "@/app/_dictionaries/dictionnary";

type CharacterListProps = {
  characters: CombatCharacter[];
  selectedCharacter?: CombatCharacter | null;
  onClick?: (character: CombatCharacter) => void;
  [key: string]: unknown;
};

const CharacterList = ({
  characters,
  onClick,
  selectedCharacter,
  ...restProps
}: CharacterListProps) => {
  return (
    <ol {...restProps}>
      {characters.map((char) => (
        <li
          key={char.id}
          className={
            char.id === selectedCharacter?.id
              ? styles["characters-list__item--active"]
              : ""
          }
        >
          <div
            className={[
              styles["characters-list__item"],
              char.isDying ? styles["characters-list__item--down"] : "",
              char.isDead ? styles["characters-list__item--dead"] : "",
            ].join(" ")}
          >
            {char.isDying && (
              <FontAwesomeIcon
                faIcon="hand-holding-heart"
                faIconStyle={FaIconStyleEnum.SOLID}
                tooltip={translate("stats.dying", "combatTracker")}
              />
            )}
            {char.isDead && (
              <FontAwesomeIcon
                faIcon="skull"
                faIconStyle={FaIconStyleEnum.SOLID}
                tooltip={translate("stats.dead", "combatTracker")}
              />
            )}
            {!char.isNpc && (
              <FontAwesomeIcon
                faIcon="user"
                faIconStyle={FaIconStyleEnum.SOLID}
                tooltip={translate("stats.player", "combatTracker")}
              />
            )}
            <p>{char.name}</p>
            <IconButton
              variant={ButtonVariant.TERTIARY}
              faIcon="pen"
              faIconStyle={FaIconStyleEnum.SOLID}
              type="button"
              tooltip={translate("list.edit", "combatTracker")}
              onClick={() => {
                if (onClick) {
                  onClick(char);
                }
              }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
};

export default CharacterList;
