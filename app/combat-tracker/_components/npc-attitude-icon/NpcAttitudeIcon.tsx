import FontAwesomeIcon from "@/app/_components/_basics/font-awesome-icon/FontAwesomeIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { NpcAttitudeEnum } from "@/app/_lib/enums/npc-attitude.enum";
import styles from "./npc-attitude-icon.module.scss";

const ICONS: Record<NpcAttitudeEnum, string> = {
  [NpcAttitudeEnum.FRIEND]: "face-smile",
  [NpcAttitudeEnum.NEUTRAL]: "face-meh",
  [NpcAttitudeEnum.ENEMY]: "face-angry",
};

type NpcAttitudeIconProps = { attitude: NpcAttitudeEnum };

/** Green smile for a friend, grey for a neutral NPC, red for an enemy */
const NpcAttitudeIcon = ({ attitude }: NpcAttitudeIconProps) => (
  <FontAwesomeIcon
    faIcon={ICONS[attitude]}
    faIconStyle={FaIconStyleEnum.SOLID}
    className={styles[`npc-attitude-icon--${attitude}`]}
    tooltip={translate(`attitude.${attitude}`, "combatTracker")}
    data-testid={`npc-attitude-${attitude}`}
  />
);

export default NpcAttitudeIcon;
