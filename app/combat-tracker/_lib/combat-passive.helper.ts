import { CombatPassive } from "@/app/_lib/types/combat-passive.type";

/**
 * A passive being typed in the passives fieldset. One of our list is added
 * as soon as it's picked: it never goes through a draft.
 */
export type PassiveDraft = {
  name: string;
  description: string;
  /** From a wiki import: kept even when the name or description is edited */
  iconUrl?: string;
  wikiLink?: string;
};

export const EMPTY_PASSIVE_DRAFT: PassiveDraft = { name: "", description: "" };

/** The draft filled by a passive imported from the wiki, to check before adding it */
export const draftFromPassive = (passive: CombatPassive): PassiveDraft => ({
  name: passive.name,
  description: passive.description ?? "",
  iconUrl: passive.iconUrl,
  wikiLink: passive.wikiLink,
});

/** The typed passive, trimmed. Null when it has no name. */
export const passiveFromDraft = (draft: PassiveDraft): CombatPassive | null => {
  const name = draft.name.trim();
  if (!name) {
    return null;
  }
  const description = draft.description.trim();

  return {
    name,
    ...(description ? { description } : {}),
    ...(draft.iconUrl ? { iconUrl: draft.iconUrl } : {}),
    ...(draft.wikiLink ? { wikiLink: draft.wikiLink } : {}),
  };
};

/**
 * What tells two passives apart: our id for one of our Baldur's Gate 3 list,
 * else its wiki page, else its name (case ignored).
 */
export const getPassiveKey = (passive: CombatPassive): string =>
  passive.bg3PassiveId ??
  passive.wikiLink ??
  `name:${passive.name.trim().toLowerCase()}`;

export const isSamePassive = (a: CombatPassive, b: CombatPassive): boolean =>
  getPassiveKey(a) === getPassiveKey(b);

/**
 * The list of passives added by hand or from the wiki, with this one: it
 * replaces the same one, if any. One of our list is already offered: it's
 * left out.
 */
export const addCustomPassive = (
  customPassives: CombatPassive[],
  passive: CombatPassive,
): CombatPassive[] =>
  passive.bg3PassiveId
    ? customPassives
    : [
        ...customPassives.filter((custom) => !isSamePassive(custom, passive)),
        passive,
      ];
