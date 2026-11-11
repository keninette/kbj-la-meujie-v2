/** Damage types of Baldur's Gate 3: the bg3.wiki names, in lowercase */
export enum DamageTypeEnum {
  BLUDGEONING = "bludgeoning",
  PIERCING = "piercing",
  SLASHING = "slashing",
  ACID = "acid",
  COLD = "cold",
  FIRE = "fire",
  FORCE = "force",
  LIGHTNING = "lightning",
  NECROTIC = "necrotic",
  POISON = "poison",
  PSYCHIC = "psychic",
  RADIANT = "radiant",
  THUNDER = "thunder",
  HEALING = "healing",
}

export const DAMAGE_TYPES = Object.values(DamageTypeEnum);
