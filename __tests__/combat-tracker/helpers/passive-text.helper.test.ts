import { findBg3Passive } from "@/app/combat-tracker/_lib/bg3-passives";
import { getPassiveText } from "@/app/combat-tracker/_lib/passive-text.helper";

// Only Darkvision's name is translated
jest.mock("../../../app/_dictionaries/dictionnary", () => ({
  translate: (key: string, _: string, values?: { type: string }) =>
    values ? `fr:${key}(${values.type})` : `fr:${key}`,
  hasTranslation: (key: string, namespace: string) =>
    namespace === "dndPassives" && key === "darkvision.name",
}));

const darkvision = findBg3Passive("darkvision")!;

describe("getPassiveText", () => {
  it("takes the texts of our passive, in french when translated", () => {
    expect(
      getPassiveText({ name: "Darkvision", bg3PassiveId: "darkvision" }),
    ).toEqual({
      name: "fr:darkvision.name",
      description: darkvision.description,
    });
  });

  it("keeps the passive's own description over ours", () => {
    expect(
      getPassiveText(
        {
          name: "Darkvision",
          bg3PassiveId: "darkvision",
          description: "Typed by hand.",
        },
        "en",
      ),
    ).toEqual({ name: "Darkvision", description: "Typed by hand." });
  });

  it.each([
    ["in english", { name: "Darkvision", bg3PassiveId: "darkvision" }, "en"],
    ["not in our list", { name: "Darkvision", description: "Sees." }, "fr"],
  ] as const)("keeps the original name %s", (_, passive, language) => {
    expect(getPassiveText(passive, language).name).toBe("Darkvision");
  });

  it("builds the french name of a resistance from its kind and damage type", () => {
    expect(getPassiveText({ name: "Resistant to Non-Magical Fire" })).toEqual({
      name: "fr:resistance.resistantNm(fr:damageType.fire)",
      description: "",
    });
  });
});
