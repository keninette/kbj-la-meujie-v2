import {
  Bg3WikiErrorEnum,
  buildCharacterFromInfobox,
  extractPageTitleFromUrl,
  getHighestDifficultyValue,
  getImageFileCandidates,
  mergeCombatInfobox,
  buildShortDescription,
  buildWikiLink,
  parseInfobox,
  parseResources,
} from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.parser";

// Trimmed copy of https://bg3.wiki/wiki/Kagha (API wikitext)
const KAGHA_WIKITEXT = `{{Infobox creature
| name = Kagha
| class = [[Druid]]
| subclass = [[Circle of the Land]]
| race = [[Elf]]
| subrace = [[Wood elf]]
| level = 5
| ac = 14
| e hp = 45
| hp = 65
| t hp = 84
| movement m = 9
| str = 16
| dex = 16
| con = 14
| int = 14
| wis = 16
| cha = 14
| int save prof = Yes
| wis save prof = Yes
| resources = spell1:4, spell2:3, spell3:2, wldshp:2
| resistances = poison resistant full
| passives = Darkvision, Fey Ancestry, Opportunity Attack, Venomous Revenge
| page description = Kagha is a wood elven druid.
}}

'''Kagha''' is a wood elven druid in the [[Emerald Grove]].

{{Feature box|Moonbeam}}`;

