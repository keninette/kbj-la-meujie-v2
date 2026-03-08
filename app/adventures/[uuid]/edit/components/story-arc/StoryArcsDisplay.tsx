import { StoryArcDto } from "@/app/_lib/model/storyArc/dtos/story-arc.dto";
import { translate } from "@/app/_dictionaries/dictionnary";
import ButtonWithIcon from "@components/_basics/button-with-icon/ButtonWithIcon";
import styles from "@/app/adventures/[uuid]/edit/edit-adventure-page.module.scss";

type StoryArcsDisplayProps = {
  storyArcs: StoryArcDto[];
  onEditStoryArc: (storyArc: StoryArcDto) => void;
  onAddStoryArc: () => void;
};

const StoryArcsDisplay = ({
  storyArcs,
  onEditStoryArc,
  onAddStoryArc,
}: StoryArcsDisplayProps) => {
  const translationsNamespace = "editAdventure";

  return (
    <>
      <div className={styles["edit-adventure-page__section__content__button"]}>
        <ButtonWithIcon
          label={translate("storyArc.add", translationsNamespace)}
          faIcon="plus"
          iconPosition="left"
          onClick={onAddStoryArc}
        />
      </div>
      {storyArcs.length === 0 ? (
        <p className={styles["edit-adventure-page__section__content__p"]}>
          {translate("storyArc.empty", translationsNamespace)}
        </p>
      ) : (
        storyArcs.map((storyArc) => (
          <div
            key={storyArc.uuid}
            className={
              styles["edit-adventure-page__section__content__story-arc"]
            }
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
              className={
                styles["edit-adventure-page__section__content__button"]
              }
            >
              <ButtonWithIcon
                label={translate("storyArc.edit", translationsNamespace)}
                faIcon="edit"
                iconPosition="left"
                onClick={() => onEditStoryArc(storyArc)}
              />
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default StoryArcsDisplay;
