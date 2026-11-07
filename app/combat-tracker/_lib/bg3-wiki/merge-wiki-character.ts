import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { WikiCharacter } from "./bg3-wiki.parser";

/**
 * Fields the wiki can provide. Combat state (initiative, states, death saves,
 * NPC flag...) is never touched by an import.
 */
export const WIKI_IMPORTED_FIELDS = [
  "name",
  "shortDescription",
  "imageUrl",
  "wikiLink",
  "hp",
  "maxHp",
  "ac",
  "spellSlotsLeft",
  "passives",
] as const satisfies readonly (keyof CombatCharacter)[];

export type WikiImportedField = (typeof WIKI_IMPORTED_FIELDS)[number];

/** Translation keys of the form labels, to name the fields in the UI */
export const WIKI_FIELD_LABEL_KEYS: Record<WikiImportedField, string> = {
  name: "form.name",
  shortDescription: "form.shortDescription",
  imageUrl: "form.imageUrl",
  wikiLink: "form.wikiLink",
  hp: "form.hp",
  maxHp: "form.maxHp",
  ac: "form.ac",
  spellSlotsLeft: "form.spellSlots",
  passives: "form.passives",
};

/** Imported fields whose value differs between the two characters */
export const listUpdatedFields = (
  before: CombatCharacter,
  after: CombatCharacter,
): WikiImportedField[] =>
  WIKI_IMPORTED_FIELDS.filter(
    (field) => JSON.stringify(before[field]) !== JSON.stringify(after[field]),
  );

/**
 * "Nothing there": undefined, "", 0, [] or {}.
 * A 0 from the wiki means the infobox had no value (e.g. no AC listed).
 */
const isEmpty = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  value === "" ||
  value === 0 ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value as object).length === 0);

/**
 * Applies the wiki data to the character being edited.
 * - Only fields the wiki actually provides are used.
 * - Fields in `overrideFields`: existing values are replaced.
 * - Other fields: only filled when empty.
 */
export const mergeWikiCharacter = (
  current: CombatCharacter,
  fetched: WikiCharacter,
  overrideFields: readonly WikiImportedField[],
): CombatCharacter => {
  const merged: Record<string, unknown> = { ...current };

  // 0 HP is a real value for a downed character (it has max HP), not an
  // empty field: filling it would bring the character back to life.
  const isCurrentEmpty = (field: WikiImportedField) =>
    field === "hp"
      ? isEmpty(current.hp) && isEmpty(current.maxHp)
      : isEmpty(current[field]);

  for (const field of WIKI_IMPORTED_FIELDS) {
    const value = fetched[field];
    const override = overrideFields.includes(field);
    if (isEmpty(value) || (!override && !isCurrentEmpty(field))) {
      continue;
    }
    merged[field] = value;
  }

  const result = merged as CombatCharacter;

  // Same rule as typing a new HP value in the form
  if (result.hp !== current.hp) {
    result.isDying = result.hp <= 0;
    result.isDead = result.hp <= 0 && current.isDead;
  }

  return result;
};
