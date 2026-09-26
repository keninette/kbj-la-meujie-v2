import {
  applyDamageToCharacter,
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
