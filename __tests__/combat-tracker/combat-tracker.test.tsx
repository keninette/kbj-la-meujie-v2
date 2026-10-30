import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { findCharacterIndexById } from "@lib/combat/combat.helper";
import {
  loadCombat,
  saveCombat,
} from "@/app/combat-tracker/_lib/local-storage";
import { CombatCharacter } from "@lib/types/combat-character.type";
import EditCharacterForm from "@/app/combat-tracker/_components/edit-character-form/EditCharacterForm";
import AttackForm from "@/app/combat-tracker/_components/attack-form/AttackForm";
import CharacterStats from "@/app/combat-tracker/_components/character-stats/CharacterStats";
import {
  buildCharacter,
  buildCombat,
} from "../utils/combat-tracker.test.utils";

// dictionnary.ts uses top-level await, unsupported by Jest's CJS environment.
jest.mock("../../app/_dictionaries/dictionnary", () => ({
  translate: (key: string) => key,
}));

// Note: these test only cover important behaviors and do not provide exhaustive coverage of all edge cases.
describe("findCharacterIndexById", () => {
  it("returns the index of the character matching the given id", () => {
    const characters = [
      buildCharacter({ id: "a" }),
      buildCharacter({ id: "b" }),
    ];

    expect(findCharacterIndexById(characters, "b")).toBe(1);
  });

  it("returns -1 when no character matches the given id", () => {
    const characters = [buildCharacter({ id: "a" })];

    expect(findCharacterIndexById(characters, "missing")).toBe(-1);
  });

  it("returns -1 for an empty character list", () => {
    expect(findCharacterIndexById([], "a")).toBe(-1);
  });
});

describe("loadCombat", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("returns null when nothing is stored", () => {
    expect(loadCombat()).toBeNull();
  });

  it("round-trips a valid combat through saveCombat/loadCombat", () => {
    const combat = buildCombat([
      buildCharacter({
        passives: ["Rage", "Vision dans le noir"],
        usableObjects: ["Potion de soin"],
      }),
    ]);

    saveCombat(combat);

    expect(loadCombat()).toEqual(combat);
  });

  it("round-trips idle characters", () => {
    const combat = {
      ...buildCombat([buildCharacter()]),
      idleCharacters: [buildCharacter({ id: "idle-1" })],
    };

    saveCombat(combat);

    expect(loadCombat()).toEqual(combat);
  });

  it("returns null when the stored idle characters are invalid", () => {
    localStorage.setItem(
      "scratchie-combat-tracker",
      JSON.stringify({
        ...buildCombat([buildCharacter()]),
        idleCharacters: "not-an-array",
      }),
    );

    expect(loadCombat()).toBeNull();
  });

  it("returns null when the stored payload is malformed", () => {
    localStorage.setItem(
      "scratchie-combat-tracker",
      JSON.stringify({ status: "unknown-status" }),
    );

    expect(loadCombat()).toBeNull();
  });

  it("returns null when the stored usable objects are not an array of strings", () => {
    localStorage.setItem(
      "scratchie-combat-tracker",
      JSON.stringify(
        buildCombat([
          buildCharacter({ usableObjects: [42] as unknown as string[] }),
        ]),
      ),
    );

    expect(loadCombat()).toBeNull();
  });

  it("returns null when the stored passives are not an array of strings", () => {
    localStorage.setItem(
      "scratchie-combat-tracker",
      JSON.stringify(
        buildCombat([
          buildCharacter({ passives: [42] as unknown as string[] }),
        ]),
      ),
    );

    expect(loadCombat()).toBeNull();
  });

  it("returns null when the stored payload is not valid JSON", () => {
    localStorage.setItem("scratchie-combat-tracker", "not-json");

    expect(loadCombat()).toBeNull();
  });

  it("keeps a backup of unreadable stored data", () => {
    localStorage.setItem("scratchie-combat-tracker", "not-json");

    loadCombat();

    expect(localStorage.getItem("scratchie-combat-tracker-backup")).toBe(
      "not-json",
    );
  });
});

