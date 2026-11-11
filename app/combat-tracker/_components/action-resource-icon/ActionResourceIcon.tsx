import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { ActionResourceTypeEnum } from "@/app/_lib/enums/action-resource-type.enum";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";
import { findBg3ActionResource } from "@/app/combat-tracker/_lib/bg3-action-resources";
import styles from "./action-resource-icon.module.scss";

type ActionResourceIconProps = { id: string };

/**
 * Like in the game: a light blue square with its level for a spell slot, the
 * wiki's icon for another resource, a wand for one we don't know.
 * Decorative: its name is given by the element around it.
 */
const ActionResourceIcon = ({ id }: ActionResourceIconProps) => {
  const resource = findBg3ActionResource(id);

  if (resource?.type === ActionResourceTypeEnum.SPELL_SLOT) {
    return (
      <span className={styles["action-resource-icon__spell-slot"]} aria-hidden>
        {id}
      </span>
    );
  }
  if (resource?.iconUrl) {
    return (
      <CharacterPortrait
        src={resource.iconUrl}
        alt=""
        width={16}
        height={16}
        className={styles["action-resource-icon__image"]}
      />
    );
  }
  return (
    <FontAwesomeIcon
      faIcon="wand-sparkles"
      faIconStyle={FaIconStyleEnum.SOLID}
      className={styles["action-resource-icon__wand"]}
      aria-hidden
    />
  );
};

export default ActionResourceIcon;
