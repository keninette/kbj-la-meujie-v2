import { CombatState } from "./combat-state.type";

export type CombatCharacter = {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  alternativeHp?: number;
  tempHp?: number;
  isDying: boolean;
  isDead: boolean;
  isNpc: boolean;
  deathSaveThrowsLeft: number;
  ac: number;
  initiativeScore: number;
  spellSlotsLeft?: Record<number, number>;
  states?: CombatState[];
};
