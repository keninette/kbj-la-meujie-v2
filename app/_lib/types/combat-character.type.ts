import { CombatState } from "./combat-state.type";

export type CombatCharacter = {
  id: string;
  name: string;
  /** Remote picture, e.g. the portrait from bg3.wiki */
  imageUrl?: string;
  hp: number;
  maxHp: number;
  alternativeHp?: number;
  maxAlternativeHp?: number;
  tempHp?: number;
  isDying: boolean;
  isDead: boolean;
  isNpc: boolean;
  deathSaveThrowsLeft: number;
  ac: number;
  initiativeScore: number;
  spellSlotsLeft?: Record<string, number>;
  states?: CombatState[];
  passives?: string[];
  usableObjects?: string[];
};
