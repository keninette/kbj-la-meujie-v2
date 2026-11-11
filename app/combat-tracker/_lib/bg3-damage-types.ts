import { DamageTypeEnum } from "@/app/_lib/enums/damage-type.enum";

/** Icon of each damage type, from bg3.wiki */
export const DAMAGE_TYPE_ICON_URLS: Record<DamageTypeEnum, string> = {
  [DamageTypeEnum.BLUDGEONING]:
    "https://bg3.wiki/w/images/7/7d/Bludgeoning_Damage_Icon.png",
  [DamageTypeEnum.PIERCING]:
    "https://bg3.wiki/w/images/0/0b/Piercing_Damage_Icon.png",
  [DamageTypeEnum.SLASHING]:
    "https://bg3.wiki/w/images/f/f0/Slashing_Damage_Icon.png",
  [DamageTypeEnum.ACID]: "https://bg3.wiki/w/images/5/5f/Acid_Damage_Icon.png",
  [DamageTypeEnum.COLD]: "https://bg3.wiki/w/images/0/05/Cold_Damage_Icon.png",
  [DamageTypeEnum.FIRE]: "https://bg3.wiki/w/images/8/84/Fire_Damage_Icon.png",
  [DamageTypeEnum.FORCE]:
    "https://bg3.wiki/w/images/d/d1/Force_Damage_Icon.png",
  [DamageTypeEnum.LIGHTNING]:
    "https://bg3.wiki/w/images/3/31/Lightning_Damage_Icon.png",
  [DamageTypeEnum.NECROTIC]:
    "https://bg3.wiki/w/images/3/39/Necrotic_Damage_Icon.png",
  [DamageTypeEnum.POISON]:
    "https://bg3.wiki/w/images/5/55/Poison_Damage_Icon.png",
  [DamageTypeEnum.PSYCHIC]:
    "https://bg3.wiki/w/images/0/04/Psychic_Damage_Icon.png",
  [DamageTypeEnum.RADIANT]:
    "https://bg3.wiki/w/images/7/78/Radiant_Damage_Icon.png",
  [DamageTypeEnum.THUNDER]:
    "https://bg3.wiki/w/images/8/87/Thunder_Damage_Icon.png",
  [DamageTypeEnum.HEALING]: "https://bg3.wiki/w/images/a/ac/Healing_Icon.png",
};
