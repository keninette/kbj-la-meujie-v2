import { CombatPassive } from "@/app/_lib/types/combat-passive.type";
import { buildWikiLink, toWikiPageId } from "./bg3-wiki.parser";
import { definedOnly } from "./bg3-wiki-combat-actions.parser";
import { findBg3Passive } from "@/app/combat-tracker/_lib/bg3-passives";
import {
  getResistanceIconFile,
  getResistanceName,
  parseResistance,
} from "@/app/combat-tracker/_lib/bg3-resistances";

const RESISTANCES_PAGE = "Resistances";

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
