"use server";

import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import {
  BG3_WIKI_HOST,
  Bg3WikiError,
  Bg3WikiErrorEnum,
  buildCharacterFromWikitext,
  extractPageTitleFromUrl,
  getImageFileCandidates,
} from "./bg3-wiki.parser";

type WikiParseResponse = {
  parse?: { title: string; wikitext: string };
  error?: { code: string; info: string };
};

type WikiImageInfoResponse = {
  query?: {
    normalized?: { from: string; to: string }[];
    pages?: {
      title: string;
      missing?: boolean;
      imageinfo?: { url: string }[];
    }[];
  };
};

export type CreateCharacterFromWikiResult =
  | { character: CombatCharacter; error?: never }
  | { character?: never; error: Bg3WikiErrorEnum };

const callWikiApi = async <T>(params: Record<string, string>): Promise<T> => {
  const apiUrl = new URL(`https://${BG3_WIKI_HOST}/w/api.php`);
  apiUrl.search = new URLSearchParams({
    ...params,
    format: "json",
    formatversion: "2",
  }).toString();

  const response = await fetch(apiUrl, {
    headers: { "User-Agent": "kbj-la-meujie-combat-tracker" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Bg3WikiError(Bg3WikiErrorEnum.FETCH_FAILED);
  }
  return response.json();
};

/**
 * Returns the URL of the first image file that exists on the wiki.
 * A missing picture should never prevent the character from being created.
 */
const findImageUrl = async (
  fileNames: string[],
): Promise<string | undefined> => {
  if (!fileNames.length) {
    return undefined;
  }

  try {
    const data = await callWikiApi<WikiImageInfoResponse>({
      action: "query",
      titles: fileNames.join("|"),
      prop: "imageinfo",
      iiprop: "url",
    });

    // The API may rename titles ("File:Portrait_Kagha.png" -> "File:Portrait Kagha.png")
    const normalizedTitles = new Map(
      (data.query?.normalized ?? []).map(({ from, to }) => [from, to]),
    );
    const urlsByTitle = new Map(
      (data.query?.pages ?? [])
        .filter((page) => !page.missing && page.imageinfo?.[0]?.url)
        .map((page) => [page.title, page.imageinfo![0].url]),
    );

    return fileNames
      .map((name) => urlsByTitle.get(normalizedTitles.get(name) ?? name))
      .find(Boolean);
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

/**
 * Fetches the wikitext of the page behind a bg3.wiki URL.
 * Throws a Bg3WikiError when the URL, the page or the request is invalid.
 */
const fetchWikiPage = async (
  url: string,
): Promise<{ wikitext: string; title: string }> => {
  const pageTitle = extractPageTitleFromUrl(url);

  let data: WikiParseResponse;
  try {
    data = await callWikiApi<WikiParseResponse>({
      action: "parse",
      page: pageTitle,
      prop: "wikitext",
      redirects: "1",
    });
  } catch {
    throw new Bg3WikiError(Bg3WikiErrorEnum.FETCH_FAILED);
  }

  if (data.error || !data.parse) {
    throw new Bg3WikiError(
      data.error?.code === "missingtitle"
        ? Bg3WikiErrorEnum.PAGE_NOT_FOUND
        : Bg3WikiErrorEnum.FETCH_FAILED,
    );
  }

  return data.parse;
};

/**
 * Runs on the server: bg3.wiki doesn't allow cross-origin requests
 * from the browser.
 */
export const createCharacterFromWiki = async (
  url: string,
): Promise<CreateCharacterFromWikiResult> => {
  try {
    const { wikitext, title } = await fetchWikiPage(url);
    const imageUrl = await findImageUrl(getImageFileCandidates(wikitext));

    return {
      character: buildCharacterFromWikitext(
        wikitext,
        title,
        crypto.randomUUID(),
        imageUrl,
      ),
    };
  } catch (error) {
    if (error instanceof Bg3WikiError) {
      return { error: error.code };
    }
    console.error(error);
    return { error: Bg3WikiErrorEnum.FETCH_FAILED };
  }
};

/**
 * Portrait URL of the character behind a bg3.wiki URL, or undefined when the
 * page has none or can't be read: a missing picture is never an error.
 */
export const fetchPortraitFromWiki = async (
  url: string,
): Promise<string | undefined> => {
  try {
    const { wikitext } = await fetchWikiPage(url);
    return await findImageUrl(getImageFileCandidates(wikitext));
  } catch (error) {
    if (!(error instanceof Bg3WikiError)) {
      console.error(error);
    }
    return undefined;
  }
};
