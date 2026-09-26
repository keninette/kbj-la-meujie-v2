import { findCharacterIndexById } from "@/app/_lib/combat/combat.helper";
import type { CombatCharacter } from "@/app/_lib/types/combat-character.type";

export type AttackFormValues = {
  attackTargetId: string;
  attackDamage: number;
  spellUsedName: string;
  spellUsedLevel: number | null;
  inflictedStateTargetId: string;
  inflictedStateName: string;
  inflictedStateDuration: number | null;
  inflictedStateSaveThrowStat: string;
  inflictedStateSaveThrowDc: number | null;
  reviveTargetId: string;
  reanimateTargetId: string;
};

export type ApplyAttackFormResult = {
  characters: CombatCharacter[];
  hasChanges: boolean;
  missingAttackTargetId: string | null;
};

export const applyDamageToCharacter = (
  damagedCharacter: CombatCharacter,
  damage: number,
): CombatCharacter => {
  const updatedCharacter = { ...damagedCharacter };
  let remainingDamage = 0;

  if (updatedCharacter.tempHp) {
    updatedCharacter.tempHp -= damage;
    if (updatedCharacter.tempHp <= 0) {
      remainingDamage = Math.abs(updatedCharacter.tempHp);
      updatedCharacter.tempHp = undefined;
    }

    if (remainingDamage === 0) {
      return updatedCharacter;
    }
  }

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

  if (
    updatedCharacter.isDying &&
    (remainingDamage > 0 ? remainingDamage : damage) > 0
  ) {
    updatedCharacter.isDead = true;
    updatedCharacter.isDying = false;
    updatedCharacter.deathSaveThrowsLeft = 3;
    return updatedCharacter;
  }

  updatedCharacter.hp -= remainingDamage > 0 ? remainingDamage : damage;
  if (updatedCharacter.hp <= 0) {
    updatedCharacter.isDying = true;
  }

  return updatedCharacter;
};

export const resetRevivedCharacter = (
  character: CombatCharacter,
): CombatCharacter => ({
  ...character,
  hp: 1,
  alternativeHp: 0,
  tempHp: 0,
  isDead: false,
  isDying: false,
  deathSaveThrowsLeft: 3,
  states: [],
});

export const applyAttackFormValues = (
  characters: CombatCharacter[],
  selectedCharacterId: string,
  values: AttackFormValues,
  createStateId: () => string,
): ApplyAttackFormResult => {
  const updatedCharacters = [...characters];
  let hasChanges = false;
  let missingAttackTargetId: string | null = null;

  if (values.attackTargetId && values.attackDamage) {
    const targetCharacterIndex = findCharacterIndexById(
      updatedCharacters,
      values.attackTargetId,
    );
    if (targetCharacterIndex === -1) {
      missingAttackTargetId = values.attackTargetId;
    } else {
      updatedCharacters[targetCharacterIndex] = applyDamageToCharacter(
        updatedCharacters[targetCharacterIndex],
        values.attackDamage,
      );
      hasChanges = true;
    }
  }

  if (values.spellUsedLevel !== null) {
    const selectedCharacterIndex = findCharacterIndexById(
      updatedCharacters,
      selectedCharacterId,
    );
    const spellSlotsLeft =
      updatedCharacters[selectedCharacterIndex]?.spellSlotsLeft ?? {};
    const remainingSlots = spellSlotsLeft[values.spellUsedLevel];
    if (typeof remainingSlots === "number" && remainingSlots > 0) {
      updatedCharacters[selectedCharacterIndex] = {
        ...updatedCharacters[selectedCharacterIndex],
        spellSlotsLeft: {
          ...spellSlotsLeft,
          [values.spellUsedLevel]: remainingSlots - 1,
        },
      };
      hasChanges = true;
    }
  }

  if (values.inflictedStateName && values.inflictedStateTargetId) {
    const targetCharacterIndex = findCharacterIndexById(
      updatedCharacters,
      values.inflictedStateTargetId,
    );
    if (targetCharacterIndex !== -1) {
      const newState = {
        id: createStateId(),
        name: values.inflictedStateName,
        ...(!!values.inflictedStateDuration
          ? { numberOfTurns: values.inflictedStateDuration }
          : {}),
        ...(!!values.inflictedStateSaveThrowStat
          ? { saveThrowStat: values.inflictedStateSaveThrowStat }
          : {}),
        ...(!!values.inflictedStateSaveThrowDc
          ? { saveThrowDc: values.inflictedStateSaveThrowDc }
          : {}),
      };
      updatedCharacters[targetCharacterIndex] = {
        ...updatedCharacters[targetCharacterIndex],
        states: [
          ...(updatedCharacters[targetCharacterIndex].states ?? []),
          newState,
        ],
      };
      hasChanges = true;
    }
  }

  if (values.reviveTargetId) {
    const targetCharacterIndex = findCharacterIndexById(
      updatedCharacters,
      values.reviveTargetId,
    );
    if (
      targetCharacterIndex !== -1 &&
      updatedCharacters[targetCharacterIndex].isDying
    ) {
      updatedCharacters[targetCharacterIndex] = resetRevivedCharacter(
        updatedCharacters[targetCharacterIndex],
      );
      hasChanges = true;
    }
  }

  if (values.reanimateTargetId) {
    const targetCharacterIndex = findCharacterIndexById(
      updatedCharacters,
      values.reanimateTargetId,
    );
    if (
      targetCharacterIndex !== -1 &&
      updatedCharacters[targetCharacterIndex].isDead
    ) {
      updatedCharacters[targetCharacterIndex] = resetRevivedCharacter(
        updatedCharacters[targetCharacterIndex],
      );
      hasChanges = true;
    }
  }

  return { characters: updatedCharacters, hasChanges, missingAttackTargetId };
};
