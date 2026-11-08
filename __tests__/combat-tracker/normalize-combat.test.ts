import {
  getFirstTurnPosition,
  getNextTurnPosition,
  getOngoingTurn,
  getPreviousTurnPosition,
  normalizeCombat,
} from "@/app/_lib/combat/combat.helper";
import { CombatStatusEnum } from "@/app/_lib/enums/combat-status.enum";
import {
  buildCharacter,
  buildCombat,
} from "../utils/combat-tracker.test.utils";

describe("normalizeCombat", () => {
  it("returns null when there is no combat", () => {
    expect(normalizeCombat(null)).toBeNull();
  });

  it("sorts characters by initiative, highest first", () => {
    const combat = buildCombat([
      buildCharacter({ id: "low", initiativeScore: 5 }),
      buildCharacter({ id: "high", initiativeScore: 20 }),
      buildCharacter({ id: "mid", initiativeScore: 12 }),
    ]);

    const ids = normalizeCombat(combat)!.characters.map((c) => c.id);

    expect(ids).toEqual(["high", "mid", "low"]);
  });

  it("keeps the same character selected when a higher initiative character is added", () => {
    const combat = {
      ...buildCombat([
        buildCharacter({ id: "a", initiativeScore: 15 }),
        buildCharacter({ id: "b", initiativeScore: 10 }),
      ]),
      selectedCharacterIndex: 1,
    };

    const normalized = normalizeCombat({
      ...combat,
      characters: [
        ...combat.characters,
        buildCharacter({ id: "new", initiativeScore: 30 }),
      ],
    })!;

    expect(normalized.characters.map((c) => c.id)).toEqual(["new", "a", "b"]);
    expect(normalized.characters[normalized.selectedCharacterIndex].id).toBe(
      "b",
    );
  });

  it("keeps the relative order of characters with equal initiative", () => {
    const combat = buildCombat([
      buildCharacter({ id: "first", initiativeScore: 10 }),
      buildCharacter({ id: "second", initiativeScore: 10 }),
    ]);

    const ids = normalizeCombat(combat)!.characters.map((c) => c.id);

    expect(ids).toEqual(["first", "second"]);
  });
});

describe("getOngoingTurn", () => {
  it("gives the turn only while the combat is ongoing", () => {
    expect(
      getOngoingTurn({ status: CombatStatusEnum.ONGOING, currentTurn: 3 }),
    ).toBe(3);
    expect(
      getOngoingTurn({ status: CombatStatusEnum.PREPARING, currentTurn: 1 }),
    ).toBeUndefined();
    expect(getOngoingTurn(null)).toBeUndefined();
  });
});

describe("turn order without the dead", () => {
  // Initiative order: alive, dead, alive, dead
  const characters = [
    buildCharacter({ id: "a" }),
    buildCharacter({ id: "dead-1", isDead: true }),
    buildCharacter({ id: "c" }),
    buildCharacter({ id: "dead-2", isDead: true }),
  ];
  const at = (selectedCharacterIndex: number, currentTurn: number) => ({
    characters,
    selectedCharacterIndex,
    currentTurn,
  });

  it("starts with the first character who can play", () => {
    const deadFirst = [characters[1], characters[0]];
    expect(getFirstTurnPosition(deadFirst)).toEqual({
      selectedCharacterIndex: 1,
      currentTurn: 1,
    });
  });

  it("skips the dead to the next one, and the next turn at the end", () => {
    expect(getNextTurnPosition(at(0, 1))).toEqual({
      selectedCharacterIndex: 2,
      currentTurn: 1,
    });
    expect(getNextTurnPosition(at(2, 1))).toEqual({
      selectedCharacterIndex: 0,
      currentTurn: 2,
    });
  });

  it("skips the dead to the previous one, and the previous turn at the top", () => {
    expect(getPreviousTurnPosition(at(2, 1))).toEqual({
      selectedCharacterIndex: 0,
      currentTurn: 1,
    });
    expect(getPreviousTurnPosition(at(0, 2))).toEqual({
      selectedCharacterIndex: 2,
      currentTurn: 1,
    });
  });

  it("has no previous one at the start of the combat", () => {
    expect(getPreviousTurnPosition(at(0, 1))).toBeNull();
  });

  it("stays put when everyone is dead", () => {
    const allDead = {
      characters: [characters[1], characters[3]],
      selectedCharacterIndex: 0,
      currentTurn: 2,
    };
    expect(getNextTurnPosition(allDead)).toBeNull();
    expect(getPreviousTurnPosition(allDead)).toBeNull();
  });
});
