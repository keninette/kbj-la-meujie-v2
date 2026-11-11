import { splitResourceVariant } from "@/app/combat-tracker/_lib/action-resource.helper";

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
