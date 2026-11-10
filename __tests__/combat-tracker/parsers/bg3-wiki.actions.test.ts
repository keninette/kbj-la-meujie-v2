/**
 * @jest-environment node
 */
import { createCharacterFromWiki } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.actions";
import { Bg3WikiErrorEnum } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.parser";

// What the user is told when an import fails: the parsing itself is tested
// in the parser tests

const KAGHA_URL = "https://bg3.wiki/wiki/Kagha";

const answerWith = (body: unknown, status = 200) =>
  jest
    .spyOn(global, "fetch")
    .mockResolvedValue(new Response(JSON.stringify(body), { status }));

afterEach(() => {
  jest.restoreAllMocks();
});

describe("createCharacterFromWiki errors", () => {
  it("refuses a URL that isn't a wiki page, without calling the wiki", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");

    expect(await createCharacterFromWiki("https://example.com/Kagha")).toEqual({
      error: Bg3WikiErrorEnum.INVALID_URL,
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("says when the page doesn't exist", async () => {
    answerWith({ error: { code: "missingtitle", info: "No such page" } });

    expect(await createCharacterFromWiki(KAGHA_URL)).toEqual({
      error: Bg3WikiErrorEnum.PAGE_NOT_FOUND,
    });
  });

  it("says when the page has no creature infobox", async () => {
    answerWith({ parse: { title: "Kagha", wikitext: "Kagha is a druid." } });

    expect(await createCharacterFromWiki(KAGHA_URL)).toEqual({
      error: Bg3WikiErrorEnum.NO_INFOBOX,
    });
  });

  it.each([
    ["the wiki answers with an error", () => answerWith({}, 500)],
    [
      "the request fails",
      () =>
        jest.spyOn(global, "fetch").mockRejectedValue(new TypeError("offline")),
    ],
  ])("says the import failed when %s", async (_, mockFetch) => {
    mockFetch();

    expect(await createCharacterFromWiki(KAGHA_URL)).toEqual({
      error: Bg3WikiErrorEnum.FETCH_FAILED,
    });
  });
});
