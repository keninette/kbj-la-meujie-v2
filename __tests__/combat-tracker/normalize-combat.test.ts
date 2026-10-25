import { normalizeCombat } from "@/app/_lib/combat/combat.helper";
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
