import {
  isBg3WikiImage,
  isDisplayableImageUrl,
} from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.images";

const WIKI_IMAGE = "https://bg3.wiki/w/images/5/5d/Portrait_Kagha.png";

describe("isBg3WikiImage", () => {
  // Only the wiki's images are allowed through Next's image optimisation
  it("tells the wiki's images from the other ones", () => {
    expect(isBg3WikiImage(WIKI_IMAGE)).toBe(true);
    expect(isBg3WikiImage("https://example.com/kagha.png")).toBe(false);
    expect(isBg3WikiImage("https://bg3.wiki/wiki/Kagha")).toBe(false);
  });
});

describe("isDisplayableImageUrl", () => {
  it.each([
    ["an image file of the wiki", WIKI_IMAGE],
    ["an https image of another site", "https://example.com/kagha.png"],
    ["an http image of another site", "http://example.com/kagha.png"],
  ])("accepts %s", (_, url) => {
    expect(isDisplayableImageUrl(url)).toBe(true);
  });

  // Each would make a broken image request while the URL is being typed
  it.each([
    ["nothing", undefined],
    ["an empty URL", ""],
    ["text that isn't a URL", "Portrait_Kagha.png"],
    ["another protocol", "ftp://example.com/kagha.png"],
    ["the images folder of the wiki", "https://bg3.wiki/w/images/"],
    ["a wiki image path without file", "https://bg3.wiki/w/images/5/5d/"],
    [
      "a wiki file without extension",
      "https://bg3.wiki/w/images/5/5d/Portrait",
    ],
  ])("refuses %s", (_, url) => {
    expect(isDisplayableImageUrl(url)).toBe(false);
  });
});
