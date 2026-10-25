"use client";

import styles from "./characters-list.module.scss";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import CharacterListItem, {
  CharacterListAction,
} from "./_components/CharacterListItem";

export type { CharacterListAction };

type CharacterListProps = {
  title: string;
  titleIcon: string;
  characters: CombatCharacter[];
  allowedActions: CharacterListAction[];
  isIdle?: boolean;
  selectedCharacter?: CombatCharacter | null;
  onEdit?: (character: CombatCharacter) => void;
  onRemoveFromCombat?: (character: CombatCharacter) => void;
  onAddToCombat?: (character: CombatCharacter) => void;
  [key: string]: unknown;
};

const CharacterList = ({
  title,
  titleIcon,
  characters,
  allowedActions,
  isIdle = false,
  selectedCharacter,
  onEdit,
  onRemoveFromCombat,
  onAddToCombat,
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
            onRemoveFromCombat={onRemoveFromCombat}
            onAddToCombat={onAddToCombat}
          />
        ))}
      </ol>
    </section>
  );
};

export default CharacterList;
