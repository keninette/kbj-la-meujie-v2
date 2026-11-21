import {
  addCustomPassive,
  draftFromPassive,
  EMPTY_PASSIVE_DRAFT,
  passiveFromDraft,
} from "@/app/combat-tracker/_lib/combat-passive.helper";

describe("passiveFromDraft", () => {
  it("gives nothing without a name", () => {
    expect(
      passiveFromDraft({
        ...EMPTY_PASSIVE_DRAFT,
        name: "  ",
        description: "x",
      }),
    ).toBeNull();
  });

  it("trims a typed passive, and leaves out an empty description", () => {
    expect(
      passiveFromDraft({ ...EMPTY_PASSIVE_DRAFT, name: "  Rage  " }),
    ).toEqual({ name: "Rage" });
    expect(
      passiveFromDraft({
        ...EMPTY_PASSIVE_DRAFT,
        name: "Rage",
        description: "  Hits harder.  ",
      }),
    ).toEqual({ name: "Rage", description: "Hits harder." });
  });

  it("keeps the icon and link of an imported passive, even once edited", () => {
    const imported = draftFromPassive({
      name: "Relentless Endurance",
      description: "If you reach 0 hit points…",
      iconUrl: "https://bg3.wiki/w/images/icon.webp",
      wikiLink: "https://bg3.wiki/wiki/Relentless_Endurance",
    });

    expect(
      passiveFromDraft({ ...imported, name: "Endurance implacable" }),
    ).toEqual({
      name: "Endurance implacable",
      description: "If you reach 0 hit points…",
      iconUrl: "https://bg3.wiki/w/images/icon.webp",
      wikiLink: "https://bg3.wiki/wiki/Relentless_Endurance",
    });
  });
});

describe("addCustomPassive", () => {
  it.each([
    [
      "its wiki page",
      { name: "Endurance", wikiLink: "https://bg3.wiki/wiki/X" },
      { name: "Relentless Endurance", wikiLink: "https://bg3.wiki/wiki/X" },
    ],
    [
      "its name, case ignored",
      { name: "rage" },
      { name: "Rage", description: "Hits harder." },
    ],
  ])("replaces the same passive, found by %s", (_, previous, passive) => {
    expect(addCustomPassive([{ name: "Other" }, previous], passive)).toEqual([
      { name: "Other" },
      passive,
    ]);
  });

  it("leaves out a passive of our list: it's already offered", () => {
    const customPassives = [{ name: "Rage" }];

    expect(
      addCustomPassive(customPassives, {
        name: "Darkvision",
        bg3PassiveId: "darkvision",
      }),
    ).toBe(customPassives);
  });
});
