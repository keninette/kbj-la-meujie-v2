"use client";

import { useState } from "react";
import styles from "./characters-list.module.scss";
import { CombatCharacter } from "../../page";

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
  const [currentCharacterKey, setCurrentCharacterKey] = useState<string | null>(
    selectedCharacter?.name || null,
  );

  return (
    <ol {...restProps}>
      {characters.map((char) => (
        <li
          key={char.name}
          className={
            char.name === currentCharacterKey
              ? styles["characters-list__item--active"]
              : ""
          }
        >
          <div
            className={[
              styles["characters-list__item"],
              char.hp < 0 ? styles["characters-list__item--dead"] : "",
              char.hp === 0 ? styles["characters-list__item--down"] : "",
            ].join(" ")}
          >
            <p>{char.name}</p>
            <button
              onClick={() => {
                setCurrentCharacterKey(char.name);
                if (onClick) {
                  onClick(char);
                }
              }}
            >
              👀 Voir
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default CharacterList;
