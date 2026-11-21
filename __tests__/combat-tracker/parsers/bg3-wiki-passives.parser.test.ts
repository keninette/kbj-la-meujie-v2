import {
  buildPassiveFromPage,
  buildPassives,
  buildResistancePassives,
  PASSIVE_PAGE_TEMPLATE,
} from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki-passives.parser";
import { parseTemplate } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.parser";

describe("buildPassives", () => {
  it("gives a passive of our list its id, in the infobox's order", () => {
    expect(buildPassives(["Darkvision", "Dark One's Own Luck"])).toEqual([
      { name: "Darkvision", bg3PassiveId: "darkvision" },
      { name: "Dark One's Own Luck", bg3PassiveId: "dark-one-s-own-luck" },
    ]);
  });

  it.each([
    ["written in lowercase", "darkvision"],
    ["given by an item", "Darkvision @ Goggles of Night"],
  ])("finds a passive %s", (_, value) => {
    expect(buildPassives([value])).toEqual([
      { name: "Darkvision", bg3PassiveId: "darkvision" },
    ]);
  });

  it("links a passive we don't know to its wiki page", () => {
    expect(buildPassives(["Bone Chill Aura @ Staff of Bones"])).toEqual([
      {
        name: "Bone Chill Aura",
        wikiLink: "https://bg3.wiki/wiki/Bone_Chill_Aura",
      },
    ]);
  });
});

describe("buildResistancePassives", () => {
  const ICON = "https://bg3.wiki/w/images/a/a5/Fire_Resistance_NM.png";

  it("names each resistance like the wiki, with its icon and the Resistances page", () => {
    expect(
      buildResistancePassives(
        ["fire resistance nm", "poison immunity"],
        new Map([["File:Fire Resistance NM.png", ICON]]),
      ),
    ).toEqual([
      {
        name: "Resistant to Non-Magical Fire",
        iconUrl: ICON,
        wikiLink: "https://bg3.wiki/wiki/Resistances",
      },
      {
        name: "Immune to all Poison",
        wikiLink: "https://bg3.wiki/wiki/Resistances",
      },
    ]);
  });

  it("keeps only the name of an unknown value", () => {
    expect(buildResistancePassives(["1"])).toEqual([{ name: "1" }]);
  });
});

describe("buildPassiveFromPage", () => {
  // Excerpt of the real page
  const RELENTLESS_ENDURANCE = `{{Passive feature page
| image = Relentless Endurance.webp
| icon = Relentless Endurance Icon.webp
| description = If you reach 0 [[Hit Points|hit points]], you regain {{DamageText|1|Healing}} instead of becoming {{Cond|Downed}}.
| brief = Upon reaching 0 [[HP]], regains 1 HP, once per [[long rest]].
| uid = RelentlessEndurance
}}`;

  const fieldsOf = (wikitext: string) =>
    parseTemplate(wikitext, PASSIVE_PAGE_TEMPLATE)!;

  it("reads the name, description and link of a passive we don't know", () => {
    expect(
      buildPassiveFromPage(
        "Relentless Endurance",
        fieldsOf(RELENTLESS_ENDURANCE),
      ),
    ).toEqual({
      name: "Relentless Endurance",
      description:
        "If you reach 0 hit points, you regain 1 Healing instead of becoming Downed.",
      wikiLink: "https://bg3.wiki/wiki/Relentless_Endurance",
    });
  });

  it("keeps only the id of a passive of our list: its texts are ours", () => {
    expect(
      buildPassiveFromPage("Fey Ancestry", {
        description: "The Feywild casts a veil over your mind.",
      }),
    ).toEqual({ name: "Fey Ancestry", bg3PassiveId: "fey-ancestry" });
  });

  it("uses the brief when there's no description", () => {
    expect(
      buildPassiveFromPage("Savage Attacks", {
        brief: "Upon landing a melee [[critical]], rolls an extra damage die.",
      }).description,
    ).toBe("Upon landing a melee critical, rolls an extra damage die.");
  });

  it.each([
    [
      "You have {{Advantage}} on {{SavingThrow}}s against being {{Cond|Charmed}}.",
      "You have Advantage on Saving Throws against being Charmed.",
    ],
    [
      "When an ally is within {{dist|m=3}} of your target, your {{Attack roll}}s have {{Advantage}}.",
      "When an ally is within 3 m of your target, your Attack rolls have Advantage.",
    ],
  ])("keeps the words written as templates: %s", (description, expected) => {
    expect(
      buildPassiveFromPage("Savage Attacks", { description }).description,
    ).toBe(expected);
  });
});
