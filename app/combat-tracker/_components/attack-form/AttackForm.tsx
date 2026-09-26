import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import {
  applyAttackFormValues,
  type AttackFormValues,
} from "@/app/combat-tracker/_components/attack-form/attack-form.helper";
import SubmitButton from "@/app/_components/_basics/submit-button/SubmitButton";
import { translate } from "@/app/_dictionaries/dictionnary";
import AttackFields from "./_components/AttackFields";
import RecoveryFields from "./_components/RecoveryFields";
import SpellFields from "./_components/SpellFields";
import StateFields from "./_components/StateFields";
import styles from "./attack-form.module.scss";

type AttackFormProps = {
  characters: CombatCharacter[];
  selectedCharacter: CombatCharacter;
  onCharactersChange: (characters: CombatCharacter[]) => void;
  onHistoryEdited: (historyEntry: string[]) => void;
};

type PendingHistoryEntry = {
  id: string;
  action: string;
};

type HistoryAction = "attack" | "reanimate" | "revive" | "spell" | "state";

const createUniqueStateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `state-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const AttackForm = ({
  characters,
  selectedCharacter,
  onCharactersChange,
  onHistoryEdited,
}: AttackFormProps) => {
  const formMethods = useForm<AttackFormValues>({
    defaultValues: {
      attackTargetId: "",
      attackDamage: 0,
      spellUsedName: "",
      spellUsedLevel: null,
      inflictedStateTargetId: "",
      inflictedStateName: "",
      inflictedStateDuration: null,
      inflictedStateSaveThrowStat: "",
      inflictedStateSaveThrowDc: null,
      reviveTargetId: "",
      reanimateTargetId: "",
    },
  });
  const { getValues, handleSubmit } = formMethods;
  const [historyEntries, setHistoryEntries] = useState<PendingHistoryEntry[]>(
    [],
  );
  const [disabledActions, setDisabledActions] = useState({
    attack: false,
    reanimate: false,
    revive: false,
    spell: false,
    state: false,
    submit: false,
  });

  const addHistoryEntry = (actionType: HistoryAction, action: string) => {
    setHistoryEntries((prev) => [...prev, { id: crypto.randomUUID(), action }]);
    setDisabledActions((prev) => ({ ...prev, [actionType]: true }));
  };

  const addAttackHistoryEntry = () => {
    const { attackTargetId, attackDamage } = getValues();
    const targetName = characters.find(
      (character) => character.id === attackTargetId,
    )?.name;
    if (!targetName || attackDamage === null) {
      return;
    }

    addHistoryEntry(
      "attack",
      translate("history.attack", "combatTracker", {
        character: selectedCharacter.name,
        target: targetName,
        damage: String(attackDamage),
      }),
    );
  };

  const addSpellUsedHistoryEntry = () => {
    const { spellUsedName, spellUsedLevel } = getValues();
    const translationKey = spellUsedName
      ? spellUsedLevel !== null
        ? "history.spell"
        : "history.spellNamed"
      : spellUsedLevel !== null
        ? "history.spellLeveled"
        : "history.spellGeneric";

    addHistoryEntry(
      "spell",
      translate(translationKey, "combatTracker", {
        character: selectedCharacter.name,
        ...(spellUsedName ? { spell: spellUsedName } : {}),
        ...(spellUsedLevel !== null ? { level: String(spellUsedLevel) } : {}),
      }),
    );
  };

  const addInflictedStateHistoryEntry = () => {
    const {
      inflictedStateTargetId,
      inflictedStateName,
      inflictedStateDuration,
    } = getValues();
    const targetName = characters.find(
      (character) => character.id === inflictedStateTargetId,
    )?.name;
    if (!inflictedStateName || !targetName) {
      return;
    }

    addHistoryEntry(
      "state",
      translate(
        inflictedStateDuration !== null
          ? "history.state"
          : "history.stateWithoutDuration",
        "combatTracker",
        {
          character: selectedCharacter.name,
          state: inflictedStateName,
          target: targetName,
          ...(inflictedStateDuration !== null
            ? { duration: String(inflictedStateDuration) }
            : {}),
        },
      ),
    );
  };

  const addReviveHistoryEntry = () => {
    const { reviveTargetId } = getValues();
    const targetCharacter = characters.find(
      (character) => character.id === reviveTargetId,
    );
    if (!targetCharacter) {
      return;
    }

    addHistoryEntry(
      "revive",
      translate("history.revive", "combatTracker", {
        character: selectedCharacter.name,
        target: targetCharacter.name,
      }),
    );
  };

  const addReanimateHistoryEntry = () => {
    const { reanimateTargetId } = getValues();
    const targetCharacter = characters.find(
      (character) => character.id === reanimateTargetId,
    );
    if (!targetCharacter) {
      return;
    }

    addHistoryEntry(
      "reanimate",
      translate("history.reanimate", "combatTracker", {
        character: selectedCharacter.name,
        target: targetCharacter.name,
      }),
    );
  };

  const onSubmit = handleSubmit((formValues) => {
    if (disabledActions.submit) {
      return;
    }
    setDisabledActions((prev) => ({ ...prev, submit: true }));
    const result = applyAttackFormValues(
      characters,
      selectedCharacter.id,
      formValues,
      createUniqueStateId,
    );

    if (result.missingAttackTargetId) {
      console.error("attack target not found", result.missingAttackTargetId);
    }
    if (result.hasChanges) {
      onCharactersChange(result.characters);
    }

    // Handle history
    if (historyEntries.length > 0) {
      onHistoryEdited(historyEntries.map((entry) => entry.action));
    }
  });

  return (
    <FormProvider {...formMethods}>
      <form className={styles["attack-form"]} onSubmit={onSubmit}>
        <h2 className={styles["attack-form__title"]}>
          {translate("attack.turnTitle", "combatTracker", {
            character: selectedCharacter.name,
          })}
        </h2>
        <div>
          <RecoveryFields
            characters={characters}
            disabledRevive={disabledActions.revive}
            disabledReanimate={disabledActions.reanimate}
            onAddRevive={addReviveHistoryEntry}
            onAddReanimate={addReanimateHistoryEntry}
          />
          <AttackFields
            characters={characters}
            disabled={disabledActions.attack}
            onAddHistory={addAttackHistoryEntry}
          />
          <SpellFields
            selectedCharacter={selectedCharacter}
            disabled={disabledActions.spell}
            onAddHistory={addSpellUsedHistoryEntry}
          />
          <StateFields
            characters={characters}
            disabled={disabledActions.state}
            onAddHistory={addInflictedStateHistoryEntry}
          />
        </div>
        <div>
          <fieldset className={styles["attack-form__fieldset"]}>
            {historyEntries.map((entry) => (
              <p
                className={styles["attack-form__history-entry"]}
                key={entry.id}
              >
                {entry.action}
              </p>
            ))}
          </fieldset>
          <SubmitButton
            label={translate("form.save", "combatTracker")}
            disabled={disabledActions.submit}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default AttackForm;
