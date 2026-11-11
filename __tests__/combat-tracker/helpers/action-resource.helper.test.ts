import { findClassResourceName } from "@/app/combat-tracker/_lib/action-resource.helper";

jest.mock("../../../app/_dictionaries/dictionnary", () => ({
  translate: (key: string) => key,
}));

describe("findClassResourceName", () => {
  it.each([
    ["a class resource", ["bonus", "wldshp"], "actionResource.wldshp"],
    [
      "the first class resource",
      ["action", "2", "layonh:2"],
      "actionResource.layonh",
    ],
    ["no spell slot", ["action", "2"], undefined],
    ["no unknown resource", ["action", "dragonRage"], undefined],
  ])("names %s", (_, costs, expected) => {
    expect(findClassResourceName({ name: "Action", costs })).toBe(expected);
  });
});
