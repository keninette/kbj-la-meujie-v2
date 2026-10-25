"use client";

import type { ComponentProps } from "react";
import styles from "./characters-list.module.scss";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import CharacterListItem, {
  CharacterListAction,
} from "./_components/CharacterListItem";

export type { CharacterListAction };

type CharacterListProps = Omit<ComponentProps<"section">, "title"> & {
  title: string;
  titleIcon: string;
  characters: CombatCharacter[];
  allowedActions: CharacterListAction[];
  isIdle?: boolean;
  selectedCharacter?: CombatCharacter | null;
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
      <h2 className={styles["characters-list__title"]}>
        <FontAwesomeIcon
          faIcon={titleIcon}
          faIconStyle={FaIconStyleEnum.SOLID}
        />
        {title}
      </h2>
      <ol>
        {characters.map((char) => (
          <CharacterListItem
            key={char.id}
            character={char}
            allowedActions={allowedActions}
            isIdle={isIdle}
            isSelected={char.id === selectedCharacter?.id}
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
