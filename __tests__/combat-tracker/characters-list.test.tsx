import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import CombatTrackerPage from "@/app/combat-tracker/page";
import { saveCombat } from "@/app/combat-tracker/_lib/local-storage";
import { CombatStatusEnum } from "@/app/_lib/enums/combat-status.enum";
import { NpcAttitudeEnum } from "@/app/_lib/enums/npc-attitude.enum";
import {
  buildCharacter,
  buildCombat,
} from "../utils/combat-tracker.test.utils";

// dictionnary.ts uses top-level await, unsupported by Jest's CJS environment.
// Keeps the values, e.g. "stats.hpSummary(stats.hp, 27, 31)"
jest.mock("../../app/_dictionaries/dictionnary", () => ({
  translate: (
    key: string,
    _namespace: string,
    values?: Record<string, string>,
  ) => (values ? `${key}(${Object.values(values).join(", ")})` : key),
}));

const aragorn = buildCharacter({ id: "aragorn", initiativeScore: 15 });
const legolas = buildCharacter({
  id: "legolas",
  name: "Legolas",
  initiativeScore: 10,
});

const renderPageWithCharacters = async () => {
  saveCombat(buildCombat([aragorn, legolas]));
  const view = render(<CombatTrackerPage />);
  await screen.findByTestId("character-item-aragorn");
  return view;
};

// The actions of a character are in its kebab menu
const openMenu = (characterId: string) =>
  fireEvent.click(screen.getByTestId(`character-menu-${characterId}`));
const clickMenuItem = (characterId: string, itemTestId: string) => {
  openMenu(characterId);
  fireEvent.click(screen.getByTestId(itemTestId));
};

const activeList = () => screen.getByTestId("active-characters-list");
const idleList = () => screen.queryByTestId("idle-characters-list");

describe("CharacterList active and idle characters", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("displays all active characters and no idle list", async () => {
    await renderPageWithCharacters();

    expect(
      within(activeList()).getByTestId("character-item-aragorn"),
    ).toBeInTheDocument();
    expect(
      within(activeList()).getByTestId("character-item-legolas"),
    ).toBeInTheDocument();
    expect(idleList()).not.toBeInTheDocument();
  });

  it("moves a character from the active list to the idle list when deactivated", async () => {
    await renderPageWithCharacters();

    clickMenuItem("legolas", "deactivate-character-legolas");

    expect(
      within(activeList()).queryByTestId("character-item-legolas"),
    ).not.toBeInTheDocument();
    expect(
      within(screen.getByTestId("idle-characters-list")).getByTestId(
        "character-item-legolas",
      ),
    ).toBeInTheDocument();
    expect(
      within(activeList()).getByTestId("character-item-aragorn"),
    ).toBeInTheDocument();
  });

  it("shows the initial of an inactive character without picture", async () => {
    await renderPageWithCharacters();

    clickMenuItem("legolas", "deactivate-character-legolas");

    expect(
      within(screen.getByTestId("idle-characters-list")).getByText("L"),
    ).toBeInTheDocument();
    expect(within(activeList()).getByText("A")).toBeInTheDocument();
  });

  it("moves a character back to the active list when reactivated", async () => {
    await renderPageWithCharacters();
    clickMenuItem("legolas", "deactivate-character-legolas");

    clickMenuItem("legolas", "reactivate-character-legolas");

    expect(
      within(activeList()).getByTestId("character-item-legolas"),
    ).toBeInTheDocument();
    expect(idleList()).not.toBeInTheDocument();
  });

  it("selects the next active character when the selected one is deactivated", async () => {
    await renderPageWithCharacters();
    expect(screen.getByTestId("character-item-aragorn")).toHaveClass(
      "characters-list__card--current",
    );

    clickMenuItem("aragorn", "deactivate-character-aragorn");

    expect(screen.getByTestId("character-item-legolas")).toHaveClass(
      "characters-list__card--current",
    );
  });

  it("drops idle NPCs but keeps idle players when stopping combat and keeping players", async () => {
    saveCombat({
      ...buildCombat([aragorn]),
      status: CombatStatusEnum.ONGOING,
      idleCharacters: [
        buildCharacter({ id: "gandalf", name: "Gandalf", isNpc: false }),
        buildCharacter({ id: "orc", name: "Orc", isNpc: true }),
      ],
    });
    render(<CombatTrackerPage />);
    fireEvent.click(await screen.findByTestId("stop-combat"));

    fireEvent.click(await screen.findByTestId("stop-combat-keep-players"));

    const remainingIdleList = screen.getByTestId("idle-characters-list");
    expect(
      within(remainingIdleList).getByTestId("character-item-gandalf"),
    ).toBeInTheDocument();
    expect(
      within(remainingIdleList).queryByTestId("character-item-orc"),
    ).not.toBeInTheDocument();
  });

  it("puts a reactivated character at its initiative position", async () => {
    saveCombat({
      ...buildCombat([legolas]),
      idleCharacters: [aragorn],
    });
    render(<CombatTrackerPage />);

    await screen.findByTestId("character-menu-aragorn");
    clickMenuItem("aragorn", "reactivate-character-aragorn");

    const ids = within(activeList())
      .getAllByTestId(/^character-item-/)
      .map((item) => item.getAttribute("data-testid"));
    expect(ids).toEqual(["character-item-aragorn", "character-item-legolas"]);
  });

  it("keeps a deactivated character idle after a page reload", async () => {
    const { unmount } = await renderPageWithCharacters();
    clickMenuItem("legolas", "deactivate-character-legolas");
    unmount();

    render(<CombatTrackerPage />);

    expect(
      await within(
        await screen.findByTestId("idle-characters-list"),
      ).findByTestId("character-item-legolas"),
    ).toBeInTheDocument();
  });
});

