import { cx } from "@/app/_lib/class-names";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { CombatAction } from "@/app/_lib/types/combat-action.type";
import CharacterPortrait from "@/app/combat-tracker/_components/character-portrait/CharacterPortrait";
import { isDisplayableImageUrl } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.images";
import {
  describeActionDetails,
  parseActionCost,
} from "@/app/combat-tracker/_lib/combat-action.helper";
import ActionCostIcon from "./ActionCostIcon";
import styles from "./actions-list.module.scss";

type ActionsListProps = {
  actions: CombatAction[];
  /** Shows a remove button on each action, e.g. in the edit form */
  onRemove?: (index: number) => void;
  className?: string;
};

/** The actions of a character: icon, name, costs and details */
const ActionsList = ({ actions, onRemove, className }: ActionsListProps) => (
  <ul
    className={cx(styles["actions-list"], className)}
    data-testid="actions-list"
  >
    {actions.map((action, index) => {
      const details = describeActionDetails(action);
      return (
        <li
          className={styles["actions-list__action"]}
          key={`${action.name}-${index}`}
          title={action.description}
          data-testid="actions-list-action"
        >
          {isDisplayableImageUrl(action.iconUrl) ? (
            <CharacterPortrait
              src={action.iconUrl}
              alt=""
              width={32}
              height={32}
              className={styles["actions-list__icon"]}
            />
          ) : (
            <span className={styles["actions-list__icon"]} aria-hidden />
          )}
          <div className={styles["actions-list__text"]}>
            <div className={styles["actions-list__title"]}>
              <span className={styles["actions-list__name"]}>
                {action.name}
              </span>
              {action.costs.map((cost, costIndex) => (
                <ActionCostIcon
                  key={`${cost}-${costIndex}`}
                  cost={parseActionCost(cost)}
                />
              ))}
            </div>
            {details && (
              <span className={styles["actions-list__details"]}>{details}</span>
            )}
          </div>
          {onRemove && (
            <ButtonWithIcon
              variant={ButtonVariant.SECONDARY}
              label={translate("form.remove", "combatTracker")}
              faIcon="xmark"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              type="button"
              onClick={() => onRemove(index)}
            />
          )}
        </li>
      );
    })}
  </ul>
);

export default ActionsList;
