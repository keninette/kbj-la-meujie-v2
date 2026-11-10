import { describeState } from "@/app/combat-tracker/_lib/combat-state.helper";

// dictionnary.ts uses top-level await, unsupported by Jest's CJS environment.
jest.mock("../../../app/_dictionaries/dictionnary", () => ({
  translate: (
    key: string,
    _namespace: string,
    values?: Record<string, string>,
  ) =>
    key === "stats.stateDuration"
      ? `pendant ${values?.duration} tours`
      : key === "stats.stateAppliedOnTurn"
        ? `(appliqué au tour ${values?.turn})`
        : "DD",
}));

describe("describeState", () => {
  it("adds the duration and the save when known", () => {
    expect(
      describeState({
        id: "s1",
        name: "Poisoned",
        numberOfTurns: 2,
        saveThrowStat: "CON",
        saveThrowDc: 13,
      }),
    ).toBe("Poisoned pendant 2 tours, CON DD 13");
    expect(describeState({ id: "s2", name: "Prone", saveThrowDc: 10 })).toBe(
      "Prone, DD 10",
    );
    expect(describeState({ id: "s3", name: "Blessed" })).toBe("Blessed");
  });

  it("adds the turn the state was applied on, when known", () => {
    expect(
      describeState({
        id: "s1",
        name: "Poisoned",
        numberOfTurns: 3,
        appliedOnTurn: 2,
        saveThrowStat: "CON",
        saveThrowDc: 13,
      }),
    ).toBe("Poisoned pendant 3 tours (appliqué au tour 2), CON DD 13");
  });

  it("shows the applied turn of a state without duration", () => {
    expect(describeState({ id: "s4", name: "Prone", appliedOnTurn: 3 })).toBe(
      "Prone (appliqué au tour 3)",
    );
  });
});
