export type CombatActionDamage = {
  dice: string;
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
