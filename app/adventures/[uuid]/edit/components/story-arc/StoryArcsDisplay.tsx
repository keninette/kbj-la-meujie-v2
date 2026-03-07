import { StoryArcDto } from "@/app/_lib/model/storyArc/dtos/story-arc.dto";
import { translate } from "@/app/_dictionaries/dictionnary";
import ButtonWithIcon from "@components/_basics/button-with-icon/ButtonWithIcon";
import styles from "@/app/adventures/[uuid]/edit/edit-adventure-page.module.scss";

type StoryArcsDisplayProps = {
  storyArcs: StoryArcDto[];
  setIsDrawerOpened: (isOpened: boolean) => void;
  setStoryArcToEdit: (storyArc: StoryArcDto | null) => void;
};

const StoryArcsDisplay = ({
  storyArcs,
  setIsDrawerOpened,
  setStoryArcToEdit,
}: StoryArcsDisplayProps) => {
  const translationsNamespace = "editAdventure";

  if (storyArcs.length === 0) {
    return (
      <p className={styles["edit-adventure-page__section__content__p"]}>
        {translate("storyArc.empty", translationsNamespace)}
      </p>
    );
  }

  return (
    <>
      {storyArcs.map((storyArc) => (
        <div
          key={storyArc.uuid}
          className={styles["edit-adventure-page__section__content__story-arc"]}
        >
          <p
            className={
              styles["edit-adventure-page__section__content__story-arc-name"]
            }
          >
            {translate("storyArc.name", translationsNamespace, {
              name: storyArc.name,
            })}
          </p>
          <div
            className={styles["edit-adventure-page__section__content__button"]}
          >
            <ButtonWithIcon
              label={translate("storyArc.edit", translationsNamespace)}
              faIcon="edit"
              iconPosition="left"
              onClick={() => {
                setStoryArcToEdit(storyArc);
                setIsDrawerOpened(true);
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default StoryArcsDisplay;
