/*
 * For now we only need french
 * In case we need more, follow this doc
 * https://nextjs.org/docs/app/guides/internationalization
 */

const dictionaries = {
  fr: {
    layout: await import("./fr/layout.fr.json"),
    adventuresList: await import("./fr/adventures-list.fr.json"),
  },
};

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
  translation = dictionary[key as keyof typeof dictionary];

  for (const placeholder in placeholderValues) {
    translation = (translation as string).replaceAll(
      `{{${placeholder}}}`,
      placeholderValues[placeholder],
    );
  }

  return translation as string;
};
