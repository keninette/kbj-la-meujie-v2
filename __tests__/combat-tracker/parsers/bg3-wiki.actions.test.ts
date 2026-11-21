/**
 * @jest-environment node
 */
import {
  createCharacterFromWiki,
  createPassiveFromWiki,
} from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.actions";
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

  it("imports the passives from our list, even when the wiki can't give more", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            parse: {
              title: "Kagha",
              wikitext: "{{Infobox creature\n| passives = Darkvision\n}}",
            },
          }),
        ),
      )
      .mockRejectedValue(new TypeError("offline"));

    const { character } = await createCharacterFromWiki(KAGHA_URL);

    expect(character?.passives).toEqual([
      { name: "Darkvision", bg3PassiveId: "darkvision" },
    ]);
  });
});

describe("createPassiveFromWiki", () => {
  const answerPage = (title: string, wikitext: string) =>
    new Response(JSON.stringify({ parse: { title, wikitext } }));

  it("says when the page isn't a passive", async () => {
    answerWith({
      parse: { title: "Kagha", wikitext: "{{Infobox creature\n}}" },
    });

    expect(await createPassiveFromWiki("https://bg3.wiki/wiki/Kagha")).toEqual({
      error: Bg3WikiErrorEnum.NO_PASSIVE,
    });
  });

  it("adds the icon of a passive we don't know", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        answerPage(
          "Relentless Endurance",
          "{{Passive feature page\n| icon = Relentless Endurance Icon.webp\n}}",
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            query: {
              pages: [
                {
                  title: "File:Relentless Endurance Icon.webp",
                  imageinfo: [{ url: "https://bg3.wiki/w/images/icon.webp" }],
                },
              ],
            },
          }),
        ),
      );

    const { passive } = await createPassiveFromWiki(
      "https://bg3.wiki/wiki/Relentless_Endurance",
    );

    expect(passive?.iconUrl).toBe("https://bg3.wiki/w/images/icon.webp");
  });

  it("still imports the passive when its icon can't be found", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        answerPage(
          "Relentless Endurance",
          "{{Passive feature page\n| icon = Relentless Endurance Icon.webp\n}}",
        ),
      )
      .mockRejectedValue(new TypeError("offline"));

    expect(
      await createPassiveFromWiki("https://bg3.wiki/wiki/Relentless_Endurance"),
    ).toEqual({
      passive: {
        name: "Relentless Endurance",
        wikiLink: "https://bg3.wiki/wiki/Relentless_Endurance",
      },
    });
  });

  it("doesn't look for the icon of a passive of our list", async () => {
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        answerPage(
          "Fey Ancestry",
          "{{Passive feature page\n| icon = Fey Ancestry Icon.webp\n}}",
        ),
      );

    expect(
      await createPassiveFromWiki("https://bg3.wiki/wiki/Fey_Ancestry"),
    ).toEqual({
      passive: { name: "Fey Ancestry", bg3PassiveId: "fey-ancestry" },
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
