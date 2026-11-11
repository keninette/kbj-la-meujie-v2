import type { AbilityEnum } from "../enums/ability.enum";

export type CombatActionDamage = {
  /** "1d8+1", or "weapon" when the weapon is unknown */
  dice: string;
  /** With both hands, for a versatile weapon: "1d10+1" */
  versatileDice?: string;
  /** Ability whose modifier is added to a weapon's damage; both when it's
   * the best of the two and the scores are unknown (a finesse weapon) */
  abilities?: AbilityEnum[];
  type?: string;
};

export type CombatAction = {
  name: string;
  type?: string;
  /**
   * What using it costs: "action", "bonus", "reaction" and/or resources keyed
   * like CombatCharacter.spellSlotsLeft ("2" for a level 2 slot, "wldshp"...),
   * followed by ":<amount>" when more than one is used ("layonh:2")
   */
  costs: string[];
  spellLevel?: number;
  damages?: CombatActionDamage[];
  /** Saving throw ability, e.g. "CON" */
  save?: string;
  isConcentration?: boolean;
  /** "Short rest", "Per turn"... */
  recharge?: string;
  /** Weapon or item used, e.g. "Dagger" for a Main Hand Attack */
  item?: string;
  description?: string;
  iconUrl?: string;
  wikiLink?: string;
};