describe("EditCharacterForm hp/isDying/isDead behavior", () => {
  it("sets isDying to true and reveals the isDead checkbox when hp is set to 0", () => {
    render(<EditCharacterForm initialCharacter={buildCharacter()} />);

    expect(screen.queryByTestId("isDead")).not.toBeInTheDocument();

    fireEvent.change(screen.getByTestId("hp"), {
      target: { value: "0" },
    });

    expect(screen.getByTestId("isDead")).not.toBeChecked();
  });

  it("clears isDying and forces isDead back to false when hp goes back to 1 or more", () => {
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter({
          hp: 0,
          isDying: true,
          isDead: true,
        })}
      />,
    );

    expect(screen.getByTestId("isDead")).toBeChecked();

    fireEvent.change(screen.getByTestId("hp"), {
      target: { value: "5" },
    });

    expect(screen.queryByTestId("isDead")).not.toBeInTheDocument();
  });

  it("keeps isDead checked while hp stays at 0 or less across unrelated field edits", () => {
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter({
          hp: 0,
          isDying: true,
          isDead: true,
        })}
      />,
    );

    fireEvent.change(screen.getByTestId("name"), {
      target: { value: "Legolas" },
    });

    expect(screen.getByTestId("isDead")).toBeChecked();
  });
});

describe("EditCharacterForm passives", () => {
  it("adds a passive and submits it with the character", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("passiveName"), {
      target: { value: "  Rage  " },
    });
    fireEvent.click(screen.getByTestId("addPassive"));
    fireEvent.submit(screen.getByTestId("name").closest("form")!);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ passives: ["Rage"] }),
    );
  });

  it("removes an existing passive and ignores blank ones", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter({ passives: ["Rage", "Fury"] })}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("passiveName"), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByTestId("addPassive"));
    expect(screen.getAllByTestId("passive-item")).toHaveLength(2);

    fireEvent.click(
      within(screen.getAllByTestId("passive-item")[0]).getByRole("button"),
    );
    fireEvent.submit(screen.getByTestId("name").closest("form")!);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ passives: ["Fury"] }),
    );
  });
});

describe("CharacterStats passives", () => {
  const renderStats = (character: CombatCharacter) =>
    render(
      <CharacterStats
        selectedCharacter={character}
        characters={[character]}
        onCharacterChange={jest.fn()}
        onCharactersChange={jest.fn()}
        onHistoryEdited={jest.fn()}
        isCombatOngoing={false}
      />,
    );

  it("displays the passives of the selected character", () => {
    renderStats(buildCharacter({ passives: ["Rage", "Fury"] }));

    const passives = screen.getByTestId("character-passives");
    expect(passives).toHaveTextContent("Rage");
    expect(passives).toHaveTextContent("Fury");
  });

  it("does not display the passives block when there are none", () => {
    renderStats(buildCharacter());

    expect(screen.queryByTestId("character-passives")).not.toBeInTheDocument();
  });
});

describe("EditCharacterForm usable objects", () => {
  it("adds and removes usable objects, ignoring blank ones", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter({ usableObjects: ["Torche"] })}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("usableObjectName"), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByTestId("addUsableObject"));
    expect(screen.getAllByTestId("usable-object-item")).toHaveLength(1);

    fireEvent.change(screen.getByTestId("usableObjectName"), {
      target: { value: "  Potion  " },
    });
    fireEvent.click(screen.getByTestId("addUsableObject"));
    fireEvent.click(
      within(screen.getAllByTestId("usable-object-item")[0]).getByRole(
        "button",
      ),
    );
    fireEvent.submit(screen.getByTestId("name").closest("form")!);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ usableObjects: ["Potion"] }),
    );
  });
});

describe("CharacterStats usable objects", () => {
  const renderStats = (character: CombatCharacter) =>
    render(
      <CharacterStats
        selectedCharacter={character}
        characters={[character]}
        onCharacterChange={jest.fn()}
        onCharactersChange={jest.fn()}
        onHistoryEdited={jest.fn()}
        isCombatOngoing={false}
      />,
    );

  it("displays usable objects only when there are some", () => {
    const { unmount } = renderStats(
      buildCharacter({ usableObjects: ["Potion"] }),
    );
    expect(screen.getByTestId("character-usable-objects")).toHaveTextContent(
      "Potion",
    );
    unmount();

    renderStats(buildCharacter());
    expect(
      screen.queryByTestId("character-usable-objects"),
    ).not.toBeInTheDocument();
  });
});

describe("EditCharacterForm spell slots", () => {
  it("adds a spell slot with a free-text name", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("spellSlotName"), {
      target: { value: " Rage " },
    });
    fireEvent.change(screen.getByLabelText("form.value"), {
      target: { value: "4" },
    });
    fireEvent.click(screen.getAllByText("form.add")[0]);
    fireEvent.submit(screen.getByTestId("name").closest("form")!);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ spellSlotsLeft: { Rage: 4 } }),
    );
  });
});

