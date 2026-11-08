import { CombatCharacter } from "@/app/_lib/types/combat-character.type";

export type HpLevel = "low" | "medium" | "high";

/** Hit points left, in % of the max (0 when the max is unknown) */
export const getHpPercent = ({
  hp,
  maxHp,
}: Pick<CombatCharacter, "hp" | "maxHp">): number =>
  maxHp > 0 ? (hp / maxHp) * 100 : 0;

/** Color of the hit points: under 25 % low, over 75 % high */
export const getHpLevel = (hpPercent: number): HpLevel => {
  if (hpPercent > 75) {
    return "high";
  }
  return hpPercent >= 25 ? "medium" : "low";
};
