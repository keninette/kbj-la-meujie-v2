import {
  ActionCostKind,
  ActionGroupEnum,
  describeActionDetails,
  getActionGroup,
  parseActionCost,
} from "@/app/combat-tracker/_lib/combat-action.helper";

// dictionnary.ts uses top-level await, unsupported by Jest's CJS environment.
jest.mock("../../../app/_dictionaries/dictionnary", () => ({
  translate: (key: string) => key,
}));

describe("getActionGroup", () => {
  it.each([
    ["an action", ["action"], ActionGroupEnum.ACTION],
    ["a bonus action", ["bonus"], ActionGroupEnum.BONUS],
    ["a bonus action with a spell slot", ["bonus", "1"], ActionGroupEnum.BONUS],
    // Reactions have no group of their own
    ["a reaction", ["reaction"], ActionGroupEnum.ACTION],
    ["an action without cost", [], ActionGroupEnum.ACTION],
  ])("puts %s in its group", (_, costs, group) => {
    expect(getActionGroup({ name: "Moonbeam", costs })).toBe(group);
  });
});

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
      "2d10 Radiant · CON · actions.concentration",
    );
  });
});
