/**
 * The 200 passives most used by bg3.wiki's creatures, most used first: 96 % of
 * the passives listed in the infoboxes. "name" and "description" are the
 * original english texts. The french ones are in the "dndPassives" dictionary,
 * under "<id>.name" and "<id>.description": use getPassiveText() to read them.
 * Generated once from the wiki's "passives" table, see the bg3-wiki README.
 */
type Bg3PassiveData = {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  wikiLink: string;
};

const PASSIVES = [
  {
    id: "opportunity-attack",
    name: "Opportunity Attack",
    description: "Automatically attack an enemy moving out of your reach.",
    iconUrl: "https://bg3.wiki/w/images/3/35/Opportunity_Attack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Opportunity_Attack",
  },
  {
    id: "darkvision",
    name: "Darkvision",
    description: "Can see in the dark up to 12 m (40 ft).",
    iconUrl: "https://bg3.wiki/w/images/0/0d/Darkvision_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Darkvision",
  },
  {
    id: "extra-attack",
    name: "Extra Attack",
    description:
      "You can make an additional free attack after making an unarmed or weapon attack.",
    iconUrl: "https://bg3.wiki/w/images/5/5a/Extra_Attack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Extra_Attack",
  },
  {
    id: "fey-ancestry",
    name: "Fey Ancestry",
    description:
      "The Feywild casts a veil over your mind. You have Advantage on Saving Throws against being Charmed, and magic can't put you to Sleep.",
    iconUrl: "https://bg3.wiki/w/images/0/05/Fey_Ancestry_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Fey_Ancestry",
  },
  {
    id: "dwarven-resilience",
    name: "Dwarven Resilience",
    description:
      "You have Advantage on Saving Throws against being Poisoned and you have Resistance against Poison damage.",
    iconUrl: "https://bg3.wiki/w/images/1/16/Dwarven_Resilience_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Dwarven_Resilience",
  },
  {
    id: "fury-of-the-small",
    name: "Fury of the Small",
    description:
      "When you damage a creature larger than you, you can choose to deal 1d6 Physical extra. Limited to once per combat.",
    iconUrl: "https://bg3.wiki/w/images/c/c1/Generic_Damage_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Fury_of_the_Small",
  },
  {
    id: "gnome-cunning",
    name: "Gnome Cunning",
    description:
      "You have Advantage on Intelligence, Wisdom, and Charisma Saving Throws.",
    iconUrl: "https://bg3.wiki/w/images/0/02/Gnome_Cunning_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Gnome_Cunning",
  },
  {
    id: "shortened-stride",
    name: "Shortened Stride",
    description: "Your movement speed is 7.5 m (25 ft).",
    wikiLink: "https://bg3.wiki/wiki/Shortened_Stride",
  },
  {
    id: "sunlight-sensitivity",
    name: "Sunlight Sensitivity",
    description:
      "While in sunlight, this creature has Disadvantage on Attack Rolls and Perception checks that rely on sight.",
    iconUrl: "https://bg3.wiki/w/images/a/a2/Sunlight_Sensitivity_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Sunlight_Sensitivity",
  },
  {
    id: "hellish-resistance",
    name: "Hellish Resistance",
    description:
      "Your blood protects you from flame, abyssal or otherwise. Gain Resistance to Fire damage, taking only half damage from it.",
    iconUrl: "https://bg3.wiki/w/images/4/4c/Hellish_Resistance_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Hellish_Resistance",
  },
  {
    id: "great-weapon-fighting",
    name: "Great Weapon Fighting",
    description:
      "When you roll a 1 or 2 on a damage die for an attack with a Two-Handed melee weapon, that die is rerolled once.",
    iconUrl: "https://bg3.wiki/w/images/1/1f/Great_Weapon_Fighting_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Great_Weapon_Fighting",
  },
  {
    id: "brave",
    name: "Brave",
    description: "You have Advantage on Saving Throws against Frightened.",
    iconUrl: "https://bg3.wiki/w/images/c/ca/Brave_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Brave",
  },
  {
    id: "halfling-luck",
    name: "Halfling Luck",
    description:
      "When you roll a 1 for an Attack Roll, Ability Check, or Saving Throw, you can reroll the dice and must use the new roll.",
    iconUrl: "https://bg3.wiki/w/images/6/68/Halfling_Luck_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Halfling_Luck",
  },
  {
    id: "psionic-empowerment",
    name: "Psionic Empowerment",
    description:
      "Your attacks deal an extra 1d6 Psychic damage - the scars of illithid enslavement run deep.",
    iconUrl: "https://bg3.wiki/w/images/c/c3/Generic_Psychic_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Psionic_Empowerment",
  },
  {
    id: "evasion",
    name: "Evasion",
    description:
      "Your agility lets you dodge out of the way of certain spells. When a spell or effect would deal half damage on a successful Dexterity Saving Throw, it deals no damage if you succeed, and only half damage if you fail.",
    iconUrl: "https://bg3.wiki/w/images/7/7c/Evasion_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Evasion",
  },
  {
    id: "superior-darkvision",
    name: "Superior Darkvision",
    description: "Can see in the dark up to 24 m (80 ft).",
    iconUrl: "https://bg3.wiki/w/images/3/38/Superior_Darkvision_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Superior_Darkvision",
  },
  {
    id: "tenacity",
    name: "Tenacity",
    description:
      "When you miss a melee attack, you deal Strength Modifier Bludgeoning damage (minimum of 1) anyway.",
    iconUrl: "https://bg3.wiki/w/images/8/86/Tenacity_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Tenacity",
  },
  {
    id: "magic-resistance",
    name: "Magic Resistance",
    description:
      "Has Advantage on Saving Throws against Spells and other magical effects.",
    iconUrl: "https://bg3.wiki/w/images/5/5b/Generic_Magical_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Magic_Resistance",
  },
  {
    id: "riposte-passive-feature",
    name: "Riposte",
    description:
      "When a hostile creature misses you with a melee attack, expend a superiority die to retaliate with a powerful strike that deals an additional Superiority Die damage.",
    iconUrl: "https://bg3.wiki/w/images/7/76/Riposte_passive_feature_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Riposte_(passive_feature)",
  },
  {
    id: "crossbow-expert-point-blank",
    name: "Crossbow Expert: Point-Blank",
    description:
      "When you make crossbow attacks within melee range, the Attack Rolls do not have Disadvantage.",
    iconUrl:
      "https://bg3.wiki/w/images/0/0c/Crossbow_Expert_Point-Blank_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Crossbow_Expert:_Point-Blank",
  },
  {
    id: "archery",
    name: "Archery",
    description:
      "You gain a +2 bonus to Attack Rolls you make with ranged Weapons.",
    iconUrl: "https://bg3.wiki/w/images/8/83/Archery_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Archery",
  },
  {
    id: "phalanx-formation",
    name: "Phalanx Formation",
    description:
      "Has Advantage on Attack Rolls if within 3 m (10 ft) of an ally that carries a shield and isn't Incapacitated.",
    iconUrl: "https://bg3.wiki/w/images/2/20/Phalanx_Formation_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Phalanx_Formation",
  },
  {
    id: "protection",
    name: "Protection",
    description:
      "When you have a shield, impose Disadvantage on an enemy who attacks one of your allies when you are within 1.5 m (5 ft). You must be able to see the enemy.",
    iconUrl: "https://bg3.wiki/w/images/7/73/Protection_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Protection",
  },
  {
    id: "tactical-discipline",
    name: "Tactical Discipline",
    description:
      "You are an expert in mustering self-control to gain an edge over your foes. You gain Advantage on all Ability Checks and Saving Throws during combat.",
    iconUrl: "https://bg3.wiki/w/images/e/eb/Tactical_Discipline_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Tactical_Discipline",
  },
  {
    id: "divine-health",
    name: "Divine Health",
    description:
      "The divine magic flowing within you prevents disease from affecting you.",
    iconUrl: "https://bg3.wiki/w/images/1/1e/Divine_Health_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Divine_Health",
  },
  {
    id: "duergar-resilience",
    name: "Duergar Resilience",
    description:
      "An affected creature has Advantage on Saving Throws against Illusions and against being Charmed or Paralysed.",
    iconUrl: "https://bg3.wiki/w/images/6/66/Duergar_Resilience_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Duergar_Resilience",
  },
  {
    id: "land-s-stride-difficult-terrain",
    name: "Land's Stride: Difficult Terrain",
    description:
      "You have become an expert at moving through the wilderness. Difficult Terrain no longer slows you down.",
    iconUrl:
      "https://bg3.wiki/w/images/7/7f/Land%27s_Stride_Difficult_Terrain_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Land's_Stride:_Difficult_Terrain",
  },
  {
    id: "ethereal",
    name: "Ethereal",
    description:
      "Affected entity is incorporeal and can't be Shoved, Thrown, or used as an Improvised Melee Weapon",
    iconUrl: "https://bg3.wiki/w/images/9/9d/Generic_Ethereal_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Ethereal",
  },
  {
    id: "prey-upon-the-weak",
    name: "Prey Upon the Weak",
    description:
      "This weapon deals an additional 1d4 Piercing damage against targets with 50% of their hit points or fewer.",
    wikiLink: "https://bg3.wiki/wiki/Prey_Upon_the_Weak",
  },
  {
    id: "pack-tactics",
    name: "Pack Tactics",
    description:
      "When an ally is within 3 m (10 ft) of your target and is not Incapacitated, your Attack Rolls against the target have Advantage.",
    iconUrl: "https://bg3.wiki/w/images/1/17/Pack_Tactics_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Pack_Tactics",
  },
  {
    id: "permanently-armed",
    name: "Permanently Armed",
    description: "Creature can't be disarmed.",
    iconUrl: "https://bg3.wiki/w/images/5/5f/Pact_of_the_Blade_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Permanently_Armed",
  },
  {
    id: "born-into-darkness",
    name: "Born into Darkness",
    description:
      "This creature can see through magical and non-magical darkness, and cannot be Blinded.",
    iconUrl: "https://bg3.wiki/w/images/c/c0/Devils_Sight_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Born_into_Darkness",
  },
  {
    id: "shadow-ambush",
    name: "Shadow Ambush",
    description:
      "This creature deals an additional 4d8 Necrotic damage when attacking from the shadows.",
    iconUrl: "https://bg3.wiki/w/images/2/2e/Generic_Necrotic_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Shadow_Ambush",
  },
  {
    id: "unarmoured-defence-barbarian",
    name: "Unarmoured Defence",
    description:
      "Your body is as resilient as any armour. While not wearing armour, you add your Constitution Modifier to your Armour Class.",
    iconUrl:
      "https://bg3.wiki/w/images/5/52/Unarmoured_Defence_barbarian_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Unarmoured_Defence_(barbarian)",
  },
  {
    id: "danger-sense",
    name: "Danger Sense",
    description:
      "You sense when things aren't as they should be. You have Advantage on Dexterity Saving Throws, such as against traps, spells, and surfaces. To gain this benefit, you can't be Blinded or Incapacitated.",
    iconUrl: "https://bg3.wiki/w/images/9/93/Danger_Sense_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Danger_Sense",
  },
  {
    id: "crossbow-expert-wounding",
    name: "Crossbow Expert: Wounding",
    description: "Your Piercing Shot inflicts Gaping Wounds for twice as long.",
    iconUrl:
      "https://bg3.wiki/w/images/e/e9/Crossbow_Expert_Wounding_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Crossbow_Expert:_Wounding",
  },
  {
    id: "mindreader",
    name: "Mindreader",
    description: "Ranged attacks have Disadvantage against this creature.",
    iconUrl: "https://bg3.wiki/w/images/3/3a/Generic_Control_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Mindreader",
  },
  {
    id: "multiattack-morphic-ambush",
    name: "Multiattack: Morphic Ambush",
    description: "Can Multiattack if the target is Ambushed.",
    iconUrl: "https://bg3.wiki/w/images/4/4e/Generic_Multiattack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Multiattack:_Morphic_Ambush",
  },
  {
    id: "improved-extra-attack",
    name: "Improved Extra Attack",
    description:
      "You can make two additional attacks after attacking with your main-hand weapon.",
    iconUrl: "https://bg3.wiki/w/images/5/5a/Extra_Attack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Improved_Extra_Attack",
  },
  {
    id: "web-walker",
    name: "Web Walker",
    description:
      "Isn't slowed down by Web surfaces, and can't be Enwebbed by them.",
    iconUrl: "https://bg3.wiki/w/images/d/d5/Venomous_Bite_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Web_Walker",
  },
  {
    id: "fast-movement",
    name: "Fast Movement",
    description:
      "Your Movement Speed increases by 3 m (10 ft) while not wearing Heavy Armour.",
    iconUrl: "https://bg3.wiki/w/images/4/4f/Fast_Movement_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Fast_Movement",
  },
  {
    id: "alert",
    name: "Alert",
    description: "You gain a +5 bonus to Initiative and can't be Surprised.",
    iconUrl: "https://bg3.wiki/w/images/8/86/Generic_Threat_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Alert",
  },
  {
    id: "mobile-evade-difficult-terrain",
    name: "Mobile: Evade Difficult Terrain",
    description: "When you Dash, Difficult Terrain doesn't slow you down.",
    iconUrl:
      "https://bg3.wiki/w/images/e/e3/Mobile_Evade_Difficult_Terrain_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Mobile:_Evade_Difficult_Terrain",
  },
  {
    id: "turn-resistance",
    name: "Turn Resistance",
    description:
      "Turn Resistance gives Advantage on Saving Throws against any effect that turns undead.",
    iconUrl: "https://bg3.wiki/w/images/2/2e/Generic_Death_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Turn_Resistance",
  },
  {
    id: "uncanny-dodge",
    name: "Uncanny Dodge",
    description:
      "Use your lightning-quick reflexes to protect yourself. When an attack hits you, you only take half the usual damage.",
    iconUrl: "https://bg3.wiki/w/images/4/4d/Uncanny_Dodge_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Uncanny_Dodge",
  },
  {
    id: "stone-camouflage",
    name: "Stone Camouflage",
    description: "You have Advantage on Stealth checks.",
    iconUrl: "https://bg3.wiki/w/images/0/08/Stone_Camouflage_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Stone_Camouflage",
  },
  {
    id: "war-caster-concentration",
    name: "War Caster: Concentration",
    description:
      "You have Advantage on saving throws to maintain Concentration on a spell.",
    iconUrl:
      "https://bg3.wiki/w/images/8/84/War_Caster_Concentration_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/War_Caster:_Concentration",
  },
  {
    id: "sentinel-opportunity-advantage",
    name: "Sentinel: Opportunity Advantage",
    description: "You have Advantage on Opportunity Attacks.",
    iconUrl:
      "https://bg3.wiki/w/images/1/1a/Sentinel_Opportunity_Advantage_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Sentinel:_Opportunity_Advantage",
  },
  {
    id: "sentinel-snare",
    name: "Sentinel: Snare",
    description:
      "When you hit a creature with an Opportunity Attack, it can no longer move for the rest of its turn.",
    iconUrl: "https://bg3.wiki/w/images/b/bc/Sentinel_Snare_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Sentinel:_Snare",
  },
  {
    id: "sentinel-vengeance",
    name: "Sentinel: Vengeance",
    description:
      "When an enemy within melee range attacks an ally, you can use a Reaction to make a weapon attack against that enemy.",
    iconUrl: "https://bg3.wiki/w/images/8/80/Sentinel_Vengeance_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Sentinel:_Vengeance",
  },
  {
    id: "githyanki-parry",
    name: "Githyanki Parry",
    description:
      "Parry unarmed and weapon attacks to reduce their damage by 10.",
    iconUrl: "https://bg3.wiki/w/images/a/aa/Parry_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Githyanki_Parry",
  },
  {
    id: "martial-arts-bonus-unarmed-strike",
    name: "Martial Arts: Bonus Unarmed Strike",
    description:
      "After making an attack with a melee Monk weapon or while unarmed, you can make another unarmed attack as a bonus action.",
    iconUrl:
      "https://bg3.wiki/w/images/9/91/Martial_Arts_Bonus_Unarmed_Strike_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Martial_Arts:_Bonus_Unarmed_Strike",
  },
  {
    id: "martial-arts-deft-strikes",
    name: "Martial Arts: Deft Strikes",
    description:
      "Attacks with Monk Weapons and unarmed attacks deal 1d4 Bludgeoning damage, unless their normal damage is higher.",
    iconUrl:
      "https://bg3.wiki/w/images/1/17/Martial_Arts_Deft_Strikes_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Martial_Arts:_Deft_Strikes",
  },
  {
    id: "martial-arts-dextrous-attacks",
    name: "Martial Arts: Dextrous Attacks",
    description:
      "Attacks with Monk weapons and unarmed attacks scale with your Dexterity instead of your Strength if your Dexterity is higher.",
    iconUrl:
      "https://bg3.wiki/w/images/d/de/Martial_Arts_Dextrous_Attacks_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Martial_Arts:_Dextrous_Attacks",
  },
  {
    id: "unarmoured-defence-monk",
    name: "Unarmoured Defence",
    description:
      "Your reflexes are as effective as any armour. While not wearing armour, you add your Wisdom Modifier to your Armour Class.",
    iconUrl: "https://bg3.wiki/w/images/7/7c/Unarmoured_Defence_monk_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Unarmoured_Defence_(monk)",
  },
  {
    id: "prey-s-scent",
    name: "Prey's Scent",
    description:
      "You deal an additional 1d6 Physical damage to creatures marked by your Ranger's Hunter's Mark.",
    iconUrl: "https://bg3.wiki/w/images/9/94/Prey%27s_Scent_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Prey's_Scent",
  },
  {
    id: "incorporeal-movement",
    name: "Incorporeal Movement",
    description: "Opportunity attacks against you have Disadvantage.",
    iconUrl: "https://bg3.wiki/w/images/7/78/Escape_the_Horde_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Incorporeal_Movement",
  },
  {
    id: "deflect-missiles",
    name: "Deflect Missiles",
    description:
      "Use your reaction to reduce the damage from a ranged weapon attack by 1d10 + your Dexterity Modifier + your monk level.",
    iconUrl: "https://bg3.wiki/w/images/7/75/Deflect_Missiles_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Deflect_Missiles",
  },
  {
    id: "ki-empowered-strikes",
    name: "Ki-Empowered Strikes",
    description:
      "Your unarmed attacks count as magical for the purpose of overcoming enemies' Resistance and Immunity to non-magical damage.",
    iconUrl: "https://bg3.wiki/w/images/4/4a/Ki-Empowered_Strikes_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Ki-Empowered_Strikes",
  },
  {
    id: "slow-fall",
    name: "Slow Fall",
    description:
      "When you fall, you can use your reaction to gain Resistance to Falling damage.",
    iconUrl: "https://bg3.wiki/w/images/d/de/Slow_Fall_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Slow_Fall",
  },
  {
    id: "stillness-of-mind-passive-feature",
    name: "Stillness of Mind",
    description:
      "If you are Charmed or Frightened, you automatically cast Stillness of Mind to remove the condition.",
    iconUrl:
      "https://bg3.wiki/w/images/1/1b/Stillness_of_Mind_passive_feature_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Stillness_of_Mind_(passive_feature)",
  },
  {
    id: "unarmoured-movement",
    name: "Unarmoured Movement",
    description:
      "Your movement speed increases by 3 m (10 ft) while you are not wearing armour or using a shield.",
    iconUrl: "https://bg3.wiki/w/images/6/62/Unarmoured_Movement_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Unarmoured_Movement",
  },
  {
    id: "sunlight-hypersensitivity",
    name: "Sunlight Hypersensitivity",
    description:
      "This creature takes 20 Radiant damage if it starts its turn in sunlight. While sunlit, it has Disadvantage on Attack Rolls and Ability Checks.",
    iconUrl: "https://bg3.wiki/w/images/a/a2/Sunlight_Sensitivity_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Sunlight_Hypersensitivity",
  },
  {
    id: "vampire-regeneration",
    name: "Vampire Regeneration",
    description:
      "The vampire regains 10 Hit Points at the start of its turn if it isn't in sunlight, or has taken Radiant damage or damage from Holy Water, in which case this trait doesn't function until the start of its next turn.",
    iconUrl: "https://bg3.wiki/w/images/7/72/Regeneration_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Vampire_Regeneration",
  },
  {
    id: "mobile",
    name: "Mobile",
    description: "Your movement speed increases by 3 m (10 ft).",
    iconUrl: "https://bg3.wiki/w/images/c/cc/Dash_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Mobile",
  },
  {
    id: "mobile-evade-opportunity-attack",
    name: "Mobile: Evade Opportunity Attack",
    description:
      "If you move after making a melee attack, you don't provoke Opportunity Attacks from your target.",
    iconUrl:
      "https://bg3.wiki/w/images/0/06/Mobile_Evade_Opportunity_Attack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Mobile:_Evade_Opportunity_Attack",
  },
  {
    id: "bardic-inspiration-passive-feature",
    name: "Bardic Inspiration",
    description: "Can use Bardic Inspiration.",
    iconUrl: "https://bg3.wiki/w/images/f/ff/Bardic_Roll_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Bardic_Inspiration_(passive_feature)",
  },
  {
    id: "savage-attacker",
    name: "Savage Attacker",
    description:
      "When making melee weapon attacks, you roll your damage dice twice and use the highest result.",
    iconUrl: "https://bg3.wiki/w/images/2/24/Savage_Attacker_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Savage_Attacker",
  },
  {
    id: "relentless-avenger",
    name: "Relentless Avenger",
    description:
      "If you hit an enemy with an Opportunity Attack, your movement speed increases by 4.5 m (15 ft) on your next turn.",
    iconUrl: "https://bg3.wiki/w/images/e/ed/Relentless_Avenger_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Relentless_Avenger",
  },
  {
    id: "infernal-weapon",
    name: "Infernal Weapon",
    description:
      "On a hit, this weapon deals an additional 3 Poison damage and can possibly Poison its target.",
    wikiLink: "https://bg3.wiki/wiki/Infernal_Weapon",
  },
  {
    id: "advanced-unarmoured-movement",
    name: "Advanced Unarmoured Movement",
    description:
      "Difficult Terrain doesn't slow you down and you can Jump an additional 6 m (20 ft) while you are not wearing armour or using a shield.",
    iconUrl:
      "https://bg3.wiki/w/images/c/c9/Advanced_Unarmoured_Movement_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Advanced_Unarmoured_Movement",
  },
  {
    id: "blindsight",
    name: "Blindsight",
    description:
      "This creature can perceive its surroundings without relying on sight.",
    iconUrl: "https://bg3.wiki/w/images/5/56/Generic_Darkness_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Blindsight",
  },
  {
    id: "devil-s-sight",
    name: "Devil's Sight",
    description:
      "You can see normally in darkness, both magical and non-magical, to a distance of 24 m (80 ft).",
    iconUrl: "https://bg3.wiki/w/images/c/c0/Devils_Sight_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Devil's_Sight",
  },
  {
    id: "murder-hungry",
    name: "Murder Hungry",
    description: "Each time you kill a creature, gain 1 charge of Unstoppable.",
    iconUrl: "https://bg3.wiki/w/images/2/2e/Generic_Death_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Murder_Hungry",
  },
  {
    id: "forever-indebted-passive-feature",
    name: "Forever Indebted",
    description:
      "A debt to Raphael must be paid - even in death. Upon dying, the debtor explodes in damaging flames and is reincarnated as a fiendish creature bound to Raphael.",
    iconUrl: "https://bg3.wiki/w/images/d/dc/Generic_Explosion_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Forever_Indebted_(passive_feature)",
  },
  {
    id: "feline-fall",
    name: "Feline Fall",
    description:
      "Due to their natural feline grace, cats are Resistant to Falling damage.",
    iconUrl: "https://bg3.wiki/w/images/d/de/Slow_Fall_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Feline_Fall",
  },
  {
    id: "companion-s-bond",
    name: "Companion's Bond",
    description:
      "Your Ranger's Companions receive a bonus to Armour Class and damage equal to its Proficiency Bonus.",
    iconUrl: "https://bg3.wiki/w/images/b/b1/Companions_Bond_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Companion's_Bond",
  },
  {
    id: "fast-hands",
    name: "Fast Hands",
    description:
      "You gain an extra Bonus Action, which you can use with any of your existing Bonus Actions.",
    iconUrl: "https://bg3.wiki/w/images/d/dc/Fast_Hands_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Fast_Hands",
  },
  {
    id: "sculpt-spells",
    name: "Sculpt Spells",
    description:
      "Create pockets of safety within your Evocation spells. Allies automatically succeed their Saving Throws against these spells and take no damage from them.",
    iconUrl: "https://bg3.wiki/w/images/9/97/Sculpt_Spells_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Sculpt_Spells",
  },
  {
    id: "war-caster-opportunity-spell",
    name: "War Caster: Opportunity Spell",
    description:
      "You can use a Reaction to cast Shocking Grasp at a target moving out of melee range.",
    iconUrl:
      "https://bg3.wiki/w/images/c/c5/War_Caster_Opportunity_Spell_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/War_Caster:_Opportunity_Spell",
  },
  {
    id: "feral-instinct",
    name: "Feral Instinct",
    description:
      "You have honed your instincts to the utmost degree. You gain a +3 to Initiative and can't be Surprised.",
    iconUrl: "https://bg3.wiki/w/images/4/4e/Feral_Instinct_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Feral_Instinct",
  },
  {
    id: "great-weapon-master-bonus-attack",
    name: "Great Weapon Master: Bonus Attack",
    description:
      "When you land a critical hit or kill a target with a melee weapon attack, you can make another melee weapon attack as a bonus action that turn.",
    iconUrl:
      "https://bg3.wiki/w/images/8/8f/Great_Weapon_Master_Bonus_Attack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Great_Weapon_Master:_Bonus_Attack",
  },
  {
    id: "undead-fortitude",
    name: "Undead Fortitude",
    description:
      "If the killing blow wasn't a critical hit and wasn't radiant damage, this undead comes back to life with 1 hit point.",
    iconUrl: "https://bg3.wiki/w/images/2/2e/Generic_Death_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Undead_Fortitude",
  },
  {
    id: "githyanki-war-magic",
    name: "Githyanki War Magic",
    description:
      "After the githyanki casts a spell or cantrip, they can make a weapon attack using a Bonus Action.",
    iconUrl: "https://bg3.wiki/w/images/1/1a/War_Magic_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Githyanki_War_Magic",
  },
  {
    id: "sunlight-weakness",
    name: "Sunlight Weakness",
    description:
      "While in sunlight, this creature has Disadvantage on Attack Rolls and Saving Throws.",
    iconUrl: "https://bg3.wiki/w/images/a/a2/Sunlight_Sensitivity_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Sunlight_Weakness",
  },
  {
    id: "charger",
    name: "Charger",
    description:
      "Let your speed intensify your onslaught. You can Shove or deal additional Weapon Damage when you attack.",
    iconUrl: "https://bg3.wiki/w/images/f/f1/Charger_Weapon_Attack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Charger",
  },
  {
    id: "charm",
    name: "Charm",
    description:
      "Channel the dark allure of the tadpole to Charm an enemy that attacks you, preventing them from attacking you until their next turn.",
    iconUrl: "https://bg3.wiki/w/images/5/5d/Charm_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Charm",
  },
  {
    id: "font-of-inspiration",
    name: "Font of Inspiration",
    description:
      "You regain all of your Bardic Inspirations after a Long or Short Rest.",
    iconUrl: "https://bg3.wiki/w/images/a/a2/Font_of_Inspiration_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Font_of_Inspiration",
  },
  {
    id: "sun-sickness",
    name: "Sun Sickness",
    description:
      "While in sunlight, has Disadvantage on Ability Checks, Attack Rolls, and Saving Throws.",
    iconUrl: "https://bg3.wiki/w/images/a/a2/Sunlight_Sensitivity_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Sun_Sickness",
  },
  {
    id: "toggle-non-lethal-attacks",
    name: "Toggle Non-Lethal Attacks",
    description: "Knock someone Unconscious instead of killing them.",
    iconUrl:
      "https://bg3.wiki/w/images/f/fb/Toggle_Non-Lethal_Attacks_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Toggle_Non-Lethal_Attacks",
  },
  {
    id: "potent-cantrip",
    name: "Potent Cantrip",
    description:
      "Your cantrips become harder to evade entirely. When a creature succeeds its Saving Throw against one of your cantrips, it still takes half the cantrip's damage, but suffers no additional effects.",
    iconUrl: "https://bg3.wiki/w/images/c/c9/Potent_Cantrip_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Potent_Cantrip",
  },
  {
    id: "brute",
    name: "Brute",
    description:
      "Deals an extra 1d8 Physical when attacking with a melee weapon.",
    wikiLink: "https://bg3.wiki/wiki/Brute",
  },
  {
    id: "perfect-sentry",
    name: "Perfect Sentry",
    description: "You can't be Surprised.",
    iconUrl: "https://bg3.wiki/w/images/8/86/Generic_Threat_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Perfect_Sentry",
  },
  {
    id: "defence",
    name: "Defence",
    description: "You gain a +1 bonus to Armour Class while wearing armour.",
    iconUrl: "https://bg3.wiki/w/images/e/e2/Defence_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Defence",
  },
  {
    id: "reliable-talent",
    name: "Reliable Talent",
    description:
      "When you make an Ability Check with a Skill you are Proficient with, the lowest result you can roll on the die is 10.",
    iconUrl: "https://bg3.wiki/w/images/4/43/Reliable_Talent_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Reliable_Talent",
  },
  {
    id: "ogre-s-mark",
    name: "Ogre's Mark",
    description: "Damage is increased by 1d6.",
    iconUrl: "https://bg3.wiki/w/images/2/24/Ogre%27s_Mark_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Ogre's_Mark",
  },
  {
    id: "brutal-critical",
    name: "Brutal Critical",
    description:
      "You've trained to strike swift and true. When you land a Critical Hit, you roll an extra damage die as well as the normal additional critical die.",
    iconUrl: "https://bg3.wiki/w/images/e/e1/Brutal_Critical_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Brutal_Critical",
  },
  {
    id: "dual-wielder",
    name: "Dual Wielder",
    description:
      "You can use Two-Weapon Fighting even if the weapons you are wielding aren't Light. You cannot dual-wield Two-Handed weapons.",
    iconUrl: "https://bg3.wiki/w/images/0/0f/Dual_Wielder_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Dual_Wielder",
  },
  {
    id: "silent",
    name: "Silent",
    description:
      "This creature can't speak or cast spells that have a verbal component",
    iconUrl: "https://bg3.wiki/w/images/7/78/Silence_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Silent",
  },
  {
    id: "great-weapon-master-all-in",
    name: "Great Weapon Master: All In",
    description:
      "When attacking with a melee weapon you are proficient with and are wielding in both hands, attack rolls take a -5 penalty, but their damage increases by 10.",
    iconUrl:
      "https://bg3.wiki/w/images/1/1a/Great_Weapon_Master_Bonus_Damage_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Great_Weapon_Master:_All_In",
  },
  {
    id: "channel-divinity-war-god-s-blessing",
    name: "Channel Divinity: War God's Blessing",
    description:
      "Endow a nearby ally with the glory of your god to grant them a +10 bonus to their Attack Roll.",
    iconUrl: "https://bg3.wiki/w/images/c/ce/War_God%27s_Blessing_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Channel_Divinity:_War_God's_Blessing",
  },
  {
    id: "multiattack-bloodlust",
    name: "Multiattack: Bloodlust",
    description:
      "The redcap can make a Multiattack while under the effects of Bloodlust.",
    iconUrl: "https://bg3.wiki/w/images/4/4e/Generic_Multiattack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Multiattack:_Bloodlust",
  },
  {
    id: "steeped-in-slaughter",
    name: "Steeped in Slaughter",
    description: "Has Advantage on Attack Rolls made against Bleeding foes.",
    iconUrl: "https://bg3.wiki/w/images/d/d6/Generic_Blood_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Steeped_in_Slaughter",
  },
  {
    id: "focused-conjuration",
    name: "Focused Conjuration",
    description:
      "Damage taken while you are Concentrating on a Conjuration spell will not break your Concentration.",
    iconUrl: "https://bg3.wiki/w/images/1/1e/Focused_Conjuration_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Focused_Conjuration",
  },
  {
    id: "spell-sniper",
    name: "Spell Sniper",
    description:
      "The number you need to roll a Critical Hit while attacking with a Spell is reduced by 1. This effect can stack.",
    iconUrl: "https://bg3.wiki/w/images/b/b0/Spell_Sniper_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Spell_Sniper",
  },
  {
    id: "ethel-s-twisted-blessing",
    name: "Ethel's Twisted Blessing",
    description:
      "As one of Ethel's loyal servants, this redcap has an additional 40 hit points, their Strength and Constitution scores are increased +2, and their attacks deal an additional 1~12 Slashing damage.",
    iconUrl: "https://bg3.wiki/w/images/d/d6/Generic_Blood_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Ethel's_Twisted_Blessing",
  },
  {
    id: "exceptional-training",
    name: "Exceptional Training",
    description:
      "Your summoned companions can now Dash, Disengage, and Help as a Bonus Action.",
    iconUrl: "https://bg3.wiki/w/images/b/bf/Exceptional_Training_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Exceptional_Training",
  },
  {
    id: "improved-divine-smite",
    name: "Improved Divine Smite",
    description:
      "Your attacks are suffused with divine might. Melee weapon attacks deal an additional 1d8 Radiant damage.",
    iconUrl: "https://bg3.wiki/w/images/f/fb/Improved_Divine_Smite_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Improved_Divine_Smite",
  },
  {
    id: "immutable-form",
    name: "Immutable Form",
    description:
      "Spells that alter someone's form have no effect on the affected entity, and it has a +5 bonus to Saving Throws against spells that would remove it from this plane.",
    iconUrl: "https://bg3.wiki/w/images/d/d1/Immutable_Form_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Immutable_Form",
  },
  {
    id: "grave-magic",
    name: "Grave Magic",
    description:
      "Whenever you deal damage with a spell, deal an additional 1d8 Necrotic damage.",
    iconUrl: "https://bg3.wiki/w/images/2/2e/Generic_Necrotic_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Grave_Magic",
  },
  {
    id: "shar-s-sight",
    name: "Shar's Sight",
    description: "The Justiciar can't be Blinded.",
    wikiLink: "https://bg3.wiki/wiki/Shar's_Sight",
  },
  {
    id: "martial-advantage",
    name: "Martial Advantage",
    description:
      "Once per turn, the Hobgoblin can deal an extra 2d6 Physical damage to a creature it hits with a weapon attack. The hobgoblin must have an ally who is within 2 m (7 ft) of the target and isn't Incapacitated.",
    iconUrl: "https://bg3.wiki/w/images/5/5a/Extra_Attack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Martial_Advantage",
  },
  {
    id: "improved-bardic-inspiration-passive-feature",
    name: "Improved Bardic Inspiration",
    description: "The bonus gained from Bardic Inspiration increases to +1d8.",
    iconUrl: "https://bg3.wiki/w/images/0/0a/Bardic_Inspiration_Icon.webp",
    wikiLink:
      "https://bg3.wiki/wiki/Improved_Bardic_Inspiration_(passive_feature)",
  },
  {
    id: "fiendish-blessing",
    name: "Fiendish Blessing",
    description:
      "Protected by the blood of their fiendish ancestors, cambions have a +2 bonus to their Armour Class.",
    iconUrl: "https://bg3.wiki/w/images/3/34/Generic_Physical_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Fiendish_Blessing",
  },
  {
    id: "crude-frenzy",
    name: "Crude Frenzy",
    description:
      "This goblin can make an additional free attack after making a Main Hand Attack, but the second attack has Disadvantage on its Attack Roll.",
    iconUrl: "https://bg3.wiki/w/images/5/5a/Extra_Attack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Crude_Frenzy",
  },
  {
    id: "living-shadow",
    name: "Living Shadow",
    description:
      "While Lightly or Heavily Obscured, this character has Resistance to all damage except Force, Psychic or Radiant.",
    iconUrl: "https://bg3.wiki/w/images/5/56/Generic_Darkness_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Living_Shadow",
  },
  {
    id: "part-of-the-flock",
    name: "Part of the Flock",
    description: "Auntie Ethel welcomes you, dearie.",
    wikiLink: "https://bg3.wiki/wiki/Part_of_the_Flock",
  },
  {
    id: "superior-padding-1",
    name: "Superior Padding",
    description: "You take 1 less Bludgeoning damage.",
    wikiLink: "https://bg3.wiki/wiki/Superior_Padding_(-1)",
  },
  {
    id: "death-burst-force",
    name: "Death Burst: Force",
    description:
      "When the mephit dies, it explodes with a force that deals 2d6 Force damage to all creatures within 2 m (7 ft).",
    iconUrl: "https://bg3.wiki/w/images/3/3e/Generic_Force_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Death_Burst:_Force",
  },
  {
    id: "rampage",
    name: "Rampage",
    description:
      "When a Gnoll Downs a creature with a melee attack, the gnoll can use a Bonus Action to move up to half its Movement Speed and make a bite attack.",
    iconUrl: "https://bg3.wiki/w/images/d/dc/Generic_Explosion_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Rampage",
  },
  {
    id: "metamagic-distant-spell",
    name: "Metamagic: Distant Spell",
    description:
      "Increases the range of the spell by 50%. Melee spells are increased to 9 m (30 ft).",
    iconUrl: "https://bg3.wiki/w/images/c/ca/Metamagic_Distant_Spell_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Metamagic:_Distant_Spell",
  },
  {
    id: "shadowblend",
    name: "Shadowblend",
    description:
      "While Lightly or Heavily Obscured, this creature gains the ability to blend with shadows and become Invisible.",
    iconUrl: "https://bg3.wiki/w/images/6/66/Generic_Invisibility_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Shadowblend",
  },
  {
    id: "grim-harvest",
    name: "Grim Harvest",
    description:
      "Once per turn, if you kill a creature with a spell, you regain Hit Points equal to twice the Spell Slot level used - thrice if it's a Necromancy spell. Undead and Constructs are unaffected.",
    iconUrl: "https://bg3.wiki/w/images/5/59/Grim_Harvest_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Grim_Harvest",
  },
  {
    id: "agonising-blast",
    name: "Agonising Blast",
    description:
      "When you cast Eldritch Blast, add your Charisma Modifier to the damage it deals, unless it is negative.",
    iconUrl: "https://bg3.wiki/w/images/9/9d/Agonising_Blast_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Agonising_Blast",
  },
  {
    id: "repelling-blast",
    name: "Repelling Blast",
    description:
      "When you hit a creature with Eldritch Blast, you can push the creature up to 4.5 m (15 ft) away from you.",
    iconUrl: "https://bg3.wiki/w/images/6/65/Repelling_Blast_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Repelling_Blast",
  },
  {
    id: "parry",
    name: "Parry",
    description:
      "Parry the next melee attack that hits you to reduce the damage by 1d8 + Dexterity Modifier.",
    iconUrl: "https://bg3.wiki/w/images/a/aa/Parry_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Parry",
  },
  {
    id: "stealthy",
    name: "Stealthy",
    description: "Gain a +1 bonus to Stealth Checks.",
    wikiLink: "https://bg3.wiki/wiki/Stealthy",
  },
  {
    id: "multiattack-wounded-werewolf",
    name: "Multiattack: Wounded",
    description:
      "Can Multiattack if the target is Prone or if its hit points are at 60% or less.",
    iconUrl: "https://bg3.wiki/w/images/4/4e/Generic_Multiattack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Multiattack:_Wounded_(Werewolf)",
  },
  {
    id: "bestial-fury",
    name: "Bestial Fury",
    description: "Grants all your companions an extra attack.",
    iconUrl: "https://bg3.wiki/w/images/f/f2/Bestial_Fury_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Bestial_Fury",
  },
  {
    id: "accursed-coins",
    name: "Accursed Coins",
    description:
      "This cursed visage controls part of the coins protecting the Toll Collector.",
    iconUrl: "https://bg3.wiki/w/images/d/d3/Gold_Pile_Medium_Item_Icon.png",
    wikiLink: "https://bg3.wiki/wiki/Accursed_Coins",
  },
  {
    id: "two-weapon-fighting",
    name: "Two-Weapon Fighting",
    description:
      "When you make an offhand attack, you can add your Ability Score Modifier to the damage of the attack.",
    iconUrl: "https://bg3.wiki/w/images/5/54/Two-Weapon_Fighting_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Two-Weapon_Fighting",
  },
  {
    id: "civil-militia",
    name: "Civil Militia",
    description:
      "You have weapon proficiency with: * Spears * Pikes * Halberds * Glaives * Light armour * Shields",
    iconUrl: "https://bg3.wiki/w/images/b/b5/Civil_Militia_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Civil_Militia",
  },
  {
    id: "muscular",
    name: "Muscular",
    description:
      "This creature is very strong. It has Advantage on Ability Checks and Saving Throws using Athletics.",
    iconUrl: "https://bg3.wiki/w/images/b/bc/Muscular_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Muscular",
  },
  {
    id: "supreme-githyanki-parry",
    name: "Supreme Githyanki Parry",
    description:
      "Parry unarmed and weapon attacks to reduce their damage by 20.",
    iconUrl: "https://bg3.wiki/w/images/a/aa/Parry_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Supreme_Githyanki_Parry",
  },
  {
    id: "magical-plate-2",
    name: "Magical Plate",
    description: "All incoming damage is reduced by 2.",
    wikiLink: "https://bg3.wiki/wiki/Magical_Plate_(-2)",
  },
  {
    id: "dual-wielder-bonus-armour-class",
    name: "Dual Wielder: Bonus Armour Class",
    description:
      "You have a +1 bonus to Armour Class while wielding a melee weapon in each hand.",
    iconUrl:
      "https://bg3.wiki/w/images/f/fe/Dual_Wielder_Bonus_Armour_Class_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Dual_Wielder:_Bonus_Armour_Class",
  },
  {
    id: "psionic-backlash",
    name: "Psionic Backlash",
    description:
      "When an enemy within 9 m (30 ft) casts a spell, you can use your reaction to inflict 1d4 Psychic damage to the caster per the spell's level.",
    iconUrl: "https://bg3.wiki/w/images/7/77/Psionic_Backlash_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Psionic_Backlash",
  },
  {
    id: "merry-revelry",
    name: "Merry Revelry",
    description:
      "This Redcap's Bloodlust is subdued when there are traces of alcohol in a target's blood, which means they will primarily target creatures who are sober.",
    iconUrl: "https://bg3.wiki/w/images/0/0a/Alcohol_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Merry_Revelry",
  },
  {
    id: "relentless-rage",
    name: "Relentless Rage",
    description:
      "Once per Short Rest, if you drop to 0 hit points while Enraged, you regain 1 Hit Point instead of being Downed.",
    iconUrl: "https://bg3.wiki/w/images/e/e8/Relentless_Rage_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Relentless_Rage",
  },
  {
    id: "scenting-blood",
    name: "Scenting Blood",
    description:
      "If the sahuagin sees a wounded creature, it becomes Blood Frenzied.",
    iconUrl: "https://bg3.wiki/w/images/d/d6/Generic_Blood_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Scenting_Blood",
  },
  {
    id: "superior-plate-1",
    name: "Superior Plate",
    description: "You take 1 less Piercing damage.",
    wikiLink: "https://bg3.wiki/wiki/Superior_Plate_(-1)",
  },
  {
    id: "great-wyrm-s-scales",
    name: "Great Wyrm's Scales",
    description: "All incoming damage is reduced by 2.",
    iconUrl: "https://bg3.wiki/w/images/0/09/Multiattack_Defense_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Great_Wyrm's_Scales",
  },
  {
    id: "greater-wyrm-s-scales",
    name: "Greater Wyrm's Scales",
    description: "All incoming damage is reduced by 4.",
    iconUrl: "https://bg3.wiki/w/images/0/09/Multiattack_Defense_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Greater_Wyrm's_Scales",
  },
  {
    id: "empowered-evocation",
    name: "Empowered Evocation",
    description:
      "Your grasp of Evocation magic has tightened, and you can add your Intelligence Modifier to damage rolls with any Evocation spells.",
    iconUrl: "https://bg3.wiki/w/images/d/d0/Empowered_Evocation_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Empowered_Evocation",
  },
  {
    id: "scar-of-the-dunes",
    name: "Scar of the Dunes",
    description:
      "This character's movement speed is doubled and it cannot be targeted by attacks of opportunity, if its hit points are lower than 90%.",
    iconUrl: "https://bg3.wiki/w/images/d/d6/Generic_Buff_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Scar_of_the_Dunes",
  },
  {
    id: "dark-devotion",
    name: "Dark Devotion",
    description:
      "Grants Advantage on saving throws against being Charmed or Frightened.",
    iconUrl: "https://bg3.wiki/w/images/9/9e/Dark_Devotion_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Dark_Devotion",
  },
  {
    id: "improved-critical-hit",
    name: "Improved Critical Hit",
    description:
      "The number you need to roll a Critical Hit while attacking is reduced by 1. This effect can stack.",
    iconUrl: "https://bg3.wiki/w/images/8/83/Improved_Critical_Hit_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Improved_Critical_Hit",
  },
  {
    id: "duelling",
    name: "Duelling",
    description:
      "When you are wielding a melee weapon that is not Two-Handed in one hand, and no weapon in the other, you deal an additional 2 damage with that weapon.",
    iconUrl: "https://bg3.wiki/w/images/a/ae/Duelling_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Duelling",
  },
  {
    id: "draconic-resilience",
    name: "Draconic Resilience",
    description:
      "Dragon-like scales cover parts of your skin. When you aren't wearing armour, your base Armour Class is 13.",
    iconUrl: "https://bg3.wiki/w/images/3/3d/Draconic_Resilience_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Draconic_Resilience",
  },
  {
    id: "dark-vengeance",
    name: "Dark Vengeance",
    description:
      "The Justiciar has advantage against targets standing in darkness.",
    iconUrl: "https://bg3.wiki/w/images/9/9e/Dark_Devotion_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Dark_Vengeance",
  },
  {
    id: "elemental-affinity-damage",
    name: "Elemental Affinity: Damage",
    description:
      "When you cast a spell that deals damage of the type associated with your draconic ancestry, you add your Charisma Modifier to the damage.",
    iconUrl:
      "https://bg3.wiki/w/images/0/01/Elemental_Affinity_Damage_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Elemental_Affinity:_Damage",
  },
  {
    id: "multiattack-frightened",
    name: "Multiattack: Frightened",
    description: "The Mummy can Multiattack if the target is Frightened.",
    iconUrl: "https://bg3.wiki/w/images/4/4e/Generic_Multiattack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Multiattack:_Frightened",
  },
  {
    id: "arcane-enchantment-1",
    name: "Arcane Enchantment",
    description: "You gain a +1 bonus to Spell Save DC and Spell Attack rolls.",
    wikiLink: "https://bg3.wiki/wiki/Arcane_Enchantment_(%2B1)",
  },
  {
    id: "nature-s-ward",
    name: "Nature's Ward",
    description:
      "You can't be Charmed or Frightened by elementals and fey. Disease and poison also no longer affect you.",
    iconUrl: "https://bg3.wiki/w/images/b/bd/Nature%27s_Ward_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Nature's_Ward",
  },
  {
    id: "purity-of-body",
    name: "Purity of Body",
    description:
      "You are Immune to Poison damage and can't be Poisoned or affected by disease thanks to the purifying ki flowing through your meridians.",
    iconUrl: "https://bg3.wiki/w/images/0/0b/Purity_of_Body_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Purity_of_Body",
  },
  {
    id: "colossus-slayer",
    name: "Colossus Slayer",
    description:
      "Once per turn, your weapon attack deals an extra 1d8 Physical damage if the target is below its hit point maximum.",
    iconUrl: "https://bg3.wiki/w/images/f/f0/Colossus_Slayer_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Colossus_Slayer",
  },
  {
    id: "favourable-beginnings",
    name: "Favourable Beginnings",
    description:
      "The first Attack Roll or Ability Check you make against any target gains a bonus equal to your Proficiency Bonus.",
    iconUrl: "https://bg3.wiki/w/images/3/3e/Favourable_Beginnings_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Favourable_Beginnings",
  },
  {
    id: "hunter-s-camouflage",
    name: "Hunter's Camouflage",
    description:
      "After receiving damage, the creature immediately uses their reaction to Blur",
    iconUrl: "https://bg3.wiki/w/images/0/06/Generic_Nature_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Hunter's_Camouflage",
  },
  {
    id: "man-s-best-friend",
    name: "Man's Best Friend",
    description:
      "This hunting dog's Armour Class and damage increase by an amount equal to the Proficiency Bonus of its houndmaster.",
    iconUrl: "https://bg3.wiki/w/images/b/b1/Companions_Bond_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Man's_Best_Friend",
  },
  {
    id: "superior-material-1",
    name: "Superior Material",
    description: "You take 1 less Slashing damage.",
    wikiLink: "https://bg3.wiki/wiki/Superior_Material_(-1)",
  },
  {
    id: "martial-prodigy",
    name: "Martial Prodigy",
    description:
      "A lifetime of relentless training gave you Armour proficiency with Light armour and Medium armour, as well as Proficiency with Shortswords, Longswords, and Greatswords.",
    iconUrl: "https://bg3.wiki/w/images/2/20/Martial_Prodigy_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Martial_Prodigy",
  },
  {
    id: "tough",
    name: "Tough",
    description:
      "Your hit point maximum increases by 2 for every level you have gained.",
    iconUrl: "https://bg3.wiki/w/images/e/e3/Tough_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Tough",
  },
  {
    id: "boooal-s-faithful-passive-feature",
    name: "BOOOAL's Faithful",
    description: "Chance to apply Bleeding to targets.",
    wikiLink: "https://bg3.wiki/wiki/BOOOAL's_Faithful_(passive_feature)",
  },
  {
    id: "antimagic-susceptibility",
    name: "Antimagic Susceptibility",
    description:
      "Held together by the Weave itself, this armour is Incapacitated by antimagic fields.",
    wikiLink: "https://bg3.wiki/wiki/Antimagic_Susceptibility",
  },
  {
    id: "multiattack-enraged",
    name: "Multiattack: Enraged",
    description:
      "The owlbear can make a Multiattack while under the effects of Owlbear's Rage",
    iconUrl: "https://bg3.wiki/w/images/4/4e/Generic_Multiattack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Multiattack:_Enraged",
  },
  {
    id: "blazing-hide",
    name: "Blazing Hide",
    description:
      "When the hellsboar is hit with a melee attack, the attacker starts Burning for 3 turns.",
    wikiLink: "https://bg3.wiki/wiki/Blazing_Hide",
  },
  {
    id: "scar-of-fury",
    name: "Scar of Fury",
    description: "Score a Critical Hit when your health is lower than 40%.",
    iconUrl: "https://bg3.wiki/w/images/c/c1/Generic_Damage_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Scar_of_Fury",
  },
  {
    id: "extinguishing-malice",
    name: "Extinguishing Malice",
    description:
      "Nearby lights are extinguished in the presence of this creature's roiling darkness.",
    iconUrl: "https://bg3.wiki/w/images/5/56/Generic_Darkness_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Extinguishing_Malice",
  },
  {
    id: "knockdown-jaws",
    name: "Knockdown Jaws",
    description:
      "Bite attacks from this creature can possibly knock the target Prone.",
    iconUrl: "https://bg3.wiki/w/images/3/36/Generic_Wild_Animal_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Knockdown_Jaws",
  },
  {
    id: "shadow-veil",
    name: "Shadow Veil",
    description:
      "While Lightly or Heavily Obscured, the shadow mastiff is Resistant to non-magical Bludgeoning, Piercing, and Slashing damage.",
    iconUrl: "https://bg3.wiki/w/images/5/56/Generic_Darkness_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Shadow_Veil",
  },
  {
    id: "multiattack-giant-eagle-passive-feature",
    name: "Multiattack",
    description:
      "The giant eagle can Multiattack if its target is Prone or Restrained.",
    iconUrl: "https://bg3.wiki/w/images/4/4e/Generic_Multiattack_Icon.webp",
    wikiLink:
      "https://bg3.wiki/wiki/Multiattack_(Giant_Eagle)_(passive_feature)",
  },
  {
    id: "gold-plating",
    name: "Gold Plating",
    description:
      "This creature has been blessed by Mammon, giving them a second skin of gold that increases their Constitution to 20 and their base Armour Class to 15, and grants an additional 66 hit points Hit Points.",
    wikiLink: "https://bg3.wiki/wiki/Gold_Plating",
  },
  {
    id: "drow-weapon-training",
    name: "Drow Weapon Training",
    description:
      "You have proficiency with Rapiers, Shortswords, and Hand Crossbows.",
    iconUrl: "https://bg3.wiki/w/images/2/2a/Drow_Weapon_Training_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Drow_Weapon_Training",
  },
  {
    id: "mage-breaker",
    name: "Mage Breaker",
    description:
      "You have a history of battling spellcasters. You gain Proficiency in Arcana and can cast True Strike.",
    iconUrl: "https://bg3.wiki/w/images/0/07/Mage_Breaker_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Mage_Breaker",
  },
  {
    id: "mortal-reminder",
    name: "Mortal Reminder",
    description:
      "When you land a Critical Hit against a creature, that creature and any nearby enemies must succeed a Wisdom Saving Throw or become Frightened until the end of their next turn.",
    iconUrl: "https://bg3.wiki/w/images/1/1c/Mortal_Reminder_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Mortal_Reminder",
  },
  {
    id: "grasp-of-the-forest",
    name: "Grasp of the Forest",
    description: "Weapon attacks can Entangle the target.",
    iconUrl: "https://bg3.wiki/w/images/0/06/Generic_Nature_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Grasp_of_the_Forest",
  },
  {
    id: "shield-bash",
    name: "Shield Bash",
    description:
      "When a foe hits you with a melee attack, you can use your reaction to knock it Prone unless they succeed a Dexterity Saving Throw.",
    iconUrl: "https://bg3.wiki/w/images/4/42/Shield_Bash_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Shield_Bash",
  },
  {
    id: "githborn-psionic-weapon",
    name: "Githborn Psionic Weapon",
    description:
      "When wielded by a githyanki this weapon deals an additional 1d4 Psychic damage.",
    wikiLink: "https://bg3.wiki/wiki/Githborn_Psionic_Weapon",
  },
  {
    id: "dreadful-word",
    name: "Dreadful Word",
    description: "You can cast Confusion with a Warlock spell slot.",
    iconUrl: "https://bg3.wiki/w/images/7/7b/Confusion_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Dreadful_Word",
  },
  {
    id: "multiattack-defence",
    name: "Multiattack Defence",
    description:
      "When an enemy attacks you, they have a -4 penalty to additional Attack Rolls against you until the start of their next turn.",
    iconUrl: "https://bg3.wiki/w/images/0/09/Multiattack_Defense_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Multiattack_Defence",
  },
  {
    id: "psionic-dominance",
    name: "Psionic Dominance",
    description:
      "When an enemy within 18 m (60 ft) targets you with a spell of a Level that is lower than or equal to your Proficiency Bonus, you can use your reaction to nullify the spell.",
    iconUrl: "https://bg3.wiki/w/images/8/85/Psionic_Dominance_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Psionic_Dominance",
  },
  {
    id: "electrocution-immunity",
    name: "Electrocution Immunity",
    description:
      "Years of ambushing ships during lightning storms means that this creature cannot be Electrocuted.",
    wikiLink: "https://bg3.wiki/wiki/Electrocution_Immunity",
  },
  {
    id: "rend-with-white-lightning",
    name: "Rend With White Lightning",
    description: "Successful weapon attacks deal an additional 1d8 Lightning.",
    wikiLink: "https://bg3.wiki/wiki/Rend_With_White_Lightning",
  },
  {
    id: "necrotic-claws",
    name: "Necrotic Claws",
    description: "Your attacks deal an extra 1d6 Necrotic damage.",
    wikiLink: "https://bg3.wiki/wiki/Necrotic_Claws",
  },
  {
    id: "human-versatility",
    name: "Human Versatility",
    description:
      "Select an additional Skill to be Proficient in. Your carrying capacity is increased by a quarter.",
    iconUrl: "https://bg3.wiki/w/images/b/bd/Generic_Tactical_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Human_Versatility",
  },
  {
    id: "elven-weapon-training",
    name: "Elven Weapon Training",
    description:
      "You have Proficiency with Longswords, Shortswords, Longbows, and Shortbows.",
    iconUrl: "https://bg3.wiki/w/images/9/91/Elven_Weapon_Training_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Elven_Weapon_Training",
  },
  {
    id: "multiattack-prone-hook-horror",
    name: "Multiattack: Prone",
    description:
      "The hook horror can make a Multiattack if the target is Prone.",
    iconUrl: "https://bg3.wiki/w/images/4/4e/Generic_Multiattack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Multiattack:_Prone_(Hook_Horror)",
  },
  {
    id: "second-story-work-falling",
    name: "Second-Story Work: Falling",
    description:
      "You've mastered the art of falling and gain Resistance to Falling damage.",
    iconUrl:
      "https://bg3.wiki/w/images/4/40/Second-Story_Work_Falling_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Second-Story_Work:_Falling",
  },
  {
    id: "skittish",
    name: "Skittish",
    description: "Will flee for 2 turns when badly hurt.",
    wikiLink: "https://bg3.wiki/wiki/Skittish",
  },
  {
    id: "legendary-action-draconic-fury",
    name: "Legendary Action: Draconic Fury",
    description:
      "The dragon can retaliate against an attacker with its breath weapon once per round.",
    iconUrl:
      "https://bg3.wiki/w/images/e/e5/Legendary_Action_Offensive_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Legendary_Action:_Draconic_Fury",
  },
  {
    id: "immune-to-control-undead",
    name: "Immune to Control Undead",
    description:
      "This creature is so powerful, it simply cannot be controlled by the magical whim of others.",
    iconUrl: "https://bg3.wiki/w/images/2/2e/Generic_Death_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Immune_to_Control_Undead",
  },
  {
    id: "metamagic-heightened-spell",
    name: "Metamagic: Heightened Spell",
    description:
      "Targets of spells that require saving throws have Disadvantage on their first saving throw.",
    iconUrl:
      "https://bg3.wiki/w/images/5/56/Metamagic_Heightened_Spell_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Metamagic:_Heightened_Spell",
  },
  {
    id: "death-burst-fire",
    name: "Death Burst: Fire",
    description:
      "When the mephit dies, it explodes in a burst of lava that deals 2d6 Fire damage to all creatures within 2 m (7 ft).",
    iconUrl: "https://bg3.wiki/w/images/f/fd/Generic_Fire_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Death_Burst:_Fire",
  },
  {
    id: "sprouting-necrosis",
    name: "Sprouting Necrosis",
    description:
      "At the end of its turns, Shadow-Cursed Vines will sprout at this creature's feet.",
    iconUrl: "https://bg3.wiki/w/images/0/06/Generic_Nature_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Sprouting_Necrosis",
  },
  {
    id: "tanglevine-form",
    name: "Tanglevine Form",
    description:
      "Any creature making a melee attack against this mess of writhing vines may become Entangled",
    iconUrl: "https://bg3.wiki/w/images/0/06/Generic_Nature_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Tanglevine_Form",
  },
  {
    id: "dwarven-combat-training",
    name: "Dwarven Combat Training",
    description:
      "You have Proficiency with Battleaxes, Handaxes, Light Hammers, and Warhammers.",
    iconUrl: "https://bg3.wiki/w/images/e/e3/Dwarven_Combat_Training_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Dwarven_Combat_Training",
  },
  {
    id: "slayer-s-improved-extra-attack",
    name: "Slayer's Improved Extra Attack",
    description:
      "You can make two additional attacks after attacking with your main-hand weapon.",
    iconUrl: "https://bg3.wiki/w/images/5/5a/Extra_Attack_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Slayer's_Improved_Extra_Attack",
  },
  {
    id: "dark-one-s-own-luck",
    name: "Dark One's Own Luck",
    description:
      "Call on your patron to change your fate and add a 1d10 to an Ability Check.",
    iconUrl: "https://bg3.wiki/w/images/5/5b/Generic_Magical_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Dark_One's_Own_Luck",
  },
  {
    id: "eldritch-spear",
    name: "Eldritch Spear",
    description: "The range of your Eldritch Blast increases by half.",
    iconUrl: "https://bg3.wiki/w/images/d/db/Eldritch_Blast_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Eldritch_Spear",
  },
  {
    id: "light-sensitivity",
    name: "Light Sensitivity",
    description:
      "While in bright light, this creature has Disadvantage on Attack Rolls and Perception Checks that rely on sight.",
    iconUrl: "https://bg3.wiki/w/images/a/a2/Sunlight_Sensitivity_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Light_Sensitivity",
  },
] as const satisfies readonly Bg3PassiveData[];

export type Bg3PassiveId = (typeof PASSIVES)[number]["id"];

export type Bg3Passive = Bg3PassiveData & { id: Bg3PassiveId };

export const BG3_PASSIVES: readonly Bg3Passive[] = PASSIVES;

export const findBg3Passive = (id: string | null | undefined) =>
  BG3_PASSIVES.find((passive) => passive.id === id);
