import { DamageTypeEnum } from "@/app/_lib/enums/damage-type.enum";
import { AbilityEnum } from "@/app/_lib/enums/ability.enum";
import {
  ActionCostKind,
  describeActionDetails,
  describeDamage,
  getActionGroup,
  parseActionCost,
} from "@/app/combat-tracker/_lib/combat-action.helper";

// dictionnary.ts uses top-level await, unsupported by Jest's CJS environment.
jest.mock("../../../app/_dictionaries/dictionnary", () => ({
  translate: (key: string) => key,
}));

describe("getActionGroup", () => {
  it.each([
    ["an action", ["action"], ActionCostKind.ACTION],
    ["a bonus action", ["bonus"], ActionCostKind.BONUS],
    ["a bonus action with a spell slot", ["bonus", "1"], ActionCostKind.BONUS],
    ["a reaction", ["reaction"], ActionCostKind.REACTION],
    ["an action without cost", [], ActionCostKind.ACTION],
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

  it.each([
    ["all the movement", "movement", undefined],
    ["half of it", "movement:half", "half"],
    ["some meters", "movement:6", "6"],
  ])("recognizes %s", (_, cost, resource) => {
    expect(parseActionCost(cost)).toEqual({
      kind: ActionCostKind.MOVEMENT,
      resource,
      amount: 1,
    });
  });
});

describe("describeDamage", () => {
  it.each([
    [
      "a spell's damage without its type",
      { dice: "2d10", type: DamageTypeEnum.RADIANT },
      "2d10",
    ],
    [
      "a weapon's damage with its ability",
      { dice: "2d6", abilities: [AbilityEnum.STRENGTH] },
      "2d6+ability.str",
    ],
    [
      "a versatile weapon with both abilities of a finesse one",
      {
        dice: "1d6",
        versatileDice: "1d8",
        abilities: [AbilityEnum.STRENGTH, AbilityEnum.DEXTERITY],
      },
      "1d6 (1d8)+ability.str/ability.dex",
    ],
  ])("writes %s", (_, damage, expected) => {
    expect(describeDamage(damage)).toBe(expected);
  });
});

describe("describeActionDetails", () => {
  const moonbeam = {
    name: "Moonbeam",
    item: "Staff",
    costs: ["action", "2"],
    damages: [{ dice: "2d10", type: DamageTypeEnum.RADIANT }],
    save: "CON",
    isConcentration: true,
  };

  it("describes the action without its costs, item nor damages", () => {
    expect(describeActionDetails(moonbeam)).toBe("CON · actions.concentration");
  });
});
