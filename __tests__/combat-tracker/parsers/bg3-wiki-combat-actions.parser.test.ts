import { DamageTypeEnum } from "@/app/_lib/enums/damage-type.enum";
import { AbilityEnum } from "@/app/_lib/enums/ability.enum";
import {
  buildCombatActions,
  buildPagesWhere,
  cleanDescription,
  extractFeatureBoxes,
  findCombatSubpage,
  findWeaponItems,
  getWeaponDamages,
  parseCosts,
  parseDamageType,
  uniqueFeatureBoxes,
  WikiActionRow,
  WikiWeaponRow,
} from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki-combat-actions.parser";

// Shortened from https://bg3.wiki/wiki/Kagha
const KAGHA_COMBAT = `== Combat ==

=== Attacks and actions ===

Kagha has an ability kit similar to a Level 5 [[Druid|druid]].

{{Feature box|Cure Wounds}}
{{Feature box|Main Hand Attack|item=dagger}}
{{Feature box|Moonbeam}}
{{Feature box|Off-Hand Attack (Melee)|item=Scimitar}}
{{Feature box|Moonbeam}}

=== Allies ===

{{Feature box|Not an action of Kagha}}
`;

// The actions table export, as returned by the wiki (Heat Metal unchanged)
const HEAT_METAL_DESCRIPTION =
  "Cause a metal weapon or armour to glow red-hot and force the wearer to let go or receive &lt;span class=&quot;bg3wiki-icontext-icon nowrap&quot; &gt;&lt;span class=&quot;bg3wiki-hidden-code&quot;&gt;&lt;/span&gt;[[File:Disadvantage Icon.png|x20px|link=Disadvantage|alt=Disadvantage|class=bg3wiki-icon]]&lt;/span&gt;&amp;#8239;[[Disadvantage|Disadvantage]] on &lt;span class=&quot;bg3wiki-icontext-icon nowrap&quot; &gt;&lt;span class=&quot;bg3wiki-hidden-code&quot;&gt;&lt;/span&gt;[[File:Attack Roll Icon.png|x25px|link=|alt=[[Attack Roll]]|class=bg3wiki-icon]]&lt;/span&gt;&amp;#8239;[[Attack Roll]]s and [[Ability Check|Ability Checks]].";

const row = (values: Partial<WikiActionRow>): WikiActionRow => ({
  page: "Moonbeam",
  name: "Moonbeam",
  type: null,
  cost: null,
  "spell level": null,
  "damage 1": null,
  "damage 1 type": null,
  save: null,
  "is concentration": 0,
  recharge: null,
  brief: "",
  description: null,
  "hotbar icon": null,
  ...values,
});

