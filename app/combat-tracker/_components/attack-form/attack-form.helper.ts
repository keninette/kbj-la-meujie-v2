import { findCharacterIndexById } from "@/app/_lib/combat/combat.helper";
import type { CombatCharacter } from "@/app/_lib/types/combat-character.type";

export type AttackFormValues = {
  attackTargetId: string;
  attackDamage: number;
  healTargetId: string;
  healAmount: number;
  spellUsedName: string;
  spellUsedLevel: string | null;
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

// Defaults to the alternative HP value when no maximum was set.
export const getMaxAlternativeHp = (
  character: CombatCharacter,
): number | undefined => character.maxAlternativeHp || character.alternativeHp;

export const applyDamageToCharacter = (
  damagedCharacter: CombatCharacter,
  damage: number,
): CombatCharacter => {
  const updatedCharacter = {
    ...damagedCharacter,
    maxAlternativeHp: getMaxAlternativeHp(damagedCharacter),
  };
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
      updatedCharacter.maxAlternativeHp = undefined;
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

// Never adds temporary HP, and never heals past the maximum.
export const applyHealToCharacter = (
  healedCharacter: CombatCharacter,
  heal: number,
): CombatCharacter => {
  if (healedCharacter.isDead || heal <= 0) {
    return healedCharacter;
  }

  const updatedCharacter = { ...healedCharacter };

  // Alternative HP takes the whole heal: points above their maximum are lost.
  if (updatedCharacter.alternativeHp) {
    const maxAlternativeHp =
      getMaxAlternativeHp(updatedCharacter) ?? updatedCharacter.alternativeHp;
    updatedCharacter.alternativeHp = Math.max(
      updatedCharacter.alternativeHp,
      Math.min(updatedCharacter.alternativeHp + heal, maxAlternativeHp),
    );
    return updatedCharacter;
  }

  // A dying character's HP can be negative: healing starts from 0.
  updatedCharacter.hp = Math.max(
    updatedCharacter.hp,
    Math.min(Math.max(updatedCharacter.hp, 0) + heal, updatedCharacter.maxHp),
  );
  if (updatedCharacter.isDying && updatedCharacter.hp > 0) {
    updatedCharacter.isDying = false;
    updatedCharacter.deathSaveThrowsLeft = 3;
  }

  return updatedCharacter;
};

export const resetRevivedCharacter = (
  character: CombatCharacter,
): CombatCharacter => ({
  ...character,
  hp: 1,
  alternativeHp: 0,
  maxAlternativeHp: undefined,
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

  if (values.healTargetId && values.healAmount) {
    const targetCharacterIndex = findCharacterIndexById(
      updatedCharacters,
      values.healTargetId,
    );
    if (
      targetCharacterIndex !== -1 &&
      !updatedCharacters[targetCharacterIndex].isDead
    ) {
      updatedCharacters[targetCharacterIndex] = applyHealToCharacter(
        updatedCharacters[targetCharacterIndex],
        values.healAmount,
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
