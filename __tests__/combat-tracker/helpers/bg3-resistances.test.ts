import {
  findResistanceByName,
  getResistanceIconFile,
  getResistanceName,
  parseResistance,
  Resistance,
} from "@/app/combat-tracker/_lib/bg3-resistances";

const parse = (value: string): Resistance => {
  const resistance = parseResistance(value);
  if (!resistance) {
    throw new Error(`${value} not parsed`);
  }
  return resistance;
};

describe("parseResistance", () => {
  // The most used values of the wiki, and their spelling variants
  it.each([
    ["poison immunity", "Immune to all Poison", "File:Poison Immunity.png"],
    [
      "poison resistant full",
      "Resistant to all Poison",
      "File:Poison Resistance Full.png",
    ],
    [
      "poison full",
      "Resistant to all Poison",
      "File:Poison Resistance Full.png",
    ],
    [
      "slashing resistant nm",
      "Resistant to Non-Magical Slashing",
      "File:Slashing Resistance NM.png",
    ],
    [
      "fire resistance nm",
      "Resistant to Non-Magical Fire",
      "File:Fire Resistance NM.png",
    ],
    ["fire magical", "Resistant to Magical Fire", "File:Fire Resistance M.png"],
    [
      "bludgeoning vulnerability",
      "Vulnerable to Bludgeoning",
      "File:Bludgeoning Vulnerability.png",
    ],
    [
      "piercing immunity nm",
      "Immune to Non-Magical Piercing",
      "File:Piercing Immunity NM.png",
    ],
    [
      "Slashing  Immune NM Plus",
      "Immune to Non-Magical and Resistant to Magical Slashing",
      "File:Slashing Immunity NM Plus.png",
    ],
  ])("reads %s as %s", (value, name, iconFile) => {
    const resistance = parse(value);
    expect(getResistanceName(resistance)).toBe(name);
    expect(getResistanceIconFile(resistance)).toBe(iconFile);
  });

  it.each(["1", "fire", "fire resilient", "magic immunity"])(
    "ignores the unknown value %s",
    (value) => {
      expect(parseResistance(value)).toBeUndefined();
    },
  );
});

describe("findResistanceByName", () => {
  it("finds the resistance a passive is named after", () => {
    expect(findResistanceByName("Resistant to Non-Magical Fire")).toEqual(
      parse("fire resistance nm"),
    );
  });

  it("finds nothing for another passive", () => {
    expect(findResistanceByName("Darkvision")).toBeUndefined();
  });
});
