import {
  listUpdatedFields,
  mergeWikiCharacter,
  WIKI_IMPORTED_FIELDS,
} from "@/app/combat-tracker/_lib/bg3-wiki/merge-wiki-character";
import { buildCharacter } from "./_fixtures/combat-tracker.fixtures";

// What the wiki import returns for Kagha (see bg3-wiki.parser.test.ts)
const kagha = buildCharacter({
  id: "wiki-id",
  name: "Kagha",
  shortDescription: "Wood elf Druid level 5",
  imageUrl: "https://bg3.wiki/w/images/5/5d/Portrait_Kagha.png",
  wikiLink: "https://bg3.wiki/wiki/Kagha",
  hp: 84,
  maxHp: 84,
  ac: 14,
  isNpc: true,
  initiativeScore: 0,
  initiativeRoll: 0,
  spellSlotsLeft: { "1": 4, wldshp: 2 },
  passives: ["Darkvision"],
});

describe("mergeWikiCharacter", () => {
  it("keeps the 0 HP of a downed character when not overriding", () => {
    const current = buildCharacter({
      hp: 0,
      maxHp: 20,
      isDying: true,
      isDead: true,
    });

    const merged = mergeWikiCharacter(current, kagha, []);

    expect(merged).toMatchObject({
      hp: 0,
      maxHp: 20,
      isDying: true,
      isDead: true,
    });
  });

  it("imports the actions like the other lists", () => {
    const actions = [{ name: "Moonbeam", costs: ["action", "2"] }];
    const fetched = { ...kagha, actions };
    const handMade = [{ name: "Dodge", costs: [] }];

    expect(mergeWikiCharacter(buildCharacter(), fetched, []).actions).toEqual(
      actions,
    );
    expect(
      mergeWikiCharacter(buildCharacter({ actions: handMade }), fetched, [])
        .actions,
    ).toEqual(handMade);
    expect(
      mergeWikiCharacter(buildCharacter({ actions: handMade }), fetched, [
        "actions",
      ]).actions,
    ).toEqual(actions);
  });

  it("only fills empty fields when not overriding", () => {
    const current = buildCharacter({
      name: "My Kagha",
      hp: 0,
      maxHp: 0,
      ac: 16,
      passives: [],
    });

    const merged = mergeWikiCharacter(current, kagha, []);

    expect(merged).toMatchObject({
      name: "My Kagha",
      ac: 16,
      hp: 84,
      maxHp: 84,
      shortDescription: "Wood elf Druid level 5",
      imageUrl: "https://bg3.wiki/w/images/5/5d/Portrait_Kagha.png",
      wikiLink: "https://bg3.wiki/wiki/Kagha",
      spellSlotsLeft: { "1": 4, wldshp: 2 },
      passives: ["Darkvision"],
    });
  });

  it("replaces existing values when overriding", () => {
    const current = buildCharacter({
      name: "My Kagha",
      ac: 16,
      passives: ["Rage"],
    });

    const merged = mergeWikiCharacter(current, kagha, WIKI_IMPORTED_FIELDS);

    expect(merged).toMatchObject({
      name: "Kagha",
      ac: 14,
      hp: 84,
      passives: ["Darkvision"],
    });
  });

  it("only replaces the selected fields, and fills the other empty ones", () => {
    const current = buildCharacter({
      name: "My Kagha",
      ac: 16,
      hp: 20,
      maxHp: 20,
      shortDescription: undefined,
    });

    const merged = mergeWikiCharacter(current, kagha, ["name", "maxHp"]);

    expect(merged).toMatchObject({
      // selected: replaced
      name: "Kagha",
      maxHp: 84,
      // not selected and already filled: kept
      ac: 16,
      hp: 20,
      // not selected but empty: filled
      shortDescription: "Wood elf Druid level 5",
    });
  });

  it("keeps values the wiki does not provide, even when overriding", () => {
    const current = buildCharacter({
      shortDescription: "Custom description",
      passives: ["Rage"],
      imageUrl: "https://example.com/custom.png",
    });
    const sparse = buildCharacter({
      name: "Goblin",
      hp: 7,
      maxHp: 7,
      ac: 0, // no AC in the infobox
    });

    const merged = mergeWikiCharacter(current, sparse, WIKI_IMPORTED_FIELDS);

    expect(merged).toMatchObject({
      name: "Goblin",
      hp: 7,
      ac: current.ac,
      shortDescription: "Custom description",
      passives: ["Rage"],
      imageUrl: "https://example.com/custom.png",
    });
  });

  it("never touches combat state", () => {
    const current = buildCharacter({
      id: "my-id",
      isNpc: false,
      initiativeScore: 17,
      deathSaveThrowsLeft: 2,
      conditions: [{ id: "s1", name: "Poisoned" }],
    });

    const merged = mergeWikiCharacter(current, kagha, WIKI_IMPORTED_FIELDS);

    expect(merged).toMatchObject({
      id: "my-id",
      isNpc: false,
      initiativeScore: 17,
      deathSaveThrowsLeft: 2,
      conditions: [{ id: "s1", name: "Poisoned" }],
    });
  });

  it("brings a downed character back up when the HP are replaced", () => {
    const current = buildCharacter({ hp: 0, isDying: true, isDead: true });

    const merged = mergeWikiCharacter(current, kagha, WIKI_IMPORTED_FIELDS);

    expect(merged).toMatchObject({ hp: 84, isDying: false, isDead: false });
  });
});

describe("listUpdatedFields", () => {
  it("lists the imported fields whose value changed", () => {
    const before = buildCharacter({ name: "My Kagha", ac: 14, passives: [] });
    const after = mergeWikiCharacter(before, kagha, WIKI_IMPORTED_FIELDS);

    expect(listUpdatedFields(before, after)).toEqual([
      "name",
      "shortDescription",
      "imageUrl",
      "wikiLink",
      "hp",
      "maxHp",
      "spellSlotsLeft",
      "passives",
    ]);
  });

  it("returns nothing when the import changed nothing", () => {
    expect(
      listUpdatedFields(
        kagha,
        mergeWikiCharacter(kagha, kagha, WIKI_IMPORTED_FIELDS),
      ),
    ).toEqual([]);
  });
});
