import { useState } from "react";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { findCharacterIndexById } from "@/app/_lib/combat/combat.helper";
import SubmitButton from "@/app/_components/_basics/submit-button/SubmitButton";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import TargetInput from "./target-input/TargetInput";
import { translate } from "@/app/_dictionaries/dictionnary";
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

const AttackForm = ({
  characters,
  selectedCharacter,
  onCharactersChange,
  onHistoryEdited,
}: AttackFormProps) => {
  const [attackTargetId, setAttackTargetId] = useState<string | null>(null);
  const [attackDamage, setAttackDamage] = useState<number | null>(null);
  const [spellUsedName, setSpellUsedName] = useState<string | null>(null);
  const [spellUsedLevel, setSpellUsedLevel] = useState<number | null>(null);
  const [inflictedStateTargetId, setInflictedStateTargetId] = useState<
    string | null
  >(null);
  const [reviveTargetId, setReviveTargetId] = useState<string | null>(null);
  const [reanimateTargetId, setReanimateTargetId] = useState<string | null>(
    null,
  );
  const [inflictedStateName, setInflictedStateName] = useState<string>();
  const [inflictedStateDuration, setInflictedStateDuration] = useState<
    number | null
  >(null);
  const [inflictedStateSaveThrowStat, setInflictedSaveThrowStat] = useState<
    string | null
  >(null);
  const [inflictedStateSaveThrowDc, setInflictedStateSaveThrowDc] = useState<
    number | null
  >(null);
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

  const addAttackHistoryEntry = () => {
    const targetName = characters.find(
      (character) => character.id === attackTargetId,
    )?.name;
    if (!targetName || attackDamage === null) {
      return;
    }

    setHistoryEntries((prev) => {
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          action: translate("history.attack", "combatTracker", {
            character: selectedCharacter.name,
            target: targetName,
            damage: String(attackDamage),
          }),
        },
      ];
    });
    setDisabledActions((prev) => ({ ...prev, attack: true }));
  };

  const addSpellUsedHistoryEntry = () => {
    const translationKey = spellUsedName
      ? spellUsedLevel !== null
        ? "history.spell"
        : "history.spellNamed"
      : spellUsedLevel !== null
        ? "history.spellLeveled"
        : "history.spellGeneric";

    setHistoryEntries((prev) => {
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          action: translate(translationKey, "combatTracker", {
            character: selectedCharacter.name,
            ...(spellUsedName ? { spell: spellUsedName } : {}),
            ...(spellUsedLevel !== null
              ? { level: String(spellUsedLevel) }
              : {}),
          }),
        },
      ];
    });
    setDisabledActions((prev) => ({ ...prev, spell: true }));
  };

  const addInflictedStateHistoryEntry = () => {
    const targetName = characters.find(
      (character) => character.id === inflictedStateTargetId,
    )?.name;
    if (!inflictedStateName || !targetName) {
      return;
    }

    setHistoryEntries((prev) => {
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          action: translate(
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
        },
      ];
    });
    setDisabledActions((prev) => ({ ...prev, state: true }));
  };

  const addReviveHistoryEntry = () => {
    const targetCharacter = characters.find(
      (character) => character.id === reviveTargetId,
    );
    if (!targetCharacter) {
      return;
    }

    setHistoryEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        action: translate("history.revive", "combatTracker", {
          character: selectedCharacter.name,
          target: targetCharacter.name,
        }),
      },
    ]);
    setDisabledActions((prev) => ({ ...prev, revive: true }));
  };

  const addReanimateHistoryEntry = () => {
    const targetCharacter = characters.find(
      (character) => character.id === reanimateTargetId,
    );
    if (!targetCharacter) {
      return;
    }

    setHistoryEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        action: translate("history.reanimate", "combatTracker", {
          character: selectedCharacter.name,
          target: targetCharacter.name,
        }),
      },
    ]);
    setDisabledActions((prev) => ({ ...prev, reanimate: true }));
  };

  const resetRevivedCharacter = (character: CombatCharacter) => ({
    ...character,
    hp: 1,
    alternativeHp: 0,
    tempHp: 0,
    isDead: false,
    isDying: false,
    deathSaveThrowsLeft: 3,
    states: [],
  });

  const createUniqueStateId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }

    return `state-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const handleDamage = (
    damagedCharacter: CombatCharacter,
    damage: number,
  ): CombatCharacter => {
    const updatedCharacter = { ...damagedCharacter };
    let remainingDamage: number = 0;
    // Order is important here
    // First : temporary HP
    // Second : alternative HP
    // Third : character was already dying ? He's dead now
    // Last, if none above : just take damage

    // If a character has temporary HP, they will lose these first
    if (updatedCharacter.tempHp) {
      updatedCharacter.tempHp -= damage;
      if (updatedCharacter.tempHp <= 0) {
        remainingDamage = Math.abs(updatedCharacter.tempHp);
        updatedCharacter.tempHp = undefined;
      }

      // If there are no remaining damage, we can stop here
      if (remainingDamage === 0) {
        return updatedCharacter;
      }
    }

    // If a character has alternative HP, they will lose these instead of their actual HP
    // For example, they could be transformed into a bear, and have the bear's HP as alternative HP
    // When the bear loses all its HP, then the character turns backs into their usual self (and use their HP again)
    // If the character already has taken damage, we will apply the remaining damage to their alternative HP
    if (updatedCharacter.alternativeHp) {
      updatedCharacter.alternativeHp -=
        remainingDamage > 0 ? remainingDamage : damage;
      if (updatedCharacter.alternativeHp <= 0) {
        remainingDamage = Math.abs(updatedCharacter.alternativeHp);
        updatedCharacter.alternativeHp = undefined;
      }
      if (remainingDamage === 0) {
        return updatedCharacter;
      }
    }

    // If a dying character takes damage, and has no temporary or alternative HP to tank them, they die
    if (
      updatedCharacter.isDying &&
      (remainingDamage > 0 ? remainingDamage : damage) > 0
    ) {
      updatedCharacter.isDead = true;
      updatedCharacter.isDying = false;
      updatedCharacter.deathSaveThrowsLeft = 3;
      return updatedCharacter;
    }

    // Now they lose their HP
    // If they have 0 HP or less, they're dying
    updatedCharacter.hp -= remainingDamage > 0 ? remainingDamage : damage;
    if (updatedCharacter.hp <= 0) {
      updatedCharacter.isDying = true;
    }

    return updatedCharacter;
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabledActions.submit) {
      return;
    }
    setDisabledActions((prev) => ({ ...prev, submit: true }));
    const updatedCharacters = [...characters];
    let hasCharacterChanges = false;

    // Handle attack
    if (attackTargetId && attackDamage) {
      const targetCharacterIndex = findCharacterIndexById(
        updatedCharacters,
        attackTargetId,
      );
      if (targetCharacterIndex === -1) {
        console.error("attack target not found", attackTargetId);
      } else {
        updatedCharacters[targetCharacterIndex] = handleDamage(
          updatedCharacters[targetCharacterIndex],
          attackDamage,
        );
        hasCharacterChanges = true;
      }
    }

    // Handle spell used
    if (spellUsedLevel !== null) {
      const spellSlotsLeft =
        updatedCharacters.find(
          (character) => character.id === selectedCharacter.id,
        )?.spellSlotsLeft ?? {};
      const remainingSlots = spellSlotsLeft[spellUsedLevel];
      if (typeof remainingSlots === "number" && remainingSlots > 0) {
        const updatedSpellSlots = {
          ...spellSlotsLeft,
          [spellUsedLevel]: remainingSlots - 1,
        };
        const selectedCharacterIndex = findCharacterIndexById(
          updatedCharacters,
          selectedCharacter.id,
        );
        updatedCharacters[selectedCharacterIndex] = {
          ...updatedCharacters[selectedCharacterIndex],
          spellSlotsLeft: updatedSpellSlots,
        };
        hasCharacterChanges = true;
      }
    }

    // Handle inflicted state
    if (inflictedStateName && inflictedStateTargetId) {
      const targetCharIndex = findCharacterIndexById(
        updatedCharacters,
        inflictedStateTargetId,
      );
      if (targetCharIndex !== -1) {
        const newState = {
          id: createUniqueStateId(),
          name: inflictedStateName,
          ...(!!inflictedStateDuration
            ? { numberOfTurns: inflictedStateDuration }
            : {}),
          ...(!!inflictedStateSaveThrowStat
            ? { saveThrowStat: inflictedStateSaveThrowStat }
            : {}),
          ...(!!inflictedStateSaveThrowDc
            ? { saveThrowDc: inflictedStateSaveThrowDc }
            : {}),
        };
        const updatedCharacter = {
          ...updatedCharacters[targetCharIndex],
          states: [
            ...(updatedCharacters[targetCharIndex].states ?? []),
            newState,
          ],
        };
        updatedCharacters[targetCharIndex] = updatedCharacter;
        hasCharacterChanges = true;
      }
    }

    if (reviveTargetId) {
      const targetCharacterIndex = findCharacterIndexById(
        updatedCharacters,
        reviveTargetId,
      );
      if (
        targetCharacterIndex !== -1 &&
        updatedCharacters[targetCharacterIndex].isDying
      ) {
        updatedCharacters[targetCharacterIndex] = {
          ...resetRevivedCharacter(updatedCharacters[targetCharacterIndex]),
        };
        hasCharacterChanges = true;
      }
    }

    if (reanimateTargetId) {
      const targetCharacterIndex = findCharacterIndexById(
        updatedCharacters,
        reanimateTargetId,
      );
      if (
        targetCharacterIndex !== -1 &&
        updatedCharacters[targetCharacterIndex].isDead
      ) {
        updatedCharacters[targetCharacterIndex] = resetRevivedCharacter(
          updatedCharacters[targetCharacterIndex],
        );
        hasCharacterChanges = true;
      }
    }

    if (hasCharacterChanges) {
      onCharactersChange(updatedCharacters);
    }

    // Handle history
    if (historyEntries.length > 0) {
      onHistoryEdited(historyEntries.map((entry) => entry.action));
    }
  };

  return (
    <form className={styles["attack-form"]} onSubmit={onSubmit}>
      <h2 className={styles["attack-form__title"]}>
        {translate("attack.turnTitle", "combatTracker", {
          character: selectedCharacter.name,
        })}
      </h2>
      <div>
        {characters.some((character) => character.isDying) && (
          <fieldset className={styles["attack-form__fieldset"]}>
            <h3 className={styles["attack-form__fieldset-title"]}>
              {translate("attack.reviveTitle", "combatTracker")}
            </h3>
            <TargetInput
              characters={characters.filter((character) => character.isDying)}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setReviveTargetId(event.target.value)
              }
              inputName="reviveTargetId"
            />
            <ButtonWithIcon
              variant={ButtonVariant.SECONDARY}
              label={translate("attack.revive", "combatTracker")}
              faIcon="hand-holding-medical"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              type="button"
              disabled={disabledActions.revive}
              onClick={addReviveHistoryEntry}
            />
          </fieldset>
        )}
        {characters.some((character) => character.isDead) && (
          <fieldset className={styles["attack-form__fieldset"]}>
            <h3 className={styles["attack-form__fieldset-title"]}>
              {translate("attack.reanimateTitle", "combatTracker")}
            </h3>
            <TargetInput
              characters={characters.filter((character) => character.isDead)}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setReanimateTargetId(event.target.value)
              }
              inputName="reanimateTargetId"
            />
            <ButtonWithIcon
              variant={ButtonVariant.SECONDARY}
              label={translate("attack.reanimate", "combatTracker")}
              faIcon="heart-pulse"
              faIconStyle={FaIconStyleEnum.SOLID}
              iconPosition="left"
              type="button"
              disabled={disabledActions.reanimate}
              onClick={addReanimateHistoryEntry}
            />
          </fieldset>
        )}
        <fieldset className={styles["attack-form__fieldset"]}>
          <h3 className={styles["attack-form__fieldset-title"]}>
            {translate("attack.attack", "combatTracker")}
          </h3>
          <TargetInput
            characters={characters ?? []}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setAttackTargetId(event.target.value)
            }
            inputName="targetName"
          />
          <label htmlFor="damage">
            {translate("attack.damage", "combatTracker")}
          </label>
          <input
            type="number"
            value={attackDamage ?? 0}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setAttackDamage(+event.target.value)
            }
            name="attackDamage"
            id="attackDamage"
            min="0"
            data-testid="attackDamage"
          />
          <ButtonWithIcon
            variant={ButtonVariant.SECONDARY}
            label={translate("attack.validate", "combatTracker")}
            faIcon="check"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
            type="button"
            disabled={disabledActions.attack}
            onClick={() => addAttackHistoryEntry()}
          />
        </fieldset>
        <fieldset className={styles["attack-form__fieldset"]}>
          <h3 className={styles["attack-form__fieldset-title"]}>
            {translate("attack.spellUsed", "combatTracker")}
          </h3>
          {!!Object.values(selectedCharacter?.spellSlotsLeft ?? {})?.length && (
            <>
              <label htmlFor="spellUsedLevel">
                {translate("form.level", "combatTracker")}
              </label>
              <select
                name="spellUsedLevel"
                id="spellUsedLevel"
                value={spellUsedLevel ?? ""}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  setSpellUsedLevel(
                    event.target.value === "" ? null : +event.target.value,
                  )
                }
              >
                <option value="">
                  {translate("attack.chooseLevel", "combatTracker")}
                </option>
                {Object.keys(selectedCharacter?.spellSlotsLeft ?? {}).map(
                  (level) => (
                    <option
                      key={level}
                      value={+level}
                      disabled={
                        +(selectedCharacter?.spellSlotsLeft?.[+level] ?? 0) <= 0
                      }
                    >
                      {level} (
                      {translate("attack.slotsRemaining", "combatTracker", {
                        count: String(
                          selectedCharacter?.spellSlotsLeft?.[+level],
                        ),
                      })}
                      )
                    </option>
                  ),
                )}
              </select>
            </>
          )}
          <label htmlFor="spellUsedName">
            {translate("form.name", "combatTracker")}
          </label>
          <input
            type="text"
            value={spellUsedName ?? ""}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSpellUsedName(event.target.value)
            }
            name="spellUsedName"
            id="spellUsedName"
          />
          <ButtonWithIcon
            variant={ButtonVariant.SECONDARY}
            label={translate("attack.validate", "combatTracker")}
            faIcon="check"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
            type="button"
            disabled={disabledActions.spell}
            onClick={() => addSpellUsedHistoryEntry()}
          />
        </fieldset>
        <fieldset className={styles["attack-form__fieldset"]}>
          <h3 className={styles["attack-form__fieldset-title"]}>
            {translate("attack.states", "combatTracker")}
          </h3>
          <>
            <TargetInput
              characters={characters ?? []}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setInflictedStateTargetId(event.target.value)
              }
              inputName="inflictedStateTargetName"
            />
          </>
          <>
            <label htmlFor="inflictedStateName">
              {translate("form.name", "combatTracker")}
            </label>
            <input
              name="inflictedStateName"
              id="inflictedStateName"
              type="text"
              value={inflictedStateName ?? ""}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setInflictedStateName(event.target.value)
              }
            />
          </>
          <>
            <label htmlFor="inflictedStateDuration">
              {translate("attack.duration", "combatTracker")}
            </label>
            <input
              name="inflictedStateDuration"
              id="inflictedStateDuration"
              type="number"
              value={inflictedStateDuration ?? 0}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setInflictedStateDuration(+event.target.value)
              }
            />
          </>
          <>
            <label htmlFor="inflictedStateSaveThrowStat">
              {translate("attack.saveStat", "combatTracker")}
            </label>
            <input
              name="inflictedStateSaveThrowStat"
              id="inflictedStateSaveThrowStat"
              type="text"
              value={inflictedStateSaveThrowStat ?? ""}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setInflictedSaveThrowStat(event.target.value)
              }
            />
          </>
          <>
            <label htmlFor="inflictedStateSaveThrowDc">
              {translate("attack.saveDc", "combatTracker")}
            </label>
            <input
              name="inflictedStateSaveThrowDc"
              id="inflictedStateSaveThrowDc"
              type="number"
              value={inflictedStateSaveThrowDc ?? 0}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setInflictedStateSaveThrowDc(+event.target.value)
              }
            />
          </>
          <ButtonWithIcon
            variant={ButtonVariant.SECONDARY}
            label={translate("form.add", "combatTracker")}
            faIcon="plus"
            faIconStyle={FaIconStyleEnum.SOLID}
            iconPosition="left"
            type="button"
            disabled={disabledActions.state}
            onClick={() => addInflictedStateHistoryEntry()}
          />
        </fieldset>
      </div>
      <div>
        <fieldset className={styles["attack-form__fieldset"]}>
          {historyEntries.map((entry) => (
            <p className={styles["attack-form__history-entry"]} key={entry.id}>
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
  );
};

export default AttackForm;
