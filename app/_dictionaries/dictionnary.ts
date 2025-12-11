import "server-only";

const dictionaries = {
  fr: {
    layout: await import("./fr/layout.fr.json"),
  },
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = (locale: Locale) => {
  const localeToUse = locale in dictionaries ? locale : "fr";

  return dictionaries[localeToUse];
};
