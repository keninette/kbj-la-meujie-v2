import { normalizeActionResourceId } from "@/app/combat-tracker/_lib/bg3-action-resources";

describe("normalizeActionResourceId", () => {
  it.each([
    ["spell1", "1"],
    ["level3", "3"],
    ["s2", "2"],
    ["l9", "9"],
    ["4", "4"],
    ["wldshp", "wldshp"],
    ["Wild Shape", "wldshp"],
    ["ws", "wldshp"],
    ["star map", "starmap"],
    [" Rage ", "rage"],
  ])("reads %p as %p", (name, expected) => {
    expect(normalizeActionResourceId(name)).toBe(expected);
  });

  it("keeps an unknown resource as written, trimmed", () => {
    expect(normalizeActionResourceId(" Dragon Rage ")).toBe("Dragon Rage");
  });
});