describe("CharacterList wiki link", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("links to the wiki page of a character, in a new tab", async () => {
    saveCombat(
      buildCombat([
        buildCharacter({
          id: "kagha",
          name: "Kagha",
          wikiLink: "https://bg3.wiki/wiki/Kagha",
        }),
      ]),
    );
    render(<CombatTrackerPage />);

    await screen.findByTestId("character-menu-kagha");
    openMenu("kagha");
    const link = screen.getByTestId("wiki-link-kagha");
    expect(link).toHaveAttribute("href", "https://bg3.wiki/wiki/Kagha");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent("list.wiki");
  });

  it("does not display the wiki link when the character has none", async () => {
    await renderPageWithCharacters();
    openMenu("aragorn");

    expect(screen.queryByTestId("wiki-link-aragorn")).not.toBeInTheDocument();
  });
});

describe("Combat turn box", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("shows the turn and whose turn it is, and follows the next player", async () => {
    saveCombat({
      ...buildCombat([aragorn, legolas]),
      status: CombatStatusEnum.ONGOING,
      currentTurn: 2,
    });
    render(<CombatTrackerPage />);

    const turnBox = await screen.findByTestId("combat-turn");
    expect(turnBox).toHaveTextContent("manager.turn");
    expect(within(turnBox).getByText(aragorn.name)).toBeInTheDocument();

    fireEvent.click(within(turnBox).getByText("manager.nextPlayer"));

    expect(
      within(screen.getByTestId("combat-turn")).getByText("Legolas"),
    ).toBeInTheDocument();
  });
});

