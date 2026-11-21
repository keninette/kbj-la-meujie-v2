import { CombatPassive } from "@/app/_lib/types/combat-passive.type";
import { buildWikiLink, toWikiPageId } from "./bg3-wiki.parser";
import {
  cleanDescription,
  definedOnly,
} from "./bg3-wiki-combat-actions.parser";
import { findBg3Passive } from "@/app/combat-tracker/_lib/bg3-passives";
import {
  getResistanceIconFile,
  getResistanceName,
  parseResistance,
} from "@/app/combat-tracker/_lib/bg3-resistances";

const RESISTANCES_PAGE = "Resistances";

/** The template every passive page starts with */
export const PASSIVE_PAGE_TEMPLATE = "Passive feature page";

/**
 * The infobox's passives, in its order. A passive of our list (bg3-passives.ts)
 * gets its id, the others their wiki link. "Tenacity @ Maul" (a passive given
 * by an item) is the "Tenacity" page.
 */
export const buildPassives = (values: string[]): CombatPassive[] =>
  values.map((value) => {
    const page = value.split("@")[0].trim();
    const bg3Passive = findBg3Passive(toWikiPageId(page));
    return bg3Passive
      ? { name: bg3Passive.name, bg3PassiveId: bg3Passive.id }
      : { name: page, wikiLink: buildWikiLink(page) };
  });

/**
 * One passive per resistance of the infobox ("fire resistance nm"), linked to
 * the wiki's Resistances page. An unknown value keeps only its name.
 */
export const buildResistancePassives = (
  values: string[],
  iconUrls: Map<string, string> = new Map(),
): CombatPassive[] =>
  values.map((value) => {
    const resistance = parseResistance(value);
    if (!resistance) {
      return { name: value };
    }
    return definedOnly({
      name: getResistanceName(resistance),
      iconUrl: iconUrls.get(getResistanceIconFile(resistance)),
      wikiLink: buildWikiLink(RESISTANCES_PAGE),
    });
  });

/**
 * Renders the templates that passive descriptions use as words, which the
 * generic cleaning would drop or cut: "{{Advantage}}" -> "Advantage",
 * "{{SavingThrow}}s" -> "Saving Throws", "{{dist|m=3}}" -> "3 m",
 * "{{DamageText|1|Healing}}" -> "1 Healing".
 */
const renderDescriptionTemplates = (value: string): string =>
  value
    .replace(/\{\{\s*dist\s*\|\s*m\s*=\s*([^|}]+?)\s*\}\}/gi, "$1 m")
    .replace(
      /\{\{\s*DamageText\s*\|([^|}]+)\|([^|}]+)\}\}/gi,
      (_match, amount: string, type: string) =>
        `${amount.trim()} ${type.trim()}`,
    )
    .replace(/\{\{\s*([^|{}]+?)\s*\}\}/g, (_match, name: string) =>
      name.replace(/([a-z])([A-Z])/g, "$1 $2"),
    );

/**
 * The passive of a wiki page, from the fields of its {{Passive feature page}}.
 * A passive of our list only keeps its id: its texts, icon and link are in
 * bg3-passives.ts. Another one gets its description (or its brief, when it
 * has none) and its link; its icon is looked up by the server action.
 */
export const buildPassiveFromPage = (
  pageTitle: string,
  fields: Record<string, string>,
): CombatPassive => {
  const bg3Passive = findBg3Passive(toWikiPageId(pageTitle));
  if (bg3Passive) {
    return { name: bg3Passive.name, bg3PassiveId: bg3Passive.id };
  }

  const description = cleanDescription(
    renderDescriptionTemplates(fields.description ?? fields.brief ?? ""),
  );
  return definedOnly({
    name: pageTitle,
    description: description || undefined,
    wikiLink: buildWikiLink(pageTitle),
  });
};
