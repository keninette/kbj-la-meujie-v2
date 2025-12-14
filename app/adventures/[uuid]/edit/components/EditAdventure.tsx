import { AdventureDto } from "@lib/adventure/dtos/adventure.dto";
import styles from "../edit-adventure-page.module.scss";

const EditAdventure = ({ adventure }: { adventure: AdventureDto }) => {
  return (
    <>
      <h3 className={styles["edit-adventure-page__section__title"]}>
        Éditer l'aventure
      </h3>
      coucou
    </>
  );
};

export default EditAdventure;