describe("CharacterList active character cards", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("shows the initiative, the hit points and the wiki link", async () => {
    saveCombat(
      buildCombat([
        buildCharacter({
          id: "aragorn",
          initiativeScore: 15,
          hp: 27,
          maxHp: 31,
          wikiLink: "https://bg3.wiki/wiki/Aragorn",
        }),
      ]),
    );
    render(<CombatTrackerPage />);

    const card = await screen.findByTestId("character-item-aragorn");
    expect(within(card).getByText("15")).toBeInTheDocument();
    expect(
      within(card).getByRole("group", {
        name: "stats.hpSummary(stats.hp, 27, 31)",
      }),
    ).toBeInTheDocument();
    // The menu is drawn over the page, outside of the card
    openMenu("aragorn");
    expect(screen.getByTestId("wiki-link-aragorn")).toBeInTheDocument();
    expect(screen.getByTestId("edit-character-aragorn")).toBeInTheDocument();
    expect(
      screen.getByTestId("deactivate-character-aragorn"),
    ).toBeInTheDocument();
  });

  it("shows the alternative hit points first, with the temporary ones", async () => {
    saveCombat(
      buildCombat([
        buildCharacter({
          id: "aragorn",
          hp: 27,
          maxHp: 31,
          alternativeHp: 12,
          maxAlternativeHp: 20,
          tempHp: 5,
        }),
      ]),
    );
    render(<CombatTrackerPage />);

    const hpBar = within(
      await screen.findByTestId("character-item-aragorn"),
    ).getByTestId("character-hp-aragorn");
    const summary =
      "stats.hpSummary(stats.alternativeHp, 12, 20) (stats.tempHpBonus(5))";
    expect(hpBar).toHaveAccessibleName(summary);
    // Also shown on hover: the values are not written in the list
    expect(hpBar).toHaveAttribute("title", summary);
  });

  it("shows the hit points without alternative or temporary ones", async () => {
    saveCombat(
      buildCombat([
        buildCharacter({ id: "aragorn", hp: 27, maxHp: 31, alternativeHp: 0 }),
      ]),
    );
    render(<CombatTrackerPage />);

    const card = await screen.findByTestId("character-item-aragorn");
    expect(
      within(card).getByTestId("character-hp-aragorn"),
    ).toHaveAccessibleName("stats.hpSummary(stats.hp, 27, 31)");
  });

  it("shows play instead of the initiative of the current character", async () => {
    saveCombat({
      ...buildCombat([aragorn, legolas]),
      status: CombatStatusEnum.ONGOING,
      currentTurn: 1,
    });
    render(<CombatTrackerPage />);

    const current = await screen.findByTestId("character-item-aragorn");
    expect(current).toHaveAttribute("aria-current", "true");
    expect(
      within(current).getByTestId("current-turn-icon"),
    ).toBeInTheDocument();
    expect(within(current).queryByText("15")).not.toBeInTheDocument();
    expect(
      within(screen.getByTestId("character-item-legolas")).getByText("10"),
    ).toBeInTheDocument();
  });

  it("shows the initiative of everyone before the combat starts", async () => {
    await renderPageWithCharacters();

    expect(screen.queryByTestId("current-turn-icon")).not.toBeInTheDocument();
    expect(
      within(screen.getByTestId("character-item-aragorn")).getByText("15"),
    ).toBeInTheDocument();
  });
});

describe("CharacterList dead characters", () => {
  afterEach(() => {
    localStorage.clear();
  });

  const boromir = buildCharacter({
    id: "boromir",
    name: "Boromir",
    initiativeScore: 12,
    hp: 0,
    isDead: true,
  });

  it("lists dead characters apart, between active and inactive ones", async () => {
    saveCombat({
      ...buildCombat([aragorn, boromir, legolas]),
      idleCharacters: [buildCharacter({ id: "gandalf", name: "Gandalf" })],
    });
    render(<CombatTrackerPage />);

    const deadList = await screen.findByTestId("dead-characters-list");
    expect(
      within(deadList).getByTestId("character-item-boromir"),
    ).toBeInTheDocument();
    expect(
      within(activeList()).queryByTestId("character-item-boromir"),
    ).not.toBeInTheDocument();

    const sections = screen
      .getAllByTestId(/-characters-list$/)
      .map((section) => section.getAttribute("data-testid"));
    expect(sections).toEqual([
      "active-characters-list",
      "dead-characters-list",
      "idle-characters-list",
    ]);
  });

  it("has no dead section when nobody is dead", async () => {
    await renderPageWithCharacters();

    expect(
      screen.queryByTestId("dead-characters-list"),
    ).not.toBeInTheDocument();
  });

  it("passes the turn of a dead character to the next one who can play", async () => {
    saveCombat({
      ...buildCombat([aragorn, boromir, legolas]),
      status: CombatStatusEnum.ONGOING,
      currentTurn: 1,
      selectedCharacterIndex: 1,
    });
    render(<CombatTrackerPage />);

    expect(await screen.findByTestId("character-item-legolas")).toHaveClass(
      "characters-list__card--current",
    );
    expect(screen.getByTestId("character-item-boromir")).not.toHaveClass(
      "characters-list__card--current",
    );
  });

  it("does not give the turn to a dead character after a deactivation", async () => {
    saveCombat({
      ...buildCombat([aragorn, boromir, legolas]),
      status: CombatStatusEnum.ONGOING,
      currentTurn: 1,
    });
    render(<CombatTrackerPage />);
    await screen.findByTestId("character-item-aragorn");

    clickMenuItem("aragorn", "deactivate-character-aragorn");

    expect(screen.getByTestId("character-item-legolas")).toHaveClass(
      "characters-list__card--current",
    );
  });

  it("skips dead characters when going to the next player", async () => {
    saveCombat({
      ...buildCombat([aragorn, boromir, legolas]),
      status: CombatStatusEnum.ONGOING,
      currentTurn: 1,
    });
    render(<CombatTrackerPage />);

    fireEvent.click(
      within(await screen.findByTestId("combat-turn")).getByText(
        "manager.nextPlayer",
      ),
    );

    expect(screen.getByTestId("character-item-legolas")).toHaveClass(
      "characters-list__card--current",
    );
  });
});

