import {
  buildPassives,
  buildResistancePassives,
} from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki-passives.parser";

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
