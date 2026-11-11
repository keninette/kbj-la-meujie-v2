import { AbilityEnum } from "../enums/ability.enum";
import { NpcAttitudeEnum } from "../enums/npc-attitude.enum";
import { CombatAction } from "./combat-action.type";
import { CombatCondition } from "./combat-condition.type";

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
  attitude?: NpcAttitudeEnum;
  deathSaveThrowsLeft: number;
  ac: number;
  /** The initiative roll plus the initiative bonus: sorts the turn order */
  initiativeScore: number;
  /** The d20 roll entered in the form, without the bonus */
  initiativeRoll: number;
  movement?: number;
  proficiencyBonus?: number;
  abilities?: Partial<Record<AbilityEnum, number>>;
  savingThrows?: Partial<Record<AbilityEnum, number>>;
  /** Uses left of each action resource, by id: "2" (a level 2 spell slot),
   * "wldshp"... (see bg3-action-resources.ts) */
  actionResourcesLeft?: Record<string, number>;
  conditions?: CombatCondition[];
  passives?: string[];
  actions?: CombatAction[];
  usableObjects?: string[];
};
