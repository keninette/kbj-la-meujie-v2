import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import CombatTrackerPage from "@/app/combat-tracker/page";
import { saveCombat } from "@/app/combat-tracker/_lib/local-storage";
import { CombatStatusEnum } from "@/app/_lib/enums/combat-status.enum";
import { Combat } from "@/app/_lib/types/combat.type";
import {
  buildCharacter,
  buildCombat,
} from "./_fixtures/combat-tracker.fixtures";

// dictionnary.ts uses top-level await, unsupported by Jest's CJS environment.
// Keeps the values, e.g. "manager.turn(1)"
jest.mock("../../app/_dictionaries/dictionnary", () => ({
  translate: (
    key: string,
    _namespace: string,
    values?: Record<string, string>,
  ) => (values ? `${key}(${Object.values(values).join(", ")})` : key),
}));

// The flows of the page: what the components do together

const aragorn = buildCharacter({ id: "aragorn", initiativeScore: 15 });
const legolas = buildCharacter({
  id: "legolas",
  name: "Legolas",
  initiativeScore: 10,
});

const renderPage = async (combat: Combat) => {
  saveCombat(combat);
  render(<CombatTrackerPage />);
  await screen.findByTestId(`character-item-${combat.characters[0].id}`);
};
const ongoingCombat = (overrides: Partial<Combat> = {}): Combat => ({
  ...buildCombat([aragorn, legolas]),
  status: CombatStatusEnum.ONGOING,
  currentTurn: 1,
  ...overrides,
});

const clickButton = (name: string) =>
  fireEvent.click(screen.getByRole("button", { name }));
const editMenuItem = (characterId: string) => {
  fireEvent.click(screen.getByTestId(`character-menu-${characterId}`));
  fireEvent.click(screen.getByTestId(`edit-character-${characterId}`));
};
const isCurrent = (characterId: string) =>
  expect(screen.getByTestId(`character-item-${characterId}`)).toHaveAttribute(
    "aria-current",
    "true",
  );

afterEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

describe("Combat manager", () => {
  it("creates a new combat when there is none, to add characters", async () => {
    render(<CombatTrackerPage />);

    fireEvent.click(
      await screen.findByRole("button", { name: "manager.newCombat" }),
    );

    expect(
      screen.getByRole("button", { name: "manager.addCharacter" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "manager.newCombat" }),
    ).not.toBeInTheDocument();
  });

  it("starts the combat at turn 1 with the first character", async () => {
    await renderPage(buildCombat([aragorn, legolas]));

    clickButton("manager.startCombat");

    expect(screen.getByTestId("combat-turn")).toHaveAccessibleName(
      "manager.turn(1)",
    );
    isCurrent("aragorn");
  });

  it("goes back to the previous player", async () => {
    await renderPage(ongoingCombat({ selectedCharacterIndex: 1 }));
    isCurrent("legolas");

    clickButton("manager.previousPlayer");

    isCurrent("aragorn");
  });

  it("removes all characters when stopping the combat", async () => {
    await renderPage(ongoingCombat());

    fireEvent.click(screen.getByTestId("stop-combat"));
    clickButton("manager.removeAllCharacters");

    expect(
      screen.queryByTestId("character-item-aragorn"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("character-item-legolas"),
    ).not.toBeInTheDocument();
  });

  it("lists the actions of the combat in the history", async () => {
    await renderPage(
      ongoingCombat({
        history: [{ id: "h1", turn: 1, action: "Aragorn attacks Legolas" }],
      }),
    );

    clickButton("manager.history");

    expect(screen.getByText(/Aragorn attacks Legolas/)).toHaveTextContent(
      "manager.turn(1) : Aragorn attacks Legolas",
    );
  });
});

describe("Characters added and edited in the drawer", () => {
  it("adds a character from the combat manager", async () => {
    await renderPage(buildCombat([aragorn]));

    clickButton("manager.addCharacter");
    fireEvent.change(screen.getByTestId("name"), {
      target: { name: "name", value: "Gimli" },
    });
    fireEvent.change(screen.getByTestId("initiativeRoll"), {
      target: { name: "initiativeRoll", value: "8" },
    });
    fireEvent.submit(screen.getByTestId("edit-character-form"));

    expect(
      await within(screen.getByTestId("active-characters-list")).findByText(
        "Gimli",
      ),
    ).toBeInTheDocument();
  });

  it("edits a character from the list, with its values filled in", async () => {
    await renderPage(buildCombat([aragorn, legolas]));

    editMenuItem("legolas");
    expect(screen.getByTestId("name")).toHaveValue("Legolas");
    fireEvent.change(screen.getByTestId("name"), {
      target: { name: "name", value: "Legolas Greenleaf" },
    });
    fireEvent.submit(screen.getByTestId("edit-character-form"));

    expect(
      await within(screen.getByTestId("character-item-legolas")).findByText(
        "Legolas Greenleaf",
      ),
    ).toBeInTheDocument();
  });

  it("edits the selected character from its stats", async () => {
    await renderPage(buildCombat([aragorn, legolas]));

    fireEvent.click(screen.getByTestId("character-stats-edit"));

    expect(screen.getByTestId("name")).toHaveValue("Aragorn");
  });

  it("clears the unsaved changes when the drawer is opened again", async () => {
    await renderPage(buildCombat([aragorn]));

    editMenuItem("aragorn");
    fireEvent.change(screen.getByTestId("name"), {
      target: { name: "name", value: "Strider" },
    });
    fireEvent.click(screen.getByTestId("custom-drawer-close"));
    editMenuItem("aragorn");

    expect(screen.getByTestId("name")).toHaveValue("Aragorn");
  });

  it("deactivates the selected character from its stats", async () => {
    await renderPage(buildCombat([aragorn, legolas]));

    fireEvent.click(screen.getByTestId("character-stats-deactivate"));

    expect(
      within(screen.getByTestId("idle-characters-list")).getByTestId(
        "character-item-aragorn",
      ),
    ).toBeInTheDocument();
  });
});

describe("Playing a turn", () => {
  it("attacks a character from the stats of the current one", async () => {
    await renderPage(ongoingCombat());

    clickButton("stats.play");
    fireEvent.change(screen.getByTestId("targetName"), {
      target: { value: "legolas" },
    });
    fireEvent.change(screen.getByTestId("attackDamage"), {
      target: { value: "4" },
    });
    fireEvent.click(
      screen.getAllByRole("button", { name: "combatAction.validate" })[0],
    );
    clickButton("form.save");

    expect(
      await screen.findByRole("group", {
        name: "stats.hpSummary(stats.hp, 6, 10)",
      }),
    ).toBeInTheDocument();
  });
});
