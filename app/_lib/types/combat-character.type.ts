import { AbilityEnum } from "../enums/ability.enum";
import { NpcAttitudeEnum } from "../enums/npc-attitude.enum";
import { CombatAction } from "./combat-action.type";
import { CombatState } from "./combat-state.type";

export type CombatCharacter = {
  id: string;
  name: string;
  shortDescription?: string;
  imageUrl?: string;
  /** Page the character was imported from, e.g. https://bg3.wiki/wiki/Kagha */
  wikiLink?: string;
  hp: number;
  maxHp: number;
  alternativeHp?: number;
  maxAlternativeHp?: number;
  tempHp?: number;
  isDying: boolean;
  isDead: boolean;
  isNpc: boolean;
  /** Only used for NPCs, unknown when missing */
  attitude?: NpcAttitudeEnum;
  deathSaveThrowsLeft: number;
  ac: number;
  /** The initiative roll plus the initiative bonus: sorts the turn order */
  initiativeScore: number;
  /** The d20 roll entered in the form, without the bonus */
  initiativeRoll?: number;
  /** In meters */
  movement?: number;
  proficiencyBonus?: number;
  abilities?: Partial<Record<AbilityEnum, number>>;
  savingThrows?: Partial<Record<AbilityEnum, number>>;
  spellSlotsLeft?: Record<string, number>;
  states?: CombatState[];
  passives?: string[];
  actions?: CombatAction[];
  usableObjects?: string[];
};