describe("CharacterList long names", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("shows the full name as a tooltip, as it may be cut", async () => {
    const name = "Gnoll Flind of the Shattered Sanctum";
    saveCombat(buildCombat([buildCharacter({ id: "gnoll", name })]));
    render(<CombatTrackerPage />);

    const card = await screen.findByTestId("character-item-gnoll");
    expect(within(card).getByText(name)).toHaveAttribute("title", name);
  });
});

describe("CharacterStats header", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("shows the name, the initial without picture, and the actions", async () => {
    saveCombat(
      buildCombat([
        buildCharacter({
          id: "kagha",
          name: "Kagha",
          wikiLink: "https://bg3.wiki/wiki/Kagha",
        }),
      ]),
    );
    render(<CombatTrackerPage />);

    const stats = await screen.findByRole("region", { name: "Kagha" });
    expect(within(stats).getByText("K")).toBeInTheDocument();

    expect(screen.getByTestId("character-stats-wiki-link")).toHaveAttribute(
      "href",
      "https://bg3.wiki/wiki/Kagha",
    );

    fireEvent.click(screen.getByTestId("character-stats-deactivate"));
    expect(
      within(screen.getByTestId("idle-characters-list")).getByTestId(
        "character-item-kagha",
      ),
    ).toBeInTheDocument();
  });

  it("shows the attitude of an NPC with its name", async () => {
    saveCombat(
      buildCombat([
        buildCharacter({
          id: "kagha",
          name: "Kagha",
          isNpc: true,
          attitude: NpcAttitudeEnum.ENEMY,
        }),
      ]),
    );
    render(<CombatTrackerPage />);

    expect(await screen.findByTestId("character-attitude")).toHaveTextContent(
      "attitude.enemy",
    );
  });
});

describe("CharacterStats hit points bars", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("shows only the alternative hit points, and switches to the regular ones", async () => {
    saveCombat(
      buildCombat([
        buildCharacter({
          id: "druid",
          hp: 30,
          maxHp: 30,
          alternativeHp: 12,
          maxAlternativeHp: 20,
          tempHp: 5,
        }),
      ]),
    );
    render(<CombatTrackerPage />);

    const alternative = await screen.findByTestId("alternative-hp-bar");
    expect(alternative).toHaveTextContent("12 / 20");
    expect(screen.getByText("stats.alternativeHitPoints")).toBeInTheDocument();
    expect(screen.getByTestId("alternative-hp-bar-temp")).toBeInTheDocument();
    expect(screen.queryByTestId("hp-bar")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("alternative-hp-bar-switch"));
    expect(screen.getByTestId("hp-bar")).toHaveTextContent("30 / 30");
    expect(screen.getByText("stats.hitPoints")).toBeInTheDocument();
    // Temporary > alternative > regular: never on the regular bar while
    // there are alternative hit points
    expect(screen.queryByTestId("hp-bar-temp")).not.toBeInTheDocument();
    expect(
      screen.getByTestId("hp-bar").querySelector(".hp-bar__fill--temp"),
    ).toHaveStyle({ width: "0%" });
    expect(screen.queryByTestId("alternative-hp-bar")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("hp-bar-switch"));
    expect(screen.getByTestId("alternative-hp-bar")).toBeInTheDocument();
  });

  it("shows only the hit points bar, with the temporary ones, otherwise", async () => {
    saveCombat(
      buildCombat([
        buildCharacter({ id: "fighter", hp: 8, maxHp: 10, tempHp: 4 }),
      ]),
    );
    render(<CombatTrackerPage />);

    await screen.findByTestId("hp-bar");
    expect(screen.queryByTestId("alternative-hp-bar")).not.toBeInTheDocument();
    expect(screen.getByTestId("hp-bar-temp")).toBeInTheDocument();
    expect(screen.queryByTestId("hp-bar-switch")).not.toBeInTheDocument();
  });
});

describe("CharacterStats tiles", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("shows the armor class and the initiative", async () => {
    saveCombat(
      buildCombat([
        buildCharacter({ id: "fighter", ac: 16, initiativeScore: 19 }),
      ]),
    );
    render(<CombatTrackerPage />);

    expect(await screen.findByTestId("ac-tile")).toHaveTextContent(
      "stats.ac16",
    );
    expect(screen.getByTestId("initiative-tile")).toHaveTextContent(
      "stats.initiative19",
    );
  });
});

