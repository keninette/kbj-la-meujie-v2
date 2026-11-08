import {
  formatModifier,
  getAbilityModifier,
  getProficiencyBonus,
} from "@/app/combat-tracker/_lib/ability.helper";

describe("ability helper", () => {
  it("computes the modifier of a score", () => {
    expect(getAbilityModifier(10)).toBe(0);
    expect(getAbilityModifier(16)).toBe(3);
    expect(getAbilityModifier(9)).toBe(-1);
    expect(getAbilityModifier(1)).toBe(-5);
  });

  it("computes the proficiency bonus of a level", () => {
    expect(getProficiencyBonus(1)).toBe(2);
    expect(getProficiencyBonus(4)).toBe(2);
    expect(getProficiencyBonus(5)).toBe(3);
    expect(getProficiencyBonus(12)).toBe(4);
  });

  it("always writes the sign of a modifier", () => {
    expect(formatModifier(3)).toBe("+3");
    expect(formatModifier(0)).toBe("+0");
    expect(formatModifier(-1)).toBe("−1");
  });
});
