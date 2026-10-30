import {
  applyDamageToCharacter,
  applyHealToCharacter,
  resetRevivedCharacter,
} from "@/app/combat-tracker/_components/attack-form/attack-form.helper";
import { buildCharacter } from "../utils/combat-tracker.test.utils";

describe("applyDamageToCharacter", () => {
  it("applies damage to temporary HP, alternative HP, then regular HP", () => {
    const character = buildCharacter({
      hp: 10,
      tempHp: 2,
      alternativeHp: 4,
    });

    expect(applyDamageToCharacter(character, 8)).toMatchObject({
      hp: 8,
      tempHp: undefined,
      alternativeHp: undefined,
    });
    expect(character).toMatchObject({
      hp: 10,
      tempHp: 2,
      alternativeHp: 4,
    });
  });

  it("kills a dying character when damage reaches them", () => {
    const character = buildCharacter({
      hp: 0,
      isDying: true,
      deathSaveThrowsLeft: 1,
    });

    expect(applyDamageToCharacter(character, 1)).toMatchObject({
      isDying: false,
      isDead: true,
      deathSaveThrowsLeft: 3,
    });
  });
});

describe("applyHealToCharacter", () => {
  it("adds HP without going past the maximum HP", () => {
    const character = buildCharacter({ hp: 4, maxHp: 10 });

    expect(applyHealToCharacter(character, 3).hp).toBe(7);
    expect(applyHealToCharacter(character, 20).hp).toBe(10);
    expect(character.hp).toBe(4);
  });

  it("brings a dying character back from 0 HP and resets their death saves", () => {
    const character = buildCharacter({
      hp: -3,
      isDying: true,
      deathSaveThrowsLeft: 1,
    });

    expect(applyHealToCharacter(character, 2)).toMatchObject({
      hp: 2,
      isDying: false,
      deathSaveThrowsLeft: 3,
    });
  });

  it("does not heal a dead character", () => {
    const character = buildCharacter({ hp: 0, isDead: true });

    expect(applyHealToCharacter(character, 5)).toBe(character);
  });

  it("never adds temporary HP", () => {
    const character = buildCharacter({ hp: 10, maxHp: 10, tempHp: 2 });

    expect(applyHealToCharacter(character, 5)).toMatchObject({
      hp: 10,
      tempHp: 2,
    });
  });

  it("heals alternative HP first and loses what goes past their maximum", () => {
    const character = buildCharacter({
      hp: 4,
      maxHp: 10,
      alternativeHp: 3,
      maxAlternativeHp: 8,
    });

    expect(applyHealToCharacter(character, 4)).toMatchObject({
      hp: 4,
      alternativeHp: 7,
    });
    expect(applyHealToCharacter(character, 20)).toMatchObject({
      hp: 4,
      alternativeHp: 8,
    });
  });

  it("uses the alternative HP value as maximum when none is set", () => {
    const character = buildCharacter({ hp: 10, alternativeHp: 6 });
    const damaged = applyDamageToCharacter(character, 4);

    expect(damaged).toMatchObject({ alternativeHp: 2, maxAlternativeHp: 6 });
    expect(applyHealToCharacter(damaged, 10).alternativeHp).toBe(6);
  });

  it("heals regular HP once alternative HP are gone", () => {
    const character = buildCharacter({ hp: 10, alternativeHp: 4 });
    const damaged = applyDamageToCharacter(character, 6);

    expect(damaged).toMatchObject({
      hp: 8,
      alternativeHp: undefined,
      maxAlternativeHp: undefined,
    });
    expect(applyHealToCharacter(damaged, 1).hp).toBe(9);
  });
});

describe("resetRevivedCharacter", () => {
  it("restores a revived character and clears temporary combat state", () => {
    const character = buildCharacter({
      hp: 0,
      alternativeHp: 4,
      tempHp: 2,
      isDying: true,
      isDead: false,
      deathSaveThrowsLeft: 1,
      states: [{ id: "state-1", name: "Restrained" }],
    });

    expect(resetRevivedCharacter(character)).toMatchObject({
      hp: 1,
      alternativeHp: 0,
      tempHp: 0,
      isDying: false,
      isDead: false,
      deathSaveThrowsLeft: 3,
      states: [],
    });
    expect(character.states).toHaveLength(1);
  });
});