describe("AttackForm isDying/isDead behavior", () => {
  it("submits registered spell and timed-state values", async () => {
    const attacker = buildCharacter({
      id: "attacker",
      name: "Attacker",
      spellSlotsLeft: { 1: 2 },
    });
    const target = buildCharacter({ id: "target", name: "Target" });
    const onCharactersChange = jest.fn();

    render(
      <AttackForm
        characters={[attacker, target]}
        selectedCharacter={attacker}
        onCharactersChange={onCharactersChange}
        onHistoryEdited={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("form.nameOrLevel"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("inflictedStateTargetName"), {
      target: { value: target.id },
    });
    fireEvent.change(screen.getAllByLabelText("form.name")[1], {
      target: { value: "Restrained" },
    });
    fireEvent.change(screen.getByLabelText("attack.duration"), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "form.save" }));

    await waitFor(() => expect(onCharactersChange).toHaveBeenCalled());

    const [updatedCharacters] = onCharactersChange.mock.calls[0];
    expect(
      updatedCharacters.find(
        (character: CombatCharacter) => character.id === attacker.id,
      ).spellSlotsLeft[1],
    ).toBe(1);
    expect(
      updatedCharacters.find(
        (character: CombatCharacter) => character.id === target.id,
      ).states[0],
    ).toMatchObject({ name: "Restrained", numberOfTurns: 2 });
  });

  it("records an attack from registered inputs before saving", async () => {
    const attacker = buildCharacter({ id: "attacker", name: "Attacker" });
    const target = buildCharacter({ id: "target", name: "Target", hp: 5 });
    const onHistoryEdited = jest.fn();

    render(
      <AttackForm
        characters={[attacker, target]}
        selectedCharacter={attacker}
        onCharactersChange={jest.fn()}
        onHistoryEdited={onHistoryEdited}
      />,
    );

    fireEvent.change(screen.getByTestId("targetName"), {
      target: { value: target.id },
    });
    fireEvent.change(screen.getByTestId("attackDamage"), {
      target: { value: "3" },
    });
    fireEvent.click(
      screen.getAllByRole("button", { name: "attack.validate" })[0],
    );

    expect(screen.getByText("history.attack")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "form.save" }));

    await waitFor(() => {
      expect(onHistoryEdited).toHaveBeenCalledWith(["history.attack"]);
    });
  });

  it("heals a target and records it before saving", async () => {
    const healer = buildCharacter({ id: "healer", name: "Healer" });
    const target = buildCharacter({
      id: "target",
      name: "Target",
      hp: 0,
      isDying: true,
      deathSaveThrowsLeft: 1,
    });
    const dead = buildCharacter({ id: "dead", name: "Dead", isDead: true });
    const onCharactersChange = jest.fn();
    const onHistoryEdited = jest.fn();

    render(
      <AttackForm
        characters={[healer, target, dead]}
        selectedCharacter={healer}
        onCharactersChange={onCharactersChange}
        onHistoryEdited={onHistoryEdited}
      />,
    );

    const healTarget = screen.getByTestId("healTargetId");
    expect(
      within(healTarget).queryByRole("option", { name: "Dead" }),
    ).not.toBeInTheDocument();

    fireEvent.change(healTarget, { target: { value: target.id } });
    fireEvent.change(screen.getByTestId("healAmount"), {
      target: { value: "4" },
    });
    fireEvent.click(
      screen.getAllByRole("button", { name: "attack.validate" })[1],
    );
    fireEvent.click(screen.getByRole("button", { name: "form.save" }));

    await waitFor(() => expect(onCharactersChange).toHaveBeenCalled());

    const [updatedCharacters] = onCharactersChange.mock.calls[0];
    expect(
      updatedCharacters.find(
        (character: CombatCharacter) => character.id === target.id,
      ),
    ).toMatchObject({ hp: 4, isDying: false, deathSaveThrowsLeft: 3 });
    expect(onHistoryEdited).toHaveBeenCalledWith(["history.heal"]);
  });

  it("sets isDying to true when an attack brings a target's hp to 0 or less", async () => {
    const attacker = buildCharacter({ id: "attacker", name: "Attacker" });
    const target = buildCharacter({ id: "target", name: "Target", hp: 5 });
    const onCharactersChange = jest.fn();

    render(
      <AttackForm
        characters={[attacker, target]}
        selectedCharacter={attacker}
        onCharactersChange={onCharactersChange}
        onHistoryEdited={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByTestId("targetName"), {
      target: { value: target.id },
    });
    fireEvent.change(screen.getByTestId("attackDamage"), {
      target: { value: "10" },
    });
    fireEvent.click(screen.getByRole("button", { name: "form.save" }));

    await waitFor(() => expect(onCharactersChange).toHaveBeenCalled());

    const [updatedCharacters] = onCharactersChange.mock.calls[0];
    const updatedTarget = updatedCharacters.find(
      (character: CombatCharacter) => character.id === target.id,
    );

    expect(updatedTarget.hp).toBeLessThanOrEqual(0);
    expect(updatedTarget.isDying).toBe(true);
    expect(updatedTarget.isDead).toBe(false);
  });

  it("sets isDead to true when an already dying target takes more damage", async () => {
    const attacker = buildCharacter({ id: "attacker", name: "Attacker" });
    const target = buildCharacter({
      id: "target",
      name: "Target",
      hp: 0,
      isDying: true,
    });
    const onCharactersChange = jest.fn();

    render(
      <AttackForm
        characters={[attacker, target]}
        selectedCharacter={attacker}
        onCharactersChange={onCharactersChange}
        onHistoryEdited={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByTestId("targetName"), {
      target: { value: target.id },
    });
    fireEvent.change(screen.getByTestId("attackDamage"), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByRole("button", { name: "form.save" }));

    await waitFor(() => expect(onCharactersChange).toHaveBeenCalled());

    const [updatedCharacters] = onCharactersChange.mock.calls[0];
    const updatedTarget = updatedCharacters.find(
      (character: CombatCharacter) => character.id === target.id,
    );

    expect(updatedTarget.isDying).toBe(false);
    expect(updatedTarget.isDead).toBe(true);
  });

  it('helps up ("Relever") a dying character: resets hp, isDying and isDead', async () => {
    const attacker = buildCharacter({ id: "attacker", name: "Attacker" });
    const dyingCharacter = buildCharacter({
      id: "dying",
      name: "Dying",
      hp: 0,
      isDying: true,
      deathSaveThrowsLeft: 1,
    });
    const onCharactersChange = jest.fn();

    render(
      <AttackForm
        characters={[attacker, dyingCharacter]}
        selectedCharacter={attacker}
        onCharactersChange={onCharactersChange}
        onHistoryEdited={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByTestId("reviveTargetId"), {
      target: { value: dyingCharacter.id },
    });
    fireEvent.click(screen.getByRole("button", { name: "form.save" }));

    await waitFor(() => expect(onCharactersChange).toHaveBeenCalled());

    const [updatedCharacters] = onCharactersChange.mock.calls[0];
    const updatedCharacter = updatedCharacters.find(
      (character: CombatCharacter) => character.id === dyingCharacter.id,
    );

    expect(updatedCharacter.hp).toBe(1);
    expect(updatedCharacter.isDying).toBe(false);
    expect(updatedCharacter.isDead).toBe(false);
    expect(updatedCharacter.deathSaveThrowsLeft).toBe(3);
  });

  it('revives ("Réanimer") a dead character: resets hp, isDying and isDead', async () => {
    const attacker = buildCharacter({ id: "attacker", name: "Attacker" });
    const deadCharacter = buildCharacter({
      id: "dead",
      name: "Dead",
      hp: 0,
      isDead: true,
    });
    const onCharactersChange = jest.fn();

    render(
      <AttackForm
        characters={[attacker, deadCharacter]}
        selectedCharacter={attacker}
        onCharactersChange={onCharactersChange}
        onHistoryEdited={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByTestId("reanimateTargetId"), {
      target: { value: deadCharacter.id },
    });
    fireEvent.click(screen.getByRole("button", { name: "form.save" }));

    await waitFor(() => expect(onCharactersChange).toHaveBeenCalled());

    const [updatedCharacters] = onCharactersChange.mock.calls[0];
    const updatedCharacter = updatedCharacters.find(
      (character: CombatCharacter) => character.id === deadCharacter.id,
    );

    expect(updatedCharacter.hp).toBe(1);
    expect(updatedCharacter.isDying).toBe(false);
    expect(updatedCharacter.isDead).toBe(false);
    expect(updatedCharacter.deathSaveThrowsLeft).toBe(3);
  });
});
