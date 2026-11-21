import { hasTranslation, translate } from "@/app/_dictionaries/dictionnary";
import type { TextLanguage } from "@/app/_lib/types/text-language.type";
import { CombatPassive } from "@/app/_lib/types/combat-passive.type";
import { findBg3Passive } from "./bg3-passives";
import { findResistanceByName } from "./bg3-resistances";

/**
 * French name of a resistance passive, built from its kind and damage type:
 * "Resistant to Non-Magical Fire" -> "Résistance : Feu (non magique)".
 * Undefined for another passive.
 */
const translateResistance = (name: string): string | undefined => {
  const resistance = findResistanceByName(name);
  return (
    resistance &&
    translate(`resistance.${resistance.kind.id}`, "combatTracker", {
      type: translate(`damageType.${resistance.type}`, "combatTracker"),
    })
  );
};

/**
 * Name and description of a passive: its own, else the ones of our
 * Baldur's Gate 3 passive. In french, the dictionary's when translated.
 */
export const getPassiveText = (
  passive: CombatPassive,
  language: TextLanguage = "fr",
): { name: string; description: string } => {
  const bg3Passive = findBg3Passive(passive.bg3PassiveId);
  const english = {
    name: passive.name,
    description: passive.description ?? bg3Passive?.description ?? "",
  };
  if (language === "en") {
    return english;
  }

  const getFrench = (field: "name" | "description"): string => {
    const key = `${bg3Passive?.id}.${field}`;
    return bg3Passive && hasTranslation(key, "dndPassives")
      ? translate(key, "dndPassives")
      : english[field];
  };
  return {
    name: translateResistance(passive.name) ?? getFrench("name"),
    description: getFrench("description"),
  };
};
