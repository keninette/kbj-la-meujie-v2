import { BG3_CONDITIONS } from "../../../app/combat-tracker/_lib/bg3-conditions";
import { getConditionText } from "../../../app/combat-tracker/_lib/condition-text.helper";

const frenchConditions: Record<string, string> = {
  "blinded.name": "Aveuglé",
};

jest.mock("../../../app/_dictionaries/dictionnary", () => ({
  translate: (key: string) => frenchConditions[key],
  hasTranslation: (key: string) => key in frenchConditions,
}));

const blinded = BG3_CONDITIONS.find(({ id }) => id === "blinded")!;

describe("getConditionText", () => {
  it("uses the french translation when there is one", () => {
    expect(getConditionText(blinded).name).toBe("Aveuglé");
  });

  it("falls back on the english text when there is no french translation", () => {
    expect(getConditionText(blinded).description).toBe(blinded.description);
  });

  it("uses the english text when asked, even with a french translation", () => {
    expect(getConditionText(blinded, "en")).toEqual({
      name: blinded.name,
      description: blinded.description,
    });
  });
});
