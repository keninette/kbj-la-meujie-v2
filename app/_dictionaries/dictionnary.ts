/*
 * For now we only need french
 * In case we need more, follow this doc
 * https://nextjs.org/docs/app/guides/internationalization
 */

const dictionaries = {
  fr: {
    layout: await import("./fr/layout.fr.json"),
    adventuresList: await import("./fr/adventures-list.fr.json"),
    editAdventure: await import("./fr/edit-adventure.fr.json"),
    combatTracker: await import("./fr/combat-tracker.fr.json"),
    dndConditions: await import("./fr/dnd-conditions.fr.json"),
  },
};

const pluralRules = new Intl.PluralRules("fr");

/**
 * With a `count` placeholder, uses "key.one" or "key.other" when they exist,
 * following the french rules (0 and 1 are singular)
 */
export const translate = (
  key: string,
  namespace: string,
  placeholderValues?: { [key: string]: string },
): string => {
  let translation;
  if (!(namespace in dictionaries.fr)) {
    console.error(`${namespace} key missing in dictionaries.fr`);
  }
  const dictionary = dictionaries.fr[namespace as keyof typeof dictionaries.fr];

  const count = placeholderValues?.count;
  if (count !== undefined) {
    const pluralKey = `${key}.${pluralRules.select(Number(count)) === "one" ? "one" : "other"}`;
    if (pluralKey in dictionary) {
      key = pluralKey;
    }
  }
  translation = dictionary[key as keyof typeof dictionary];

  for (const placeholder in placeholderValues) {
    translation = (translation as string).replaceAll(
      `{{${placeholder}}}`,
      placeholderValues[placeholder],
    );
  }

  return translation as string;
};

/**
 * Whether a key is translated, to fall back on another text when it isn't
 */
export const hasTranslation = (key: string, namespace: string): boolean => {
  const dictionary = dictionaries.fr[namespace as keyof typeof dictionaries.fr];
  return dictionary !== undefined && key in dictionary;
};
