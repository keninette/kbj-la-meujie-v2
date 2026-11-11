/**
 * Conditions of Baldur's Gate 3, from bg3.wiki: the 13 core ones of D&D,
 * then the frequent combat ones. "name" and "description" are the original
 * english texts. The french ones are in the "dndConditions" dictionary, under
 * "<id>.name" and "<id>.description": use getConditionText() to read them.
 */
export const BG3_CONDITIONS = [
  {
    id: "blinded",
    name: "Blinded",
    description:
      "Has Disadvantage on Attack Rolls. Range of attacks and spells reduced to 3 m (10 ft). Attack Rolls against Blinded creatures have Advantage.",
    iconUrl: "https://bg3.wiki/w/images/7/70/Blinded_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Blinded_(condition)",
  },
  {
    id: "charmed",
    name: "Charmed",
    description:
      "Cannot attack the spellcaster. The spellcaster has Advantage on Charisma Checks in dialogue.",
    iconUrl: "https://bg3.wiki/w/images/4/47/Charmed_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Charmed",
  },
  {
    id: "frightened",
    name: "Frightened",
    description:
      "Cannot move. Has Disadvantage on Ability Checks and Attack Rolls.",
    iconUrl: "https://bg3.wiki/w/images/7/75/Frightened_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Frightened_(condition)",
  },
  {
    id: "incapacitated",
    name: "Incapacitated",
    description:
      "Cannot take Actions or Reactions. Loses Concentration, if maintaining a Concentration spell.",
    iconUrl: "https://bg3.wiki/w/images/9/98/Incapacitated_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Incapacitated_(condition)",
  },
  {
    id: "paralysed",
    name: "Paralysed",
    description:
      "Cannot move or take actions. All attacks against the creature have Advantage, and melee attacks are always critical hits.",
    iconUrl: "https://bg3.wiki/w/images/0/09/Paralysed_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Paralysed_(condition)",
  },
  {
    id: "petrified",
    name: "Petrified",
    description:
      "Turned to stone. Can't move or take Actions, Bonus Actions, or Reactions.",
    iconUrl: "https://bg3.wiki/w/images/c/c0/Petrified_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Petrified_(condition)",
  },
  {
    id: "poisoned",
    name: "Poisoned",
    description: "Has Disadvantage on Attack Rolls and Ability Checks.",
    iconUrl: "https://bg3.wiki/w/images/e/e9/Poisoned_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Poisoned",
  },
  {
    id: "prone",
    name: "Prone",
    description:
      "Can't move or take Actions, Bonus Actions, or Reactions, and has Disadvantage on Strength and Dexterity Saving Throws. Attacks within 3 m (10 ft) have Advantage against it. Standing up costs half its Movement Speed.",
    iconUrl: "https://bg3.wiki/w/images/8/8e/Prone_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Prone_(condition)",
  },
  {
    id: "restrained",
    name: "Restrained",
    description:
      "Cannot move. Attack Rolls against the creature have Advantage, while its Attack Rolls and Dexterity Saving Throws have Disadvantage.",
    iconUrl: "https://bg3.wiki/w/images/2/20/Restrained_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Restrained_(condition)",
  },
  {
    id: "sleeping",
    name: "Sleeping",
    description:
      "Cannot move or act and automatically fails Strength and Dexterity Saving Throws. Attacks against it have Advantage, and are critical hits within melee range.",
    iconUrl: "https://bg3.wiki/w/images/3/35/Sleeping_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Sleeping_(condition)",
  },
  {
    id: "stunned",
    name: "Stunned",
    description:
      "Cannot move or take Actions, Bonus Actions, or Reactions. Automatically fails Strength and Dexterity Saving Throws. Attack Rolls against it have Advantage. Breaks Concentration.",
    iconUrl: "https://bg3.wiki/w/images/3/32/Stunned_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Stunned_(condition)",
  },
  {
    id: "unconscious",
    name: "Unconscious",
    description: "Is unconscious: cannot move or act.",
    iconUrl: "https://bg3.wiki/w/images/a/a6/Unconscious_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Unconscious_(condition)",
  },
  {
    id: "polymorphed",
    name: "Polymorphed",
    description:
      "Turned into a harmless sheep with 3 Hit Points. When the sheep's Hit Points are reduced to 0, the creature reverts to its original form with its original Hit Points.",
    iconUrl: "https://bg3.wiki/w/images/1/10/Polymorphed_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Polymorphed_(condition)",
  },
  // Frequent combat conditions
  {
    id: "acid",
    name: "Acid",
    description: "Armour Class reduced by 2.",
    iconUrl: "https://bg3.wiki/w/images/2/28/Acid_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Acid_(condition)",
  },
  {
    id: "bane",
    name: "Bane",
    description: "Has a -1d4 penalty to Attack Rolls and Saving Throws.",
    iconUrl: "https://bg3.wiki/w/images/2/2f/Bane_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Bane_(condition)",
  },
  {
    id: "bleeding",
    name: "Bleeding",
    description:
      "Takes 2 Slashing damage at the start of each turn and has Disadvantage on Constitution Saving Throws. Removed by healing.",
    iconUrl: "https://bg3.wiki/w/images/2/25/Bleeding_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Bleeding",
  },
  {
    id: "bless",
    name: "Bless",
    description: "Has a +1d4 bonus to Attack Rolls and Saving Throws.",
    iconUrl: "https://bg3.wiki/w/images/8/87/Bless_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Bless_(condition)",
  },
  {
    id: "burning",
    name: "Burning",
    description:
      "Takes 1d4 Fire damage per turn. Removed by Help, a Healing Potion, or by becoming Wet.",
    iconUrl: "https://bg3.wiki/w/images/c/c8/Burning_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Burning",
  },
  {
    id: "chilled",
    name: "Chilled",
    description:
      "Vulnerable to Cold damage and resistant to Fire damage. Becomes Frozen if it gets Wet.",
    iconUrl: "https://bg3.wiki/w/images/5/50/Chilled_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Chilled",
  },
  {
    id: "dazed",
    name: "Dazed",
    description:
      "Has Disadvantage on Wisdom Saving Throws, can't take Reactions, and loses the Dexterity bonus to its Armour Class. Removed if an ally Helps this creature.",
    iconUrl: "https://bg3.wiki/w/images/a/a2/Dazed_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Dazed",
  },
  {
    id: "downed",
    name: "Downed",
    description:
      "At 0 Hit Points: unconscious and making Death Saving Throws. 3 successes: stable. 3 failures: dies. Any damage counts as a failure. Regaining Hit Points, or being Helped, removes the condition.",
    iconUrl: "https://bg3.wiki/w/images/6/66/Downed_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Downed",
  },
  {
    id: "dying",
    name: "Dying",
    description:
      "Will not move, take actions, or respond to damage. Melee attacks always hit and are critical hits. Ranged attacks have Advantage.",
    iconUrl: "https://bg3.wiki/w/images/e/e0/Dying_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Dying_(condition)",
  },
  {
    id: "enlarged",
    name: "Enlarged",
    description:
      "Size is increased. Weapon attacks deal 1d4 more damage. Has Advantage on Strength Checks and Saving Throws.",
    iconUrl: "https://bg3.wiki/w/images/1/13/Enlarged_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Enlarged_(condition)",
  },
  {
    id: "ensnared",
    name: "Ensnared",
    description:
      "Can't move. Attack Rolls against it have Advantage, while its Attack Rolls and Dexterity Saving Throws have Disadvantage.",
    iconUrl: "https://bg3.wiki/w/images/7/75/Ensnared_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Ensnared_(condition)",
  },
  {
    id: "entangled",
    name: "Entangled",
    description:
      "Cannot move. Attack Rolls against it have Advantage, while its Attack Rolls and Dexterity Saving Throws have Disadvantage.",
    iconUrl: "https://bg3.wiki/w/images/7/75/Ensnared_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Entangled_(condition)",
  },
  {
    id: "exhausted",
    name: "Exhausted",
    description:
      "Lack of rest. There are six levels of exhaustion, each one worse than the last. A Long Rest reduces the exhaustion level by 1.",
    iconUrl: "https://bg3.wiki/w/images/9/9b/Exhausted_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Exhausted_(condition)",
  },
  {
    id: "faerie-fire",
    name: "Faerie Fire",
    description:
      "Sheds dim light. Attacks against it have Advantage. Cannot be Invisible.",
    iconUrl: "https://bg3.wiki/w/images/a/a5/Faerie_Fire_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Faerie_Fire_(condition)",
  },
  {
    id: "frozen",
    name: "Frozen",
    description:
      "Encased in ice and Incapacitated. Bludgeoning, Thunder or Force damage shatters the ice and ends the condition. Vulnerable to Bludgeoning, Thunder and Force damage, resistant to Fire damage.",
    iconUrl: "https://bg3.wiki/w/images/c/c6/Frozen_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Frozen_(condition)",
  },
  {
    id: "grappled",
    name: "Grappled",
    description:
      "Incapacitated, and cannot be damaged while held within the grapple. Help it to free it.",
    iconUrl: "https://bg3.wiki/w/images/6/60/Grappled_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Grappled_(condition)",
  },
  {
    id: "guidance",
    name: "Guidance",
    description: "Has a +1d4 bonus to Ability Checks.",
    iconUrl: "https://bg3.wiki/w/images/8/8c/Guidance_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Guidance_(condition)",
  },
  {
    id: "hastened",
    name: "Hastened",
    description:
      "+2 bonus to Armour Class, Advantage on Dexterity Saving Throws, Movement Speed increased by 9 m (30 ft), and one additional Action per turn. Becomes Lethargic when the condition ends.",
    iconUrl: "https://bg3.wiki/w/images/d/de/Hastened_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Hastened_(condition)",
  },
  {
    id: "invisible",
    name: "Invisible",
    description:
      "Has Advantage on Attack Rolls and imposes Disadvantage on enemy Attack Rolls.",
    iconUrl: "https://bg3.wiki/w/images/d/d7/Invisible_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Invisible_(condition)",
  },
  {
    id: "lethargic",
    name: "Lethargic",
    description:
      "Exhausted after Haste. Can't move or take Actions, Bonus Actions, or Reactions.",
    iconUrl: "https://bg3.wiki/w/images/3/32/Stunned_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Lethargic_(condition)",
  },
  {
    id: "off-balance",
    name: "Off Balance",
    description:
      "Has Disadvantage on Strength and Dexterity Ability Checks. Attack Rolls against it have Advantage. Removed by taking damage or when Helped.",
    iconUrl: "https://bg3.wiki/w/images/3/3e/Off_Balance_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Off_Balance_(condition)",
  },
  {
    id: "protection-from-evil-and-good",
    name: "Protection from Evil and Good",
    description:
      "Aberrations, celestials, elementals, fey, fiends and undead have Disadvantage when attacking it. Immune to being frightened and possessed.",
    iconUrl:
      "https://bg3.wiki/w/images/5/59/Protection_from_Evil_and_Good_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Protection_from_Evil_and_Good_(condition)",
  },
  {
    id: "rage",
    name: "Rage",
    description:
      "Deals 2 more damage (3 from level 9) with melee and improvised weapons, unarmed strikes and thrown objects. Resistant to Physical damage, Advantage on Strength Checks and Saving Throws. Cannot cast or concentrate on spells.",
    iconUrl: "https://bg3.wiki/w/images/5/54/Rage_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Rage_(condition)",
  },
  {
    id: "reduced",
    name: "Reduced",
    description:
      "Size is reduced. Weapon attacks deal 1d4 less damage. Has Disadvantage on Strength Checks and Saving Throws.",
    iconUrl: "https://bg3.wiki/w/images/6/67/Reduced_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Reduced_(condition)",
  },
  {
    id: "reeling",
    name: "Reeling",
    description:
      "Has a -1 penalty to Attack Rolls for every turn remaining, up to 10 turns.",
    iconUrl: "https://bg3.wiki/w/images/4/40/Reeling_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Reeling_(condition)",
  },
  {
    id: "sanctuary",
    name: "Sanctuary",
    description:
      "Can't be targeted by attacks or spells. Ends when attacking another creature.",
    iconUrl: "https://bg3.wiki/w/images/8/85/Sanctuary_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Sanctuary_(condition)",
  },
  {
    id: "shocked",
    name: "Shocked",
    description:
      "Cannot take Reactions and has Disadvantage on Dexterity Ability Checks and Saving Throws.",
    iconUrl: "https://bg3.wiki/w/images/f/f3/Shocked_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Shocked_(condition)",
  },
  {
    id: "silenced",
    name: "Silenced",
    description:
      "Can't speak or cast spells with a verbal component. Immune to Thunder damage.",
    iconUrl: "https://bg3.wiki/w/images/b/b6/Silenced_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Silenced_(condition)",
  },
  {
    id: "slowed",
    name: "Slowed",
    description:
      "Movement Speed halved, Armour Class and Dexterity Saving Throws reduced by 2. Can't take Reactions or make more than one attack per turn, and can only take either an Action or a Bonus Action.",
    iconUrl: "https://bg3.wiki/w/images/2/24/Slowed_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Slowed_(condition)",
  },
  {
    id: "surprised",
    name: "Surprised",
    description: "Cannot take Actions or Reactions.",
    iconUrl: "https://bg3.wiki/w/images/2/2c/Surprised_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Surprised_(condition)",
  },
  {
    id: "threatened",
    name: "Threatened",
    description: "An enemy is close. Has Disadvantage on ranged Attack Rolls.",
    iconUrl: "https://bg3.wiki/w/images/1/13/Threatened_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Threatened_(condition)",
  },
  {
    id: "turned",
    name: "Turned",
    description:
      "Must move as far away as possible from the creature that turned it, and cannot take Reactions. Its only Action is Dash or escaping what prevents it from moving. Ends upon taking damage.",
    iconUrl: "https://bg3.wiki/w/images/f/f3/Turned_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Turned_(condition)",
  },
  {
    id: "wet",
    name: "Wet",
    description:
      "Immune to Burning. Resistant to Fire damage. Vulnerable to Lightning and Cold damage.",
    iconUrl: "https://bg3.wiki/w/images/9/9d/Wet_Condition_Icon.webp",
    wikiLink: "https://bg3.wiki/wiki/Wet_(condition)",
  },
] as const;

export type Bg3Condition = (typeof BG3_CONDITIONS)[number];

export type Bg3ConditionId = Bg3Condition["id"];

export const findBg3Condition = (id: string | null | undefined) =>
  BG3_CONDITIONS.find((condition) => condition.id === id);
