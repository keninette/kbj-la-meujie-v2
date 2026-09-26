import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { findCharacterIndexById } from "@lib/combat/combat.helper";
import {
  loadCombat,
  saveCombat,
} from "@/app/combat-tracker/_lib/local-storage";
import { CombatCharacter } from "@lib/types/combat-character.type";
import EditCharacterForm from "@/app/combat-tracker/_components/edit-character-form/EditCharacterForm";
import AttackForm from "@/app/combat-tracker/_components/attack-form/AttackForm";
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
    const combat = buildCombat([buildCharacter()]);

    saveCombat(combat);

    expect(loadCombat()).toEqual(combat);
  });

  it("returns null when the stored payload is malformed", () => {
    localStorage.setItem(
      "scratchie-combat-tracker",
      JSON.stringify({ status: "unknown-status" }),
    );

    expect(loadCombat()).toBeNull();
  });

  it("returns null when the stored payload is not valid JSON", () => {
    localStorage.setItem("scratchie-combat-tracker", "not-json");

    expect(loadCombat()).toBeNull();
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

    fireEvent.change(screen.getByLabelText("form.level"), {
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