describe("bg3 wiki parser", () => {
  describe("extractPageTitleFromUrl", () => {
    it("returns the page title from a wiki URL", () => {
      expect(extractPageTitleFromUrl("https://bg3.wiki/wiki/Kagha")).toBe(
        "Kagha",
      );
      expect(
        extractPageTitleFromUrl("  https://bg3.wiki/wiki/Minthara%27s_Ward "),
      ).toBe("Minthara's_Ward");
    });

    it.each([
      "not a url",
      "https://example.com/wiki/Kagha",
      "https://bg3.wiki/",
      // Malformed escape sequence
      "https://bg3.wiki/wiki/100%_Damage",
    ])("rejects %s", (url) => {
      expect(() => extractPageTitleFromUrl(url)).toThrow(
        Bg3WikiErrorEnum.INVALID_URL,
      );
    });
  });

  describe("parseInfobox", () => {
    it("keeps pipes that belong to links and nested templates", () => {
      const fields = parseInfobox(
        "{{Infobox creature\n| race = [[Elf|Elven]]\n| note = {{ref|a|b}}\n}}",
      );
      expect(fields.race).toBe("[[Elf|Elven]]");
      expect(fields.note).toBe("{{ref|a|b}}");
    });

    it("throws when the page has no creature infobox", () => {
      expect(() => parseInfobox("{{Infobox item\n| name = Club\n}}")).toThrow(
        Bg3WikiErrorEnum.NO_INFOBOX,
      );
      expect(() => parseInfobox("Just some text")).toThrow(
        Bg3WikiErrorEnum.NO_INFOBOX,
      );
    });
  });

  describe("getHighestDifficultyValue", () => {
    it("prefers Honour, then Tactician, then the plain value", () => {
      const fields = { hp: "10", "t hp": "20", "h hp": "30", ac: "12" };
      expect(getHighestDifficultyValue(fields, "hp")).toBe("30");
      expect(getHighestDifficultyValue({ hp: "10", "t hp": "20" }, "hp")).toBe(
        "20",
      );
      expect(getHighestDifficultyValue(fields, "ac")).toBe("12");
      expect(getHighestDifficultyValue(fields, "missing")).toBeUndefined();
    });

    it("falls back when the preferred value is only markup", () => {
      expect(
        getHighestDifficultyValue(
          { "h hp": "<!-- TBD -->", "t hp": "{{ref|unknown}}", hp: "65" },
          "hp",
        ),
      ).toBe("65");
      expect(
        getHighestDifficultyValue({ "h hp": "<!-- TBD -->" }, "hp"),
      ).toBeUndefined();
    });
  });

  describe("parseResources", () => {
    it("keys spell slots by level and keeps other resources as named", () => {
      expect(parseResources("spell1:4, spell2:3, wldshp:2")).toEqual({
        "1": 4,
        "2": 3,
        wldshp: 2,
      });
      expect(parseResources(undefined)).toEqual({});
    });

    it("counts a resource listed without an amount once", () => {
      expect(parseResources("chaoat, layonh:4")).toEqual({
        chaoat: 1,
        layonh: 4,
      });
    });
  });

  describe("buildShortDescription", () => {
    const getter = (fields: Record<string, string>) => (field: string) =>
      fields[field];

    it("uses the subrace in place of the race, then class and level", () => {
      expect(
        buildShortDescription(
          getter({
            subrace: "Lightfoot halfling",
            race: "Halfling",
            class: "Fighter",
            level: "3",
          }),
        ),
      ).toBe("Lightfoot halfling Fighter level 3");
    });

    it("falls back on the race and skips missing parts", () => {
      expect(
        buildShortDescription(getter({ race: "Goblin", level: "2" })),
      ).toBe("Goblin level 2");
      expect(buildShortDescription(getter({}))).toBe("");
    });
  });

  describe("buildWikiLink", () => {
    it("builds the page URL from the title returned by the wiki", () => {
      expect(buildWikiLink("Kagha")).toBe("https://bg3.wiki/wiki/Kagha");
      expect(buildWikiLink("Minthara, Baenre Paladin")).toBe(
        "https://bg3.wiki/wiki/Minthara,_Baenre_Paladin",
      );
    });

    it("escapes characters that would end the page path", () => {
      const link = buildWikiLink("Who? What #1 & co");
      expect(link).toBe("https://bg3.wiki/wiki/Who%3F_What_%231_%26_co");
      expect(extractPageTitleFromUrl(link)).toBe("Who?_What_#1_&_co");
    });
  });

  describe("wiki markup in values", () => {
    it("drops footnote templates and <ref> tags (e.g. Loic's class)", () => {
      const fields = {
        class:
          "[[Fighter]]{{ref|Despite being nominally a druid, {{em|Loic}} is a fighter.}}",
        race: "[[Halfling]]<ref name='x'>A note</ref>",
        passives: "Brave<ref name='y' />, Halfling Luck",
      };
      expect(getHighestDifficultyValue(fields, "class")).toBe("Fighter");
      expect(getHighestDifficultyValue(fields, "race")).toBe("Halfling");
      expect(getHighestDifficultyValue(fields, "passives")).toBe(
        "Brave, Halfling Luck",
      );
    });

    it("keeps the text displayed by other templates", () => {
      const fields = {
        passives: "{{SAI|Darkvision}}, {{SAI|Fey Ancestry|size=20}}",
      };
      expect(getHighestDifficultyValue(fields, "passives")).toBe(
        "Darkvision, Fey Ancestry",
      );
    });

    it("keeps links passed to a template whole", () => {
      expect(
        getHighestDifficultyValue(
          { passives: "{{SAI|[[Darkvision|Dark vision]]}}, Brave" },
          "passives",
        ),
      ).toBe("Dark vision, Brave");
    });
  });

  describe("getImageFileCandidates", () => {
    it("returns the portrait first, then the in-game render", () => {
      expect(
        getImageFileCandidates(
          parseInfobox(
            "{{Infobox creature\n| in game = Kagha.png\n| portrait = Portrait Kagha.png\n}}",
          ),
        ),
      ).toEqual(["File:Portrait Kagha.png", "File:Kagha.png"]);
    });

    it("ignores missing fields and existing File: prefixes", () => {
      expect(
        getImageFileCandidates(
          parseInfobox("{{Infobox creature\n| in game = File:Loic.png\n}}"),
        ),
      ).toEqual(["File:Loic.png"]);
      expect(
        getImageFileCandidates(
          parseInfobox("{{Infobox creature\n| hp = 3\n}}"),
        ),
      ).toEqual([]);
    });
  });

  describe("buildCharacterFromInfobox", () => {
    it("adds the picture when one was found", () => {
      const url = "https://bg3.wiki/w/images/5/5d/Portrait_Kagha.png";
      expect(
        buildCharacterFromInfobox(parseInfobox(KAGHA_WIKITEXT), "Kagha", {
          imageUrl: url,
        }).imageUrl,
      ).toBe(url);
    });

    it("adds the actions when some were found", () => {
      const actions = [{ name: "Moonbeam", costs: ["action", "2"] }];
      expect(
        buildCharacterFromInfobox(parseInfobox(KAGHA_WIKITEXT), "Kagha", {
          actions,
        }).actions,
      ).toEqual(actions);
      expect(
        buildCharacterFromInfobox(parseInfobox(KAGHA_WIKITEXT), "Kagha", {
          actions: [],
        }),
      ).not.toHaveProperty("actions");
    });

    it("builds Kagha with her Tactician stats", () => {
      expect(
        buildCharacterFromInfobox(parseInfobox(KAGHA_WIKITEXT), "Kagha"),
      ).toEqual({
        name: "Kagha",
        shortDescription: "Wood elf Druid level 5",
        wikiLink: "https://bg3.wiki/wiki/Kagha",
        hp: 84,
        maxHp: 84,
        isDying: false,
        isDead: false,
        isNpc: true,
        deathSaveThrowsLeft: 3,
        ac: 14,
        initiativeScore: 0,
        movement: 9,
        abilities: { str: 16, dex: 16, con: 14, int: 14, wis: 16, cha: 14 },
        // Level 5: proficiency bonus of 3 for intelligence and wisdom
        savingThrows: { str: 3, dex: 3, con: 2, int: 5, wis: 6, cha: 2 },
        spellSlotsLeft: { "1": 4, "2": 3, "3": 2, wldshp: 2 },
        passives: [
          "Darkvision",
          "Fey Ancestry",
          "Opportunity Attack",
          "Venomous Revenge",
          "poison resistant full",
        ],
      });
    });

    it("skips the saving throws without level or proficiency", () => {
      const withoutLevel = buildCharacterFromInfobox(
        parseInfobox(
          "{{Infobox creature\n| str = 12\n| str save prof = Yes\n}}",
        ),
        "Goblin",
      );
      expect(withoutLevel.abilities).toEqual({ str: 12 });
      expect(withoutLevel).not.toHaveProperty("savingThrows");

      const withoutProficiency = buildCharacterFromInfobox(
        parseInfobox("{{Infobox creature\n| level = 3\n| str = 12\n}}"),
        "Goblin",
      );
      expect(withoutProficiency).not.toHaveProperty("savingThrows");
      expect(withoutProficiency).not.toHaveProperty("movement");
    });

    it("uses Honour values when present and falls back on the page title", () => {
      const character = buildCharacterFromInfobox(
        parseInfobox(
          "{{Infobox creature\n| hp = 26\n| t hp = 33\n| h hp = 50\n| ac = 12\n| h ac = 15\n}}",
        ),
        "Some_Boss",
      );
      expect(character.name).toBe("Some Boss");
      expect(character.hp).toBe(50);
      expect(character.ac).toBe(15);
      expect(character.spellSlotsLeft).toBeUndefined();
      expect(character.passives).toBeUndefined();
      expect(character.shortDescription).toBeUndefined();
      expect(character.wikiLink).toBe("https://bg3.wiki/wiki/Some_Boss");
    });
  });

  describe("mergeCombatInfobox", () => {
    it("uses the combat subpage's stats, with all their difficulties", () => {
      const fields = mergeCombatInfobox(
        parseInfobox(
          "{{Infobox creature\n| name = Nightwarden Minthara\n| portrait = Main.jpg\n| race = [[Drow]]\n| h ac = 20\n| background = Noble\n}}",
        ),
        parseInfobox(
          "{{Infobox creature\n| name = Minthara\n| portrait = Portrait Minthara.png\n| ac = 16\n| hp = 52\n| t hp = 67\n}}",
        ),
      );

      expect(fields).toEqual({
        name: "Minthara",
        portrait: "Portrait Minthara.png",
        race: "[[Drow]]",
        // The main page's Honour AC doesn't beat the subpage's AC
        ac: "16",
        hp: "52",
        "t hp": "67",
        background: "Noble",
      });
      expect(buildCharacterFromInfobox(fields, "Minthara")).toMatchObject({
        name: "Minthara",
        ac: 16,
        hp: 67,
        maxHp: 67,
      });
    });
  });
});
