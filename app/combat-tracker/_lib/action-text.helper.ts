import { hasTranslation, translate } from "@/app/_dictionaries/dictionnary";
import type { CombatAction } from "@/app/_lib/types/combat-action.type";
import type { TextLanguage } from "@/app/_lib/types/text-language.type";

/**
 * Key of an action in the "dndActions" dictionary, from its wiki page:
 * ".../wiki/Lay_on_Hands:_Greater_Healing" -> "lay-on-hands-greater-healing".
 * None for an action typed by hand.
 */
export const getActionId = (action: CombatAction): string | undefined => {
  const page = action.wikiLink?.split("/wiki/")[1];
  return page
    ? decodeURIComponent(page)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    : undefined;
};

/** Whether an action has a french name in the "dndActions" dictionary */
export const isActionTranslated = (action: CombatAction): boolean => {
  const id = getActionId(action);
  return !!id && hasTranslation(`${id}.name`, "dndActions");
};

/**
 * Name and description of an action. In french, falls back on the original
 * english text when it isn't translated.
 */
export const getActionText = (
  action: CombatAction,
  language: TextLanguage = "fr",
): { name: string; description: string } => {
  const id = getActionId(action);
  const getText = (field: "name" | "description"): string => {
    const key = `${id}.${field}`;
    if (language === "fr" && id && hasTranslation(key, "dndActions")) {
      return translate(key, "dndActions");
    }
    return action[field] ?? "";
  };

  return { name: getText("name"), description: getText("description") };
};
