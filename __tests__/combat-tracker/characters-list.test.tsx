import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import CombatTrackerPage from "@/app/combat-tracker/page";
import { saveCombat } from "@/app/combat-tracker/_lib/local-storage";
import { CombatStatusEnum } from "@/app/_lib/enums/combat-status.enum";
import {
  buildCharacter,
  buildCombat,
} from "../utils/combat-tracker.test.utils";

// dictionnary.ts uses top-level await, unsupported by Jest's CJS environment.
jest.mock("../../app/_dictionaries/dictionnary", () => ({
  translate: (key: string) => key,
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

    fireEvent.click(screen.getByTestId("deactivate-character-legolas"));

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

  it("moves a character back to the active list when reactivated", async () => {
    await renderPageWithCharacters();
    fireEvent.click(screen.getByTestId("deactivate-character-legolas"));

    fireEvent.click(screen.getByTestId("reactivate-character-legolas"));

    expect(
      within(activeList()).getByTestId("character-item-legolas"),
    ).toBeInTheDocument();
    expect(idleList()).not.toBeInTheDocument();
  });

  it("selects the next active character when the selected one is deactivated", async () => {
    await renderPageWithCharacters();
    expect(screen.getByTestId("character-item-aragorn")).toHaveClass(
      "characters-list__item--active",
    );

    fireEvent.click(screen.getByTestId("deactivate-character-aragorn"));

    expect(screen.getByTestId("character-item-legolas")).toHaveClass(
      "characters-list__item--active",
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

    fireEvent.click(await screen.findByTestId("reactivate-character-aragorn"));

    const ids = within(activeList())
      .getAllByTestId(/^character-item-/)
      .map((item) => item.getAttribute("data-testid"));
    expect(ids).toEqual(["character-item-aragorn", "character-item-legolas"]);
  });

  it("keeps a deactivated character idle after a page reload", async () => {
    const { unmount } = await renderPageWithCharacters();
    fireEvent.click(screen.getByTestId("deactivate-character-legolas"));
    unmount();

    render(<CombatTrackerPage />);

    expect(
      await within(
        await screen.findByTestId("idle-characters-list"),
      ).findByTestId("character-item-legolas"),
    ).toBeInTheDocument();
  });
});
