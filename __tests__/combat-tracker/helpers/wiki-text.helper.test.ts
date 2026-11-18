import {
  getWikiText,
  getWikiTextId,
} from "@/app/combat-tracker/_lib/wiki-text.helper";

// Only the Fire Bolt action is translated
jest.mock("../../../app/_dictionaries/dictionnary", () => ({
  translate: (key: string) => `fr:${key}`,
  hasTranslation: (key: string, namespace: string) =>
    namespace === "dndActions" && key.startsWith("fire-bolt."),
}));

const action = (wikiLink?: string) => ({
  name: "Fire Bolt",
  costs: ["action"],
  description: "Hurl a mote of fire.",
  wikiLink,
});

describe("getWikiTextId", () => {
  it.each([
    ["https://bg3.wiki/wiki/Fire_Bolt", "fire-bolt"],
    [
      "https://bg3.wiki/wiki/Lay_on_Hands:_Greater_Healing",
      "lay-on-hands-greater-healing",
    ],
    ["https://bg3.wiki/wiki/Hunter's_Mark", "hunter-s-mark"],
    ["https://bg3.wiki/wiki/Shield_(spell)", "shield-spell"],
  ])("keys %s as %s", (wikiLink, expected) => {
    expect(getWikiTextId(action(wikiLink))).toBe(expected);
  });

  it("has no key for an item typed by hand", () => {
    expect(getWikiTextId(action())).toBeUndefined();
  });
});

describe("getWikiText", () => {
  it("gives the french texts of a translated item", () => {
    expect(getWikiText(action("https://bg3.wiki/wiki/Fire_Bolt"))).toEqual({
      name: "fr:fire-bolt.name",
      description: "fr:fire-bolt.description",
    });
  });

  it.each([
    ["in english", action("https://bg3.wiki/wiki/Fire_Bolt"), "en"],
    ["not translated", action("https://bg3.wiki/wiki/Moonbeam"), "fr"],
    ["typed by hand", action(), "fr"],
  ] as const)("keeps the original texts %s", (_, value, language) => {
    expect(getWikiText(value, language)).toEqual({
      name: "Fire Bolt",
      description: "Hurl a mote of fire.",
    });
  });
});
