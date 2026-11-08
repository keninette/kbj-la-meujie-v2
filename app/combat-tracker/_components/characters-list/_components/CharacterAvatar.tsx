import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";
import { isDisplayableImageUrl } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.images";
import styles from "../characters-list.module.scss";

type CharacterAvatarProps = {
  character: CombatCharacter;
  /** In px */
  size: number;
};

/** Round picture of the character, or its initial when it has none */
const CharacterAvatar = ({ character, size }: CharacterAvatarProps) => {
  const imageUrl = character.imageUrl?.trim();

  return isDisplayableImageUrl(imageUrl) ? (
    <CharacterPortrait
      src={imageUrl}
      alt=""
      width={size}
      height={size}
      className={styles["characters-list__avatar"]}
    />
  ) : (
    <span
      className={styles["characters-list__avatar"]}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {character.name.trim().charAt(0).toUpperCase()}
    </span>
  );
};

export default CharacterAvatar;
