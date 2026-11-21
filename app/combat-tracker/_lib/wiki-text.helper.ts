import { hasTranslation, translate } from "@/app/_dictionaries/dictionnary";
import type { TextLanguage } from "@/app/_lib/types/text-language.type";
import { CombatAction } from "@/app/_lib/types/combat-action.type";
import { toWikiPageId } from "./bg3-wiki/bg3-wiki.parser";

/** An action, as far as its texts are concerned */
type WikiItem = Pick<CombatAction, "name" | "description" | "wikiLink">;

/**
 * Key of an action in the "dndActions" dictionary, from its wiki page:
 * ".../wiki/Lay_on_Hands:_Greater_Healing" -> "lay-on-hands-greater-healing".
 * None for an action typed by hand.
 */
export const getWikiTextId = (item: WikiItem): string | undefined => {
  const page = item.wikiLink?.split("/wiki/")[1];
  return page ? toWikiPageId(decodeURIComponent(page)) : undefined;
};

/** Whether an action has a french name in the dictionary */
export const isWikiItemTranslated = (item: WikiItem): boolean => {
  const id = getWikiTextId(item);
  return !!id && hasTranslation(`${id}.name`, "dndActions");
};

/**
 * Name and description of an action. In french, falls back on the original
 * english text when it isn't translated.
 */
export const getWikiText = (
  item: WikiItem,
  language: TextLanguage = "fr",
): { name: string; description: string } => {
  const id = getWikiTextId(item);
  const getText = (field: "name" | "description"): string => {
    const key = `${id}.${field}`;
    if (language === "fr" && id && hasTranslation(key, "dndActions")) {
      return translate(key, "dndActions");
    }
    return item[field] ?? "";
  };

  return { name: getText("name"), description: getText("description") };
};
