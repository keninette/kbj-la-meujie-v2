import { useState } from "react";
import Fieldset from "@/app/_components/_basics/_form/_fieldset/Fieldset";
import TextInput from "@/app/_components/_basics/_form/_text-input/TextInput";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { translate } from "@/app/_dictionaries/dictionnary";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import { CombatAction } from "@/app/_lib/types/combat-action.type";
import ActionsList from "@/app/combat-tracker/_components/actions-list/ActionsList";
import styles from "./fieldsets.module.scss";

type ActionsFieldsetProps = {
  actions: CombatAction[];
  onChange: (actions: CombatAction[]) => void;
  isHighlighted?: boolean;
};

const ActionsFieldset = ({
  actions,
  onChange,
  isHighlighted,
}: ActionsFieldsetProps) => {
  const [name, setName] = useState("");

  const add = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }
    onChange([...actions, { name: trimmedName, costs: [] }]);
    setName("");
  };

  return (
    <Fieldset
      title={translate("form.actions", "combatTracker")}
      titleIcon="hand-fist"
      isHighlighted={isHighlighted}
    >
      <ActionsList
        actions={actions}
        onRemove={(index) => onChange(actions.filter((_, i) => i !== index))}
      />
      <div className={styles["fieldsets__row"]}>
        <TextInput
          id="actionName"
          name="actionName"
          label={translate("form.actionName", "combatTracker")}
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          data-testid="actionName"
        />
        <ButtonWithIcon
          variant={ButtonVariant.SECONDARY}
          label={translate("form.add", "combatTracker")}
          faIcon="plus"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          type="button"
          onClick={add}
          data-testid="addAction"
        />
      </div>
    </Fieldset>
  );
};

export default ActionsFieldset;
