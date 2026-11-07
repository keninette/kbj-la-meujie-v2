import {
  ActionCostKind,
  describeActionDetails,
  parseActionCost,
} from "@/app/combat-tracker/_lib/combat-action.helper";

describe("parseActionCost", () => {
  it("recognizes the action economy", () => {
    expect(parseActionCost("action")).toEqual({
      kind: ActionCostKind.ACTION,
      amount: 1,
    });
    expect(parseActionCost("bonus").kind).toBe(ActionCostKind.BONUS);
    expect(parseActionCost("reaction").kind).toBe(ActionCostKind.REACTION);
  });

  it("tells spell slots from the other resources, with their amount", () => {
    expect(parseActionCost("3")).toEqual({
      kind: ActionCostKind.SPELL_SLOT,
      resource: "3",
      amount: 1,
    });
    expect(parseActionCost("layonh:2")).toEqual({
      kind: ActionCostKind.RESOURCE,
      resource: "layonh",
      amount: 2,
    });
  });
});

describe("describeActionDetails", () => {
  const moonbeam = {
    name: "Moonbeam",
    costs: ["action", "2"],
    damages: [{ dice: "2d10", type: "Radiant" }],
    save: "CON",
    isConcentration: true,
  };

  it("describes the action without its costs", () => {
    expect(describeActionDetails(moonbeam)).toBe(
      "2d10 Radiant · CON · concentration",
    );
  });
});
