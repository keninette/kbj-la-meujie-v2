"use client";

import type { ComponentProps } from "react";
import styles from "./characters-list.module.scss";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { FaIconSizeEnum } from "@/app/_lib/enums/fa-icon.size.enum";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import CharacterListItem, {
  CharacterListAction,
} from "./_components/CharacterListItem";

export type { CharacterListAction };

type CharacterListProps = Omit<ComponentProps<"section">, "title"> & {
  title: string;
  titleIcon?: string;
  characters: CombatCharacter[];
  allowedActions: CharacterListAction[];
  isIdle?: boolean;
  selectedCharacter?: CombatCharacter | null;
  /** Shows "play" on the selected character instead of its initiative */
  isCombatOngoing?: boolean;
  onEdit?: (character: CombatCharacter) => void;
  onDeactivate?: (character: CombatCharacter) => void;
  onReactivate?: (character: CombatCharacter) => void;
};

const CharacterList = ({
  title,
  titleIcon,
  characters,
  allowedActions,
  isIdle = false,
  selectedCharacter,
  isCombatOngoing = false,
  onEdit,
  onDeactivate,
  onReactivate,
  ...restProps
}: CharacterListProps) => {
  return (
    <section
      data-testid={isIdle ? "idle-characters-list" : "active-characters-list"}
      {...restProps}
    >
      <h2
        className={[
          styles["characters-list__title"],
          isIdle && styles["characters-list__title--idle"],
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {titleIcon && (
          <FontAwesomeIcon
            faIcon={titleIcon}
            faIconStyle={FaIconStyleEnum.SOLID}
            faSize={FaIconSizeEnum.XXS}
            aria-hidden
          />
        )}
        {title}
      </h2>
      <ol className={styles["characters-list__items"]}>
        {characters.map((char) => (
          <CharacterListItem
            key={char.id}
            character={char}
            allowedActions={allowedActions}
            isIdle={isIdle}
            isSelected={char.id === selectedCharacter?.id}
            isCombatOngoing={isCombatOngoing}
            onEdit={onEdit}
            onDeactivate={onDeactivate}
            onReactivate={onReactivate}
          />
        ))}
      </ol>
    </section>
  );
};

export default CharacterList;
