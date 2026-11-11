import { hasTranslation, translate } from "@/app/_dictionaries/dictionnary";
import type { TextLanguage } from "@/app/_lib/types/text-language.type";
import type { Bg3Condition } from "./bg3-conditions";

/**
 * Name and description of a condition. In french, falls back on the original
 * english text when there's no translation yet.
 */
export const getConditionText = (
  condition: Bg3Condition,
  language: TextLanguage = "fr",
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
