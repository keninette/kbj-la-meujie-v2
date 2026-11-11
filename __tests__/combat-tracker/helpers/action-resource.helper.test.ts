import {
  hasEnoughResources,
  splitResourceVariant,
} from "@/app/combat-tracker/_lib/action-resource.helper";

jest.mock("../../../app/_dictionaries/dictionnary", () => ({
  translate: (key: string) => key,
}));

describe("splitResourceVariant", () => {
  it.each([
    ["Wild Shape: Bear", ["bonus", "wldshp"], "Bear"],
    ["Rage: Wolf Heart", ["bonus", "rage"], "Wolf Heart"],
    ["Lay on Hands: Cure", ["action", "layonh:2"], "Cure"],
  ])("splits %s", (name, costs, variant) => {
    expect(splitResourceVariant({ name, costs })).toEqual({
      resourceName: expect.stringMatching(/^actionResource\./),
      variant,
    });
  });

  it.each([
    ["an action without variant", "Flurry of Blows", ["bonus", "ki"]],
    [
      "a variant of another resource",
      "Chromatic Orb: Cold",
      ["action", "wspell1"],
    ],
    ["a resource it doesn't spend", "Wild Shape: Bear", ["bonus"]],
    ["a spell slot", "Spell: Fire", ["action", "1"]],
  ])("leaves out %s", (_, name, costs) => {
    expect(splitResourceVariant({ name, costs })).toBeUndefined();
  });
});

describe("hasEnoughResources", () => {
  it.each([
    ["a resource with uses left", ["bonus", "wldshp"], { wldshp: 1 }, true],
    ["a resource with no use left", ["bonus", "wldshp"], { wldshp: 0 }, false],
    [
      "fewer uses than the cost needs",
      ["action", "layonh:2"],
      { layonh: 1 },
      false,
    ],
    ["a resource the character doesn't track", ["bonus", "rage"], {}, true],
    ["the action economy only", ["action"], {}, true],
    ["a spell slot of its level", ["action", "2"], { "2": 1 }, true],
    ["a higher slot to upcast it", ["action", "2"], { "2": 0, "3": 1 }, true],
    ["only lower slots left", ["action", "2"], { "1": 3, "2": 0 }, false],
    [
      "no slot of its level or higher tracked",
      ["action", "3"],
      { "1": 3 },
      true,
    ],
  ])("allows %s: %p", (_, costs, actionResourcesLeft, expected) => {
    expect(
      hasEnoughResources({ name: "Action", costs }, actionResourcesLeft),
    ).toBe(expected);
  });
});