describe("CharacterStats abilities", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("shows the movement, the ability modifiers and the saving throws", async () => {
    saveCombat(
      buildCombat([
        buildCharacter({
          id: "druid",
          movement: 9,
          proficiencyBonus: 3,
          abilities: { str: 16, dex: 9 },
          savingThrows: { str: 5 },
        }),
      ]),
    );
    render(<CombatTrackerPage />);

    expect(await screen.findByTestId("movement-tile")).toBeInTheDocument();
    expect(screen.getByTestId("proficiency-bonus-tile")).toHaveTextContent(
      "+3",
    );
    expect(screen.getByTestId("ability-str")).toHaveTextContent("+3");
    expect(screen.getByTestId("saving-throw-str")).toHaveTextContent("+5");
    expect(screen.getByTestId("ability-dex")).toHaveTextContent("−1");
    expect(screen.getByTestId("saving-throw-dex")).toBeEmptyDOMElement();
    expect(screen.getByTestId("abilities-tile")).toHaveTextContent(
      "stats.savingThrows",
    );
    expect(screen.queryByTestId("ability-con")).not.toBeInTheDocument();
  });

  it("shows nothing when they are unknown", async () => {
    saveCombat(buildCombat([buildCharacter({ id: "fighter" })]));
    render(<CombatTrackerPage />);

    await screen.findByTestId("ac-tile");
    expect(screen.queryByTestId("movement-tile")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("proficiency-bonus-tile"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("abilities-tile")).not.toBeInTheDocument();
  });

  it("hides the saving throws row when there are none", async () => {
    saveCombat(
      buildCombat([buildCharacter({ id: "fighter", abilities: { str: 16 } })]),
    );
    render(<CombatTrackerPage />);

    expect(await screen.findByTestId("abilities-tile")).not.toHaveTextContent(
      "stats.savingThrows",
    );
    expect(screen.queryByTestId("saving-throw-str")).not.toBeInTheDocument();
  });

  it.each([
    [16, "+3"],
    [8, "−1"],
  ])(
    "shows the dexterity modifier as initiative bonus (DEX %i -> %s)",
    async (dex, bonus) => {
      saveCombat(
        buildCombat([buildCharacter({ id: "rogue", abilities: { dex } })]),
      );
      render(<CombatTrackerPage />);

      expect(await screen.findByTestId("abilities-tile")).toHaveTextContent(
        "stats.initiativeBonus",
      );
      expect(screen.getByTestId("initiative-bonus")).toHaveTextContent(bonus);
    },
  );

  it("shows no initiative bonus without dexterity", async () => {
    saveCombat(
      buildCombat([buildCharacter({ id: "fighter", abilities: { str: 16 } })]),
    );
    render(<CombatTrackerPage />);

    expect(await screen.findByTestId("abilities-tile")).not.toHaveTextContent(
      "stats.initiativeBonus",
    );
    expect(screen.queryByTestId("initiative-bonus")).not.toBeInTheDocument();
  });
});

describe("CharacterStats spell slots", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("shows a chip per spell slot, with the level or a wand", async () => {
    saveCombat(
      buildCombat([
        buildCharacter({
          id: "druid",
          spellSlotsLeft: { "1": 4, "2": 0, wldshp: 2 },
        }),
      ]),
    );
    render(<CombatTrackerPage />);

    const spells = await screen.findByTestId("character-spell-slots");
    expect(spells).toHaveTextContent("stats.spells");

    const level1 = screen.getByTestId("spell-slot-1");
    expect(level1).toHaveTextContent("14");
    expect(
      level1.querySelector(".character-stats__spell-level"),
    ).toHaveTextContent("1");
    expect(level1).not.toHaveClass("character-stats__chip--empty");
    expect(screen.getByTestId("spell-slot-2")).toHaveClass(
      "character-stats__chip--empty",
    );

    const wildShape = screen.getByTestId("spell-slot-wldshp");
    expect(wildShape).toHaveTextContent("wldshp 2");
    expect(wildShape.querySelector(".fa-wand-sparkles")).toBeInTheDocument();
    expect(wildShape.querySelector(".character-stats__spell-level")).toBeNull();
  });

  it("shows nothing without spell slots", async () => {
    saveCombat(buildCombat([buildCharacter({ id: "fighter" })]));
    render(<CombatTrackerPage />);

    await screen.findByTestId("ac-tile");
    expect(
      screen.queryByTestId("character-spell-slots"),
    ).not.toBeInTheDocument();
  });
});
