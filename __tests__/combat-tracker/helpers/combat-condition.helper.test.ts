import {
  describeConditionDuration,
  describeConditionSave,
} from "@/app/combat-tracker/_lib/combat-condition.helper";

// dictionnary.ts uses top-level await, unsupported by Jest's CJS environment.
jest.mock("../../../app/_dictionaries/dictionnary", () => ({
  translate: (
    key: string,
    _namespace: string,
    values?: Record<string, string>,
  ) =>
    key === "stats.conditionDuration"
      ? `${values?.count} tours`
      : key === "stats.conditionAppliedOnTurn"
        ? `(depuis le tour ${values?.turn})`
        : "DD",
  hasTranslation: () => false,
}));

describe("describeConditionDuration", () => {
  it.each([
    ["the duration", { numberOfTurns: 2 }, "2 tours"],
    [
      "the duration and the turn it was applied on",
      { numberOfTurns: 3, appliedOnTurn: 2 },
      "3 tours (depuis le tour 2)",
    ],
    [
      "the applied turn, without duration",
      { appliedOnTurn: 3 },
      "(depuis le tour 3)",
    ],
    ["nothing when neither is known", {}, ""],
  ])("shows %s", (_, known, expected) => {
    expect(
      describeConditionDuration({ id: "c1", name: "Poisoned", ...known }),
    ).toBe(expected);
  });
});

describe("describeConditionSave", () => {
  it.each([
    [
      "the ability and the DC",
      { saveThrowStat: "CON", saveThrowDc: 13 },
      "CON DD 13",
    ],
    ["only the DC", { saveThrowDc: 10 }, "DD 10"],
    ["nothing without a save", {}, ""],
  ])("shows %s", (_, known, expected) => {
    expect(describeConditionSave({ id: "c1", name: "Prone", ...known })).toBe(
      expected,
    );
  });
});