describe("bg3-wiki combat actions parser", () => {
  describe("parseDamageType", () => {
    it.each([
      ["Fire", DamageTypeEnum.FIRE],
      [" bludgeoning ", DamageTypeEnum.BLUDGEONING],
      ["Healing", DamageTypeEnum.HEALING],
      ["Weapon", undefined],
      [null, undefined],
    ])("reads %p as %p", (value, expected) => {
      expect(parseDamageType(value)).toBe(expected);
    });
  });

  describe("extractFeatureBoxes", () => {
    it("reads the boxes of the 'Attacks and actions' section only, once each", () => {
      expect(extractFeatureBoxes(KAGHA_COMBAT)).toEqual([
        { page: "Cure Wounds" },
        { page: "Main Hand Attack", item: "dagger" },
        { page: "Moonbeam" },
        { page: "Off-Hand Attack (Melee)", item: "Scimitar" },
      ]);
    });

    it("reads the whole page without that section, and the overrides", () => {
      expect(
        extractFeatureBoxes(
          "{{feature box|aid|cost=action|recharge=Long rest|item=Absolute's Talisman}}",
        ),
      ).toEqual([
        {
          page: "Aid",
          cost: "action",
          recharge: "Long rest",
          item: "Absolute's Talisman",
        },
      ]);
      expect(extractFeatureBoxes("No actions here")).toEqual([]);
    });

    it("reads the other spellings and the reaction boxes", () => {
      expect(
        extractFeatureBoxes(
          "{{feature_box|Soul Branding}}\n{{Reaction box|Divine Smite (reaction)}}",
        ),
      ).toEqual([
        { page: "Soul Branding" },
        { page: "Divine Smite (reaction)" },
      ]);
    });
  });

  describe("extractFeatureBoxes with markup", () => {
    it("keeps links and templates inside the params", () => {
      expect(
        extractFeatureBoxes(
          `{{Feature box|Main Hand Attack|item=[[Dagger|dagger]]}}
{{Feature box|Off-Hand Attack (Melee)|item={{SAI|Scimitar}}}}
{{Feature box|Unclosed`,
        ),
      ).toEqual([
        { page: "Main Hand Attack", item: "dagger" },
        { page: "Off-Hand Attack (Melee)", item: "Scimitar" },
      ]);
    });
  });

  describe("uniqueFeatureBoxes", () => {
    it("keeps the first box of each action and item", () => {
      expect(
        uniqueFeatureBoxes([
          { page: "Fire Bolt" },
          { page: "Main Hand Attack", item: "Dagger" },
          { page: "Fire Bolt", cost: "bonus" },
          { page: "Main Hand Attack", item: "Club" },
        ]),
      ).toEqual([
        { page: "Fire Bolt" },
        { page: "Main Hand Attack", item: "Dagger" },
        { page: "Main Hand Attack", item: "Club" },
      ]);
    });
  });

  describe("findCombatSubpage", () => {
    it("finds the boss subpage listing the actions", () => {
      expect(
        findCombatSubpage("== Combat ==\n{{Main|Minthara/Combat}}\n"),
      ).toBe("Minthara/Combat");
      expect(findCombatSubpage("{{Main|Minthara}}")).toBeUndefined();
    });
  });

  describe("buildPagesWhere", () => {
    it("quotes the pages without case and leaves out the ones it can't quote", () => {
      expect(
        buildPagesWhere(["Moonbeam", "Absolute's Ward", 'The "Bad" one']),
      ).toBe(`LOWER(_pageName) IN ("moonbeam","absolute's ward")`);
      expect(buildPagesWhere(['The "Bad" one'])).toBeUndefined();
      expect(buildPagesWhere([])).toBeUndefined();
    });
  });

  describe("parseCosts", () => {
    it("keys spell slots by level and keeps amounts above one", () => {
      expect(parseCosts("action, spell2")).toEqual(["action", "2"]);
      expect(parseCosts("action, layonh:2")).toEqual(["action", "layonh:2"]);
      expect(parseCosts("bonus, spell1:1")).toEqual(["bonus", "1"]);
      expect(parseCosts(null)).toEqual([]);
    });

    it.each([
      ["all the movement", "movement", ["movement"]],
      ["half of it", "half movement", ["movement:half"]],
      ["some meters", "bonus, movement m:6", ["bonus", "movement:6"]],
      ["some meters, written another way", "movement:3", ["movement:3"]],
    ])("reads %s as a movement cost", (_, cost, expected) => {
      expect(parseCosts(cost)).toEqual(expected);
    });
  });

  describe("cleanDescription", () => {
    it.each([
      [
        "the icons, links and tags of an exported description",
        HEAT_METAL_DESCRIPTION,
        "Cause a metal weapon or armour to glow red-hot and force the wearer to let go or receive Disadvantage on Attack Rolls and Ability Checks.",
      ],
      [
        // Trimmed from the Produce Flame row (e.g. used by Tahan)
        "the &NoBreak; between dice and their damage type",
        "deals &lt;span class=&quot;bg3wiki-damage-type-fire&quot;&gt;1d8&lt;/span&gt;&amp;NoBreak;&lt;span class=&quot;bg3wiki-icontext-icon nowrap&quot; &gt;[[File:Fire Damage Icon.png|x20px|link=Fire|alt=&lt;span class=&quot;bg3wiki-damage-type-fire&quot;&gt;Fire&lt;/span&gt;|class=bg3wiki-icon]]&lt;/span&gt;&amp;NoBreak;[[Fire|&lt;span class=&quot;bg3wiki-damage-type-fire&quot;&gt;Fire&lt;/span&gt;]] damage when thrown.",
        "deals 1d8 Fire damage when thrown.",
      ],
      [
        "the characters escaped once or twice",
        "Move the beam 18&amp;#8239;m. Higher if you&#039;re hidden.",
        "Move the beam 18 m. Higher if you're hidden.",
      ],
      [
        "the tags, but not the escaped comparison signs",
        "Deals 1d6 if HP &lt; 50%, else &gt; 2d6. &lt;b&gt;Bold&lt;/b&gt;",
        "Deals 1d6 if HP < 50%, else > 2d6. Bold",
      ],
      [
        // Rather than breaking the import
        "nothing of an invalid character code",
        "Bad &#x110000; code",
        "Bad &#x110000; code",
      ],
      ["nothing of a missing description", null, ""],
    ])("cleans %s", (_, description, expected) => {
      expect(cleanDescription(description)).toBe(expected);
    });
  });

  describe("buildCombatActions", () => {
    // e.g. Maggran: "{{Feature box|produce flame}}" for the "Produce Flame" page
    it("finds the row of a page written in lowercase", () => {
      const actions = buildCombatActions(
        [{ page: "Produce flame" }],
        [row({ page: "Produce Flame", name: "Produce Flame" })],
      );

      expect(actions.map((action) => action.name)).toEqual(["Produce Flame"]);
    });

    it("builds one action per box, in order, with the page's own row", () => {
      const rows = [
        row({
          page: "Main Hand Attack (Steel Watcher)",
          name: "Main Hand Attack",
          "damage 1": "3d12",
        }),
        row({
          page: "Main Hand Attack",
          name: "Main Hand Attack",
          type: "weapon action",
          cost: "action",
          "damage 1": "weapon",
          description: "Make a melee attack with your equipped weapon.",
        }),
        row({
          type: "spell",
          cost: "action, spell2",
          "spell level": 2,
          "damage 1": "2d10",
          "damage 1 type": "Radiant",
          save: "CON",
          "is concentration": 1,
          description: "Call down a beam of light.",
          "hotbar icon": "Moonbeam Unfaded Icon.webp",
        }),
      ];
      const icons = new Map([
        [
          "File:Moonbeam Unfaded Icon.webp",
          "https://bg3.wiki/w/images/1/1a/Moonbeam_Unfaded_Icon.webp",
        ],
      ]);

      expect(
        buildCombatActions(
          [
            { page: "Moonbeam" },
            { page: "Main Hand Attack", item: "dagger" },
            { page: "Leadership" },
          ],
          rows,
          { iconUrls: icons },
        ),
      ).toEqual([
        {
          name: "Moonbeam",
          type: "spell",
          costs: ["action", "2"],
          spellLevel: 2,
          damages: [{ dice: "2d10", type: DamageTypeEnum.RADIANT }],
          save: "CON",
          isConcentration: true,
          description: "Call down a beam of light.",
          iconUrl: "https://bg3.wiki/w/images/1/1a/Moonbeam_Unfaded_Icon.webp",
          wikiLink: "https://bg3.wiki/wiki/Moonbeam",
        },
        {
          name: "Main Hand Attack",
          type: "weapon action",
          costs: ["action"],
          damages: [{ dice: "weapon" }],
          item: "Dagger",
          description: "Make a melee attack with your equipped weapon.",
          wikiLink: "https://bg3.wiki/wiki/Main_Hand_Attack",
        },
      ]);
    });

    it("applies the character page's cost and recharge", () => {
      const [aid] = buildCombatActions(
        [{ page: "Aid", cost: "bonus", recharge: "Long rest" }],
        [row({ page: "Aid", name: "Aid", cost: "action, spell2" })],
      );
      expect(aid.costs).toEqual(["bonus"]);
      expect(aid.recharge).toBe("Long rest");
    });

    it("ignores the rows without a name", () => {
      const [moonbeam] = buildCombatActions(
        [{ page: "Moonbeam" }],
        [row({ name: null, type: "other" }), row({ type: "spell" })],
      );
      expect(moonbeam.type).toBe("spell");
    });

    it("treats a level 0 spell as a cantrip", () => {
      const [fireBolt] = buildCombatActions(
        [{ page: "Fire Bolt" }],
        [row({ page: "Fire Bolt", name: "Fire Bolt", "spell level": 0 })],
      );
      expect(fireBolt.spellLevel).toBe(0);
    });
  });

  // From the wiki's weapons table: https://bg3.wiki/wiki/Everburn_Blade, Club…
  const weapon = (values: Partial<WikiWeaponRow>): WikiWeaponRow => ({
    page: "Everburn Blade",
    damage: "2d6",
    "damage type": "Slashing",
    "versatile damage": null,
    "extra damage": "1d4",
    "extra damage type": "Fire",
    "extra damage 2": null,
    "extra damage 2 type": null,
    finesse: 0,
    "melee or ranged": "melee",
    ...values,
  });

  describe("getWeaponDamages", () => {
    it("adds FOR to a melee weapon's damage, not to its extra damage", () => {
      expect(getWeaponDamages(weapon({}), {})).toEqual([
        {
          dice: "2d6",
          abilities: [AbilityEnum.STRENGTH],
          type: DamageTypeEnum.SLASHING,
        },
        { dice: "1d4", type: DamageTypeEnum.FIRE },
      ]);
    });

    it("keeps the enchantment and the two-handed damage of a versatile weapon", () => {
      const [damage] = getWeaponDamages(
        weapon({
          damage: "1d8 + 1",
          "versatile damage": "1d10+1",
          "extra damage": null,
        }),
        {},
      );
      expect(damage).toMatchObject({ dice: "1d8+1", versatileDice: "1d10+1" });
    });

    it.each([
      [
        "DEX for a ranged weapon",
        { "melee or ranged": "ranged" },
        {},
        [AbilityEnum.DEXTERITY],
      ],
      [
        "the best of FOR and DEX for a finesse weapon",
        { finesse: 1 },
        { str: 10, dex: 16 },
        [AbilityEnum.DEXTERITY],
      ],
      [
        "both for a finesse weapon when the scores are unknown",
        { finesse: 1 },
        {},
        [AbilityEnum.STRENGTH, AbilityEnum.DEXTERITY],
      ],
    ])("adds %s", (_, values, abilities, expected) => {
      const [damage] = getWeaponDamages(weapon(values), abilities);
      expect(damage.abilities).toEqual(expected);
    });

    it("gives nothing for a weapon without damage", () => {
      expect(getWeaponDamages(weapon({ damage: null }), {})).toEqual([]);
    });
  });

  describe("buildCombatActions with weapons", () => {
    const mainHandAttack = row({
      page: "Main Hand Attack",
      name: "Main Hand Attack",
      "damage 1": "weapon",
    });

    // e.g. Maggran: "{{Feature box|main hand attack|item=Club}}"
    it("deals the damage of the weapon it's made with, found without case", () => {
      const [attack] = buildCombatActions(
        [{ page: "Main Hand Attack", item: "club" }],
        [mainHandAttack],
        {
          weapons: [
            weapon({
              page: "Club",
              damage: "1d4",
              "damage type": "Bludgeoning",
              "extra damage": null,
            }),
          ],
        },
      );
      expect(attack.damages).toEqual([
        {
          dice: "1d4",
          abilities: [AbilityEnum.STRENGTH],
          type: DamageTypeEnum.BLUDGEONING,
        },
      ]);
    });

    it("keeps the weapon damage when the weapon isn't found", () => {
      const [attack] = buildCombatActions(
        [{ page: "Main Hand Attack", item: "Unknown Blade" }],
        [mainHandAttack],
        { weapons: [weapon({})] },
      );
      expect(attack.damages).toEqual([{ dice: "weapon" }]);
    });

    it("lists the items of the actions dealing their weapon's damage only", () => {
      expect(
        findWeaponItems(
          [
            { page: "Main Hand Attack", item: "Club" },
            { page: "Moonbeam", item: "Staff" },
          ],
          [mainHandAttack, row({ "damage 1": "2d10" })],
        ),
      ).toEqual(["Club"]);
    });
  });
});
