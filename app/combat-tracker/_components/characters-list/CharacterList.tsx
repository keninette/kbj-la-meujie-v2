"use client";

import { useEffect, useState } from "react";
import styles from "./characters-list.module.scss";
import { CombatCharacter } from "../../page";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";

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
    null,
  );

  useEffect(() => {
    setCurrentCharacterKey(selectedCharacter?.name ?? null);
  }, [selectedCharacter]);

  return (
    <ol {...restProps}>
      {characters.map((char) => (
        <li
          key={`${char.name}`}
          className={
            char.name === currentCharacterKey
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
            <p>{char.name}</p>
            <ButtonWithIcon
              variant={ButtonVariant.SECONDARY}
              label="Éditer"
              faIcon="pen"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              type="button"
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
