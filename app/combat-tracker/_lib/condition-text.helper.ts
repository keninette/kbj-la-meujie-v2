import { hasTranslation, translate } from "@/app/_dictionaries/dictionnary";
import { BG3_CONDITIONS } from "./bg3-conditions";

type Bg3Condition = (typeof BG3_CONDITIONS)[number];

export type ConditionLanguage = "fr" | "en";

/**
 * Name and description of a condition. In french, falls back on the original
 * english text when there's no translation yet.
 */
export const getConditionText = (
  condition: Bg3Condition,
  language: ConditionLanguage = "fr",
): { name: string; description: string } => {
  const getText = (field: "name" | "description"): string => {
    const key = `${condition.id}.${field}`;
    if (language === "fr" && hasTranslation(key, "dndConditions")) {
      return translate(key, "dndConditions");
    }
    return condition[field];
  };

  return { name: getText("name"), description: getText("description") };
};
