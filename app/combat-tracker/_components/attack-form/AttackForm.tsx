import { useState } from "react";
import {
  CombatCharacter,
  CombatHistoryEntry,
  findCharacterIndexByName,
} from "../../page";
import styles from "./attack-form.module.scss";
import SubmitButton from "@/app/_components/_basics/submit-button/SubmitButton";
import ButtonWithIcon from "@/app/_components/_basics/button-with-icon/ButtonWithIcon";
import { ButtonVariant } from "@/app/_lib/enums/button-variant.enum";
import { FaIconStyleEnum } from "@/app/_lib/enums/fa-icon.style.enum";
import TargetInput from "./target-input/TargetInput";

type AttackFormProps = {
  characters: CombatCharacter[];
  selectedCharacter: CombatCharacter;
  onCharacterChange: (character: CombatCharacter) => void;
  onHistoryEdited: (historyEntry: string[]) => void;
};

type Attack = {
  targetName: string;
  damage: number;
  spellUsedLevel: number;
};

const AttackForm = ({
  characters,
  selectedCharacter,
  onCharacterChange,
  onHistoryEdited,
}: AttackFormProps) => {
  const [attackTargetName, setAttackTargetName] = useState<string | null>(null);
  const [attackDamage, setAttackDamage] = useState<number | null>(null);
  const [spellUsedName, setSpellUsedName] = useState<string | null>(null);
  const [spellUsedLevel, setSpellUsedLevel] = useState<number | null>(null);
  const [inflictedStateTargetName, setInflictedStateTargetName] = useState<
    string | null
  >(null);
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
  const [historyEntries, setHistoryEntries] = useState<string[]>([]);

  const addAttackHistoryEntry = () => {
    setHistoryEntries((prev) => {
      return [
        ...prev,
        `${selectedCharacter.name} attaque ${attackTargetName} pour ${attackDamage} PV.`,
      ];
    });
  };

  const addSpellUsedkHistoryEntry = () => {
    setHistoryEntries((prev) => {
      return [
        ...prev,
        `${selectedCharacter.name} utilise le sort ${spellUsedName} de niveau ${spellUsedLevel}`,
      ];
    });
  };

  const addInflictedState = () => {
    if (!inflictedStateName || !inflictedStateTargetName) {
      console.log("return");
      return;
    }

    const targetCharIndex = findCharacterIndexByName(
      characters,
      inflictedStateTargetName,
    );

    if (targetCharIndex === -1) {
      console.log("error, character not found", inflictedStateTargetName);
      return;
    }

    const newState = {
      name: inflictedStateName!,
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
    const updatedCharacter = { ...characters[targetCharIndex] };
    if (!updatedCharacter.states) {
      updatedCharacter.states = [];
    }
    updatedCharacter.states.push(newState);
    const updatedCharacters: CombatCharacter[] = [...(characters ?? [])];
    updatedCharacters[targetCharIndex] = updatedCharacter;
    onCharacterChange(updatedCharacter);

    setHistoryEntries((prev) => {
      return [
        ...prev,
        `${selectedCharacter.name} donne l'état ${inflictedStateName} à ${inflictedStateTargetName} pendant ${inflictedStateDuration ?? '-' } tours`,
      ];
    });
  };

  const handleDamage = (damagedCharacter: CombatCharacter, damage: number) => {
    // Order is important here
    // First : alternative HP
    // Second : character was already dying ? He's dead now
    // Last, if none above : just take damage

    // If a character has alternative HP, they will lose these instead of their actual HP
    // For example, they could be transformed into a bear, and have the bear's HP as alternative HP
    // When the bear loses all its HP, then the character turns backs into their usual self (and use their HP again)
    if (damagedCharacter.alternativeHp) {
      damagedCharacter.alternativeHp -= damage;
      if (damagedCharacter.alternativeHp <= 0) {
        damagedCharacter.alternativeHp = undefined;
      }
      return;
    }

    // If a dying character takes damage, they die
    if (damagedCharacter.isDying && damage > 0) {
      damagedCharacter.isDead = true;
      damagedCharacter.isDying = false;
      damagedCharacter.deathSaveThrowsLeft = 3;
      return;
    }

    // Now they lose their HP
    // If they have 0 HP or less, they're dying
    damagedCharacter.hp -= damage;
    if (damagedCharacter.hp <= 0) {
      damagedCharacter.isDying = true;
    }
  };

  console.log(historyEntries);

  const onSubmit = () => {
    // Handle attack
    if (attackTargetName && attackDamage) {
      const targetCharacter = characters?.find(
        (char) => char.name === attackTargetName,
      );
      if (!targetCharacter) {
        console.error("attack target not found", targetCharacter);
        return;
      }

      handleDamage(targetCharacter, attackDamage);
      onCharacterChange(targetCharacter);
    }

    // Handle spell used
    if (spellUsedLevel) {
      const updatedSpellSlots = { ...selectedCharacter.spellSlotsLeft };
      updatedSpellSlots[spellUsedLevel] -= 1;
      onCharacterChange({
        ...selectedCharacter,
        spellSlotsLeft: updatedSpellSlots,
      });
    }

    // Handle history
    if (historyEntries.length > 0) {
      onHistoryEdited(historyEntries);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <h3>Attaque</h3>
        <TargetInput
          characters={characters ?? []}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setAttackTargetName(event.target.value)
          }
          inputName="targetName"
        />
        <label htmlFor="damage">Dégâts</label>
        <input
          type="number"
          value={attackDamage ?? 0}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setAttackDamage(+event.target.value)
          }
          name="attackDamage"
          id="attackDamage"
        />
        <ButtonWithIcon
          variant={ButtonVariant.SECONDARY}
          label="Valider"
          faIcon="check"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          type="button"
          onClick={() => addAttackHistoryEntry()}
        />
      </fieldset>
      <fieldset>
        <h3>Sort utilisé</h3>
        {!!Object.values(selectedCharacter?.spellSlotsLeft ?? {})?.length && (
          <>
            <label htmlFor="spellUsedLevel">Niveau</label>
            <select
              name="spellUsedLevel"
              id="spellUsedLevel"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setSpellUsedLevel(+event.target.value)
              }
            >
              {Object.keys(selectedCharacter?.spellSlotsLeft ?? {}).map(
                ([level, value]) => (
                  <option key={level} value={level} disabled={+value > 0}>
                    {level}
                  </option>
                ),
              )}
            </select>
          </>
        )}
        <label htmlFor="spellUsedName">Nom</label>
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
          label="Valider"
          faIcon="check"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          type="button"
          onClick={() => addSpellUsedkHistoryEntry()}
        />
      </fieldset>
      <fieldset>
        <h3>États</h3>
        <>
          <TargetInput
            characters={characters ?? []}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setInflictedStateTargetName(event.target.value)
            }
            inputName="inflictedStateTargetName"
          />
        </>
        <>
          <label htmlFor="inflictedStateName">Nom</label>
          <input
            name="inflictedStateName"
            id="inflictedStateName"
            type="text"
            value={inflictedStateName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setInflictedStateName(event.target.value)
            }
          />
        </>
        <>
          <label htmlFor="inflictedStateDuration">Durée</label>
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
            Save (caractéristique)
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
          <label htmlFor="inflictedStateSaveThrowDc">DC Save</label>
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
          label="Ajouter"
          faIcon="plus"
          faIconStyle={FaIconStyleEnum.SOLID}
          iconPosition="left"
          type="button"
          onClick={() => addInflictedState()}
        />
      </fieldset>
      <fieldset>
        {attackTargetName && attackDamage && (
          <>
            {`${selectedCharacter.name} attaque ${characters?.find((char) => char.name === attackTargetName)?.name} pour ${attackDamage} PV.`}
          </>
        )}
        {spellUsedLevel && (
          <>
            {`${selectedCharacter.name} utilise 1 sort de level ${spellUsedLevel}.`}
          </>
        )}
      </fieldset>
      <SubmitButton label="Enregistrer" />
    </form>
  );
};

export default AttackForm;
