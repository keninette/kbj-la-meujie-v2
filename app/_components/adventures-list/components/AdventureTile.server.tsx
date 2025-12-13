import styles from "./../adventure-list.module.scss";
import SplitButton from "@components/_basics/split-button/SplitButton.client";
import { translate } from "@/app/_dictionaries/dictionnary";
import { AdventureListDto } from "@lib/adventure/dtos/adventure-list.dto";
import Image from "next/image";
import LinkWithIcon from "@components/_basics/link-with-icon/LinkWithIcon.server";
import { FaIconStyle } from "@lib/enums/fa-icon.style";

type AdventureTileProps = {
  adventure: AdventureListDto;
};

const AdventureTile = ({ adventure }: AdventureTileProps) => {
  const translationsName = "adventuresList";

  return (
    <li className={styles["adventure-list__tile"]}>
      {adventure?.universe?.icon && (
        <Image
          src={`/assets/universes/${adventure.universe.icon}`}
          alt={adventure.universe.name}
          width={100}
          height={100}
          className={styles["adventure-list__tile__content__image"]}
          title={adventure.universe.name}
        />
      )}
      <div className={styles["adventure-list__tile__content"]}>
        <div className={styles["adventure-list__tile__content__name"]}>
          <LinkWithIcon
            label={""}
            href={"#"}
            faIcon={"pen-to-square"}
            title={translate("edit", translationsName)}
            className={styles["adventure-list__tile__content__name__action"]}
          />
          <p className={styles["adventure-list__tile__content__name__text"]}>
            {adventure.name}
          </p>
        </div>
        <div className={styles["adventure-list__tile__content__actions"]}>
          <SplitButton
            options={[
              {
                label: translate("newSession", translationsName),
                onClick: () => console.log("nouvelle session"),
              },
              {
                label: "Arti, mystères & compagnie",
                onClick: () => console.log("Arti, mystères & compagnie"),
              },
              {
                label: "Le clan des tocards",
                onClick: () => console.log("Le clan des tocards"),
              },
            ]}
            faIcon="play"
            faIconStyle={FaIconStyle.SOLID}
          />
        </div>
      </div>
    </li>
  );
};

export default AdventureTile;
