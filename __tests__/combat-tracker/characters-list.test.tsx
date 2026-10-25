import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import CombatTrackerPage from "@/app/combat-tracker/page";
import { saveCombat } from "@/app/combat-tracker/_lib/local-storage";
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

  it("moves a character from the active list to the idle list when removed from combat", async () => {
    await renderPageWithCharacters();

    fireEvent.click(screen.getByTestId("remove-from-combat-legolas"));

    expect(
      within(activeList()).queryByTestId("character-item-legolas"),
    ).not.toBeInTheDocument();
    expect(
      within(idleList()!).getByTestId("character-item-legolas"),
    ).toBeInTheDocument();
    expect(
      within(activeList()).getByTestId("character-item-aragorn"),
    ).toBeInTheDocument();
  });

  it("moves a character back to the active list when put back in combat", async () => {
    await renderPageWithCharacters();
    fireEvent.click(screen.getByTestId("remove-from-combat-legolas"));

    fireEvent.click(screen.getByTestId("add-to-combat-legolas"));

    expect(
      within(activeList()).getByTestId("character-item-legolas"),
    ).toBeInTheDocument();
    expect(idleList()).not.toBeInTheDocument();
  });

  it("keeps a removed character idle after a page reload", async () => {
    const { unmount } = await renderPageWithCharacters();
    fireEvent.click(screen.getByTestId("remove-from-combat-legolas"));
    unmount();

    render(<CombatTrackerPage />);

    expect(
      await within(
        await screen.findByTestId("idle-characters-list"),
      ).findByTestId("character-item-legolas"),
    ).toBeInTheDocument();
  });
});
