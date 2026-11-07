// Shared by next.config.ts and the app: keep relative imports only here.

export const BG3_WIKI_HOST = "bg3.wiki";
const BG3_WIKI_IMAGES_PATH = "/w/images/";

/** Character pictures fetched from the BG3 wiki, allowed in next.config.ts */
export const BG3_WIKI_IMAGE_PATTERN = {
  protocol: "https",
  hostname: BG3_WIKI_HOST,
  pathname: `${BG3_WIKI_IMAGES_PATH}**`,
} as const;

/**
 * Images hosted by the wiki can go through Next's image optimisation
 * (allowed by BG3_WIKI_IMAGE_PATTERN). Any other URL typed by hand can't.
 */
export const isBg3WikiImage = (url: string): boolean =>
  url.startsWith(`https://${BG3_WIKI_HOST}${BG3_WIKI_IMAGES_PATH}`);

/**
 * Whether a typed picture URL can be displayed yet: an absolute http(s) URL,
 * and for the wiki an actual file ("https://bg3.wiki/w/images/" while
 * typing would make a broken optimised request).
 */
export const isDisplayableImageUrl = (
  url: string | undefined,
): url is string => {
  if (!url) {
    return false;
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return false;
  }
  return (
    !isBg3WikiImage(url) ||
    /^\/w\/images\/.+\.[a-z0-9]+$/i.test(parsed.pathname)
  );
};
