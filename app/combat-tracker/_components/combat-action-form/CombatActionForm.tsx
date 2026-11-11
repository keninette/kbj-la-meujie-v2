import { createId } from "@/app/combat-tracker/_lib/create-id";
import { useId, useState } from "react";
import CustomDrawer from "@/app/_components/_basics/custom-drawer/CustomDrawer";
import { FormProvider, useForm } from "react-hook-form";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import {
  applyCombatActionFormValues,
  type CombatActionFormValues,
} from "@/app/combat-tracker/_components/combat-action-form/combat-action-form.helper";
import SubmitButton from "@/app/_components/_basics/form/submit-button/SubmitButton";
import { translate } from "@/app/_dictionaries/dictionnary";
import AttackFieldset from "./_components/AttackFieldset";
import HealFieldset from "./_components/HealFieldset";
import ReanimateFieldset from "./_components/ReanimateFieldset";
import ReviveFieldset from "./_components/ReviveFieldset";
import SpellFieldset from "./_components/SpellFieldset";
import ConditionFieldset from "./_components/ConditionFieldset";
import styles from "./combat-action-form.module.scss";

type CombatActionFormProps = {
  /** Shown in a drawer, with the save button always visible at the bottom */
  isOpened: boolean;
  onClose: () => void;
  title: string;
  characters: CombatCharacter[];
  selectedCharacter: CombatCharacter;
  onCharactersChange: (characters: CombatCharacter[]) => void;
  onHistoryEdited: (historyEntry: string[]) => void;
  currentTurn?: number;
};

type PendingHistoryEntry = {
  id: string;
  action: string;
};

type HistoryAction =
  | "attack"
  | "heal"
  | "reanimate"
  | "revive"
  | "spell"
  | "condition";

const CombatActionForm = ({
  isOpened,
  onClose,
  title,
  characters,
  selectedCharacter,
  onCharactersChange,
  onHistoryEdited,
  currentTurn,
}: CombatActionFormProps) => {
  const formId = useId();
  const dyingCharacters = characters.filter((character) => character.isDying);
  const deadCharacters = characters.filter((character) => character.isDead);
  const formMethods = useForm<CombatActionFormValues>({
    defaultValues: {
      attackTargetId: "",
      attackDamage: 0,
      healTargetId: "",
      healAmount: 0,
      spellUsedName: "",
      spellUsedLevel: null,
      inflictedConditionTargetId: "",
      inflictedConditionName: "",
      inflictedConditionDuration: null,
      inflictedConditionSaveThrowStat: "",
      inflictedConditionSaveThrowDc: null,
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
    heal: false,
    reanimate: false,
    revive: false,
    spell: false,
    condition: false,
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

  const addHealHistoryEntry = () => {
    const { healTargetId, healAmount } = getValues();
    const targetName = characters.find(
      (character) => character.id === healTargetId,
    )?.name;
    if (!targetName || !healAmount) {
      return;
    }

    addHistoryEntry(
      "heal",
      translate("history.heal", "combatTracker", {
        character: selectedCharacter.name,
        target: targetName,
        heal: String(healAmount),
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
        ...(spellUsedLevel !== null ? { level: spellUsedLevel } : {}),
      }),
    );
  };

  const addInflictedConditionHistoryEntry = () => {
    const {
      inflictedConditionTargetId,
      inflictedConditionName,
      inflictedConditionDuration,
    } = getValues();
    const targetName = characters.find(
      (character) => character.id === inflictedConditionTargetId,
    )?.name;
    if (!inflictedConditionName || !targetName) {
      return;
    }

    addHistoryEntry(
      "condition",
      translate(
        inflictedConditionDuration !== null
          ? "history.condition"
          : "history.conditionWithoutDuration",
        "combatTracker",
        {
          character: selectedCharacter.name,
          condition: inflictedConditionName,
          target: targetName,
          ...(inflictedConditionDuration !== null
            ? { duration: String(inflictedConditionDuration) }
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
    const result = applyCombatActionFormValues(
      characters,
      selectedCharacter.id,
      formValues,
      createId,
      currentTurn,
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
    <CustomDrawer
      isOpened={isOpened}
      onClose={onClose}
      title={title}
      actions={
        <SubmitButton
          label={translate("form.save", "combatTracker")}
          disabled={disabledActions.submit}
          form={formId}
        />
      }
    >
      <FormProvider {...formMethods}>
        {/* The save button is in the drawer actions: it submits it by its id */}
        <form
          id={formId}
          className={styles["combat-action-form"]}
          onSubmit={onSubmit}
        >
          {dyingCharacters.length > 0 && (
            <ReviveFieldset
              characters={dyingCharacters}
              disabled={disabledActions.revive}
              onAddHistory={addReviveHistoryEntry}
            />
          )}
          {deadCharacters.length > 0 && (
            <ReanimateFieldset
              characters={deadCharacters}
              disabled={disabledActions.reanimate}
              onAddHistory={addReanimateHistoryEntry}
            />
          )}
          <AttackFieldset
            characters={characters}
            disabled={disabledActions.attack}
            onAddHistory={addAttackHistoryEntry}
          />
          <HealFieldset
            characters={characters}
            disabled={disabledActions.heal}
            onAddHistory={addHealHistoryEntry}
          />
          <SpellFieldset
            selectedCharacter={selectedCharacter}
            disabled={disabledActions.spell}
            onAddHistory={addSpellUsedHistoryEntry}
          />
          <ConditionFieldset
            characters={characters}
            disabled={disabledActions.condition}
            onAddHistory={addInflictedConditionHistoryEntry}
          />
          {historyEntries.length > 0 && (
            <ul className={styles["combat-action-form__history"]}>
              {historyEntries.map((entry) => (
                <li key={entry.id}>{entry.action}</li>
              ))}
            </ul>
          )}
        </form>
      </FormProvider>
    </CustomDrawer>
  );
};

export default CombatActionForm;
