import { DamageTypeEnum } from "@/app/_lib/enums/damage-type.enum";
import {
  loadCombat,
  saveCombat,
} from "@/app/combat-tracker/_lib/local-storage";
import { CombatCharacter } from "@lib/types/combat-character.type";
import { NpcAttitudeEnum } from "@/app/_lib/enums/npc-attitude.enum";
import {
  buildCharacter,
  buildCombat,
} from "./_fixtures/combat-tracker.fixtures";

describe("loadCombat", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("returns null when nothing is stored", () => {
    expect(loadCombat()).toBeNull();
  });

  it("round-trips a valid combat through saveCombat/loadCombat", () => {
    const combat = buildCombat([
      buildCharacter({
        passives: ["Rage", "Vision dans le noir"],
        usableObjects: ["Potion de soin"],
      }),
    ]);

    saveCombat(combat);

    expect(loadCombat()).toEqual(combat);
  });

  it("uses the initiative as roll for characters saved without roll", () => {
    // As saved before the roll existed
    const withoutRoll = {
      ...buildCharacter({ initiativeScore: 17 }),
      initiativeRoll: undefined,
    } as unknown as CombatCharacter;
    saveCombat(buildCombat([withoutRoll]));

    expect(loadCombat()?.characters[0]).toMatchObject({
      initiativeScore: 17,
      initiativeRoll: 17,
    });
  });

  it("round-trips the actions", () => {
    const combat = buildCombat([
      buildCharacter({
        actions: [
          {
            name: "Moonbeam",
            type: "spell",
            costs: ["action", "2"],
            spellLevel: 2,
            damages: [{ dice: "2d10", type: DamageTypeEnum.RADIANT }],
            save: "CON",
            isConcentration: true,
            description: "Call down a beam of light.",
            iconUrl: "https://bg3.wiki/w/images/a/ab/Moonbeam.webp",
            wikiLink: "https://bg3.wiki/wiki/Moonbeam",
          },
          { name: "Dodge", costs: [] },
        ],
      }),
    ]);

    saveCombat(combat);

    expect(loadCombat()).toEqual(combat);
  });

  it("round-trips the short description, picture and wiki link", () => {
    const combat = buildCombat([
      buildCharacter({
        shortDescription: "Wood elf Druid level 5",
        imageUrl: "https://bg3.wiki/w/images/5/5d/Portrait_Kagha.png",
        wikiLink: "https://bg3.wiki/wiki/Kagha",
      }),
    ]);

    saveCombat(combat);

    expect(loadCombat()).toEqual(combat);
  });

  it("round-trips idle characters", () => {
    const combat = {
      ...buildCombat([buildCharacter()]),
      idleCharacters: [buildCharacter({ id: "idle-1" })],
    };

    saveCombat(combat);

    expect(loadCombat()).toEqual(combat);
  });

  const withCharacter = (invalid: Record<string, unknown>) =>
    buildCombat([buildCharacter(invalid as Partial<CombatCharacter>)]);

  it.each([
    ["an unknown status", { status: "unknown-status" }],
    [
      "idle characters that are not an array",
      { ...buildCombat([buildCharacter()]), idleCharacters: "not-an-array" },
    ],
    ["a movement that is not a number", withCharacter({ movement: "9" })],
    [
      "an ability that is not a number",
      withCharacter({ abilities: { dex: "16" } }),
    ],
    [
      "a saving throw that is not a number",
      withCharacter({ savingThrows: { wis: "6" } }),
    ],
    [
      "usable objects that are not strings",
      withCharacter({ usableObjects: [42] }),
    ],
    ["passives that are not strings", withCharacter({ passives: [42] })],
    [
      "an action whose costs are not an array",
      withCharacter({ actions: [{ name: "Moonbeam", costs: "action" }] }),
    ],
    [
      "an action with a damage without dice",
      withCharacter({
        actions: [{ name: "Moonbeam", costs: [], damages: [{}] }],
      }),
    ],
    [
      "an action with an unknown damage type",
      withCharacter({
        actions: [
          {
            name: "Moonbeam",
            costs: [],
            damages: [{ dice: "2d10", type: "Radiant" }],
          },
        ],
      }),
    ],
    ["an action without name", withCharacter({ actions: [{ costs: [] }] })],
  ])("returns null when the stored data has %s", (_, stored) => {
    localStorage.setItem("scratchie-combat-tracker", JSON.stringify(stored));

    expect(loadCombat()).toBeNull();
  });

  it("keeps the NPC attitude, and refuses an unknown one", () => {
    const combat = buildCombat([
      buildCharacter({ isNpc: true, attitude: NpcAttitudeEnum.ENEMY }),
    ]);
    saveCombat(combat);
    expect(loadCombat()?.characters[0].attitude).toBe(NpcAttitudeEnum.ENEMY);

    localStorage.setItem(
      "scratchie-combat-tracker",
      JSON.stringify(
        buildCombat([
          buildCharacter({
            attitude: "grumpy" as unknown as NpcAttitudeEnum,
          }),
        ]),
      ),
    );
    expect(loadCombat()).toBeNull();
  });

  it("returns null when the stored payload is not valid JSON", () => {
    localStorage.setItem("scratchie-combat-tracker", "not-json");

    expect(loadCombat()).toBeNull();
  });

  it("keeps a backup of unreadable stored data", () => {
    localStorage.setItem("scratchie-combat-tracker", "not-json");

    loadCombat();

    expect(localStorage.getItem("scratchie-combat-tracker-backup")).toBe(
      "not-json",
    );
  });
});
