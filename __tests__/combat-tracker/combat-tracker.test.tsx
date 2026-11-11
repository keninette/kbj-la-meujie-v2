import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { CombatCharacter } from "@lib/types/combat-character.type";
import { NpcAttitudeEnum } from "@/app/_lib/enums/npc-attitude.enum";
import { DamageTypeEnum } from "@/app/_lib/enums/damage-type.enum";
import EditCharacterForm from "@/app/combat-tracker/_components/edit-character-form/EditCharacterForm";
import CombatActionForm from "@/app/combat-tracker/_components/combat-action-form/CombatActionForm";
import { createCharacterFromWiki } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.actions";
import CharacterStats from "@/app/combat-tracker/_components/character-stats/CharacterStats";
import { buildCharacter } from "./_fixtures/combat-tracker.fixtures";

// dictionnary.ts uses top-level await, unsupported by Jest's CJS environment.
// Only Fire Bolt is translated
jest.mock("../../app/_dictionaries/dictionnary", () => ({
  translate: (key: string) => key,
  hasTranslation: (key: string, namespace: string) =>
    namespace === "dndActions" && key.startsWith("fire-bolt."),
}));

// Never call the real wiki from the tests
jest.mock("../../app/combat-tracker/_lib/bg3-wiki/bg3-wiki.actions", () => ({
  createCharacterFromWiki: jest.fn(),
}));
const mockedCreateFromWiki = jest.mocked(createCharacterFromWiki);

// The forms are shown in their own drawer, opened here
const drawerProps = { isOpened: true, onClose: jest.fn(), title: "Drawer" };

describe("EditCharacterForm hp/isDying/isDead behavior", () => {
  it("sets isDying to true and reveals the isDead checkbox when hp is set to 0", () => {
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter()}
      />,
    );

    expect(screen.queryByTestId("isDead")).not.toBeInTheDocument();

    fireEvent.change(screen.getByTestId("hp"), {
      target: { value: "0" },
    });

    expect(screen.getByTestId("isDead")).not.toBeChecked();
  });

  it("clears isDying and forces isDead back to false when hp goes back to 1 or more", () => {
    render(
      <EditCharacterForm
        {...drawerProps}
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
        {...drawerProps}
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

describe("EditCharacterForm fields", () => {
  const renderForm = (character: CombatCharacter) => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={character}
        onSubmit={onSubmit}
      />,
    );
    return onSubmit;
  };
  const type = (testId: string, value: string) =>
    fireEvent.change(screen.getByTestId(testId), {
      target: { name: testId, value },
    });
  const addItem = (inputId: string, value: string) => {
    type(inputId, value);
    fireEvent.click(screen.getByTestId(`${inputId}-add-button`));
  };

  it("saves every typed field, trimmed, ignoring blank list items", () => {
    const onSubmit = renderForm(buildCharacter());

    type("shortDescription", "Human Ranger level 4");
    type("wikiLink", " https://bg3.wiki/wiki/Halsin ");
    type("imageUrl", "https://example.com/custom.png");
    addItem("passiveName", "   ");
    addItem("passiveName", "  Rage  ");
    addItem("usableObjectName", "  Potion  ");
    type("movement", "7.5");
    // A decimal movement, e.g. of a dwarf, is a valid value
    expect(screen.getByTestId("movement")).toBeValid();
    type("proficiencyBonus", "3");
    type("abilityScore-dex", "16");
    type("savingThrow-wis", "6");
    fireEvent.submit(screen.getByTestId("edit-character-form"));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        shortDescription: "Human Ranger level 4",
        wikiLink: "https://bg3.wiki/wiki/Halsin",
        imageUrl: "https://example.com/custom.png",
        passives: ["Rage"],
        usableObjects: ["Potion"],
        movement: 7.5,
        proficiencyBonus: 3,
        abilities: { dex: 16 },
        savingThrows: { wis: 6 },
        // The new dexterity gives the initiative bonus: 12 + 3
        initiativeScore: 15,
      }),
    );
  });

  it("removes a value when its field is cleared or its item removed", () => {
    const onSubmit = renderForm(
      buildCharacter({
        wikiLink: "https://bg3.wiki/wiki/Halsin",
        imageUrl: "https://bg3.wiki/w/images/a/a1/Portrait_Halsin.png",
        movement: 9,
        abilities: { str: 10, dex: 16 },
        savingThrows: { dex: 5 },
        passives: ["Rage", "Fury"],
      }),
    );

    type("wikiLink", "");
    type("imageUrl", "");
    type("movement", "");
    type("abilityScore-dex", "");
    type("savingThrow-dex", "");
    fireEvent.click(
      within(screen.getByTestId("passiveName-item-0")).getByRole("button"),
    );
    fireEvent.submit(screen.getByTestId("edit-character-form"));

    // Saved right away: the wiki is only called by the import dialog
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(mockedCreateFromWiki).not.toHaveBeenCalled();
    const saved = onSubmit.mock.calls[0][0];
    expect(saved.wikiLink).toBeUndefined();
    expect(saved.imageUrl).toBeUndefined();
    expect(saved.movement).toBeUndefined();
    expect(saved.abilities).toEqual({ str: 10 });
    expect(saved.savingThrows).toBeUndefined();
    expect(saved.passives).toEqual(["Fury"]);
    // No dexterity, no initiative bonus anymore
    expect(saved.initiativeScore).toBe(12);
  });
});

describe("EditCharacterForm import from wiki", () => {
  const kaghaFromWiki = buildCharacter({
    id: "wiki-id",
    name: "Kagha",
    shortDescription: "Wood elf Druid level 5",
    imageUrl: "https://bg3.wiki/w/images/5/5d/Portrait_Kagha.png",
    wikiLink: "https://bg3.wiki/wiki/Kagha",
    hp: 84,
    maxHp: 84,
    ac: 14,
    isNpc: true,
    initiativeScore: 0,
    initiativeRoll: 0,
  });

  beforeEach(() => {
    mockedCreateFromWiki.mockResolvedValue({ character: kaghaFromWiki });
  });

  afterEach(() => {
    mockedCreateFromWiki.mockReset();
  });

  const openImport = () => {
    fireEvent.click(
      screen.getByRole("button", { name: "form.importFromWiki" }),
    );
    return screen.getByTestId("wiki-url");
  };

  /** override: true = every field, false = none, or a list of field ids */
  const runImport = async (override: boolean | string[]) => {
    openImport();
    if (override === true) {
      fireEvent.click(screen.getByTestId("wiki-override-all"));
    } else if (Array.isArray(override)) {
      override.forEach((field) =>
        fireEvent.click(screen.getByTestId(`wiki-override-${field}`)),
      );
    }
    fireEvent.click(screen.getByRole("button", { name: "wiki.import" }));
    await waitFor(() =>
      expect(screen.queryByTestId("wiki-url")).not.toBeInTheDocument(),
    );
  };

  it("pre-fills the URL from the character's name, editable", () => {
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter({ name: "Kagha" })}
      />,
    );

    const urlInput = openImport();
    expect(urlInput).toHaveValue("https://bg3.wiki/wiki/Kagha");

    fireEvent.change(urlInput, {
      target: { value: "https://bg3.wiki/wiki/Halsin" },
    });
    expect(urlInput).toHaveValue("https://bg3.wiki/wiki/Halsin");
  });

  it("pre-fills the URL with the wiki link when there is one", () => {
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter({
          name: "Archdruid",
          wikiLink: "https://bg3.wiki/wiki/Kagha",
        })}
      />,
    );

    expect(openImport()).toHaveValue("https://bg3.wiki/wiki/Kagha");
  });

  it("only fills empty fields by default, without saving", async () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter({ name: "My Kagha", ac: 16 })}
        onSubmit={onSubmit}
      />,
    );

    await runImport(false);

    expect(mockedCreateFromWiki).toHaveBeenCalledWith(
      "https://bg3.wiki/wiki/My_Kagha",
    );
    expect(screen.getByTestId("name")).toHaveValue("My Kagha");
    expect(screen.getByLabelText("form.ac")).toHaveValue(16);
    expect(screen.getByTestId("shortDescription")).toHaveValue(
      "Wood elf Druid level 5",
    );
    expect(screen.getByTestId("wikiLink")).toHaveValue(
      "https://bg3.wiki/wiki/Kagha",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("fills the actions from the wiki and lists them with their details", async () => {
    mockedCreateFromWiki.mockResolvedValueOnce({
      character: {
        ...kaghaFromWiki,
        actions: [
          {
            name: "Moonbeam",
            costs: ["action", "2"],
            damages: [{ dice: "2d10", type: DamageTypeEnum.RADIANT }],
            save: "CON",
            isConcentration: true,
          },
        ],
      },
    });
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter()}
        onSubmit={onSubmit}
      />,
    );

    await runImport(false);

    const moonbeam = screen.getByTestId("action-chip");
    expect(moonbeam).toHaveTextContent(
      "2d10 damageType.radiant · CON · actions.concentration",
    );
    expect(
      within(moonbeam).getByTestId("action-cost-action"),
    ).toBeInTheDocument();
    expect(
      within(moonbeam).getByTestId("action-cost-actionResource"),
    ).toHaveTextContent("2");
    expect(screen.getByTestId("actions-fieldset")).toHaveClass(
      "container-box--highlighted",
    );
    fireEvent.submit(screen.getByTestId("edit-character-form"));
    expect(onSubmit.mock.calls[0][0].actions).toHaveLength(1);
  });

  it("marks a new character imported from the wiki as an NPC", async () => {
    render(<EditCharacterForm {...drawerProps} initialCharacter={null} />);
    expect(screen.getByLabelText("form.npc")).not.toBeChecked();

    await runImport(false);

    expect(screen.getByLabelText("form.npc")).toBeChecked();
    expect(screen.getByTestId("name")).toHaveValue("Kagha");
  });

  it("keeps the NPC status of an existing character", async () => {
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter({ isNpc: false })}
      />,
    );

    await runImport(true);

    expect(screen.getByLabelText("form.npc")).not.toBeChecked();
  });

  it("lets every field be selected at once, or one by one", () => {
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter()}
      />,
    );
    openImport();

    const all = screen.getByTestId("wiki-override-all");
    const name = screen.getByTestId("wiki-override-name");
    const ac = screen.getByTestId("wiki-override-ac");
    expect(name).not.toBeChecked();

    fireEvent.click(all);
    expect(name).toBeChecked();
    expect(ac).toBeChecked();

    fireEvent.click(ac);
    expect(ac).not.toBeChecked();
    expect(all).not.toBeChecked();

    fireEvent.click(ac);
    expect(all).toBeChecked();

    fireEvent.click(all);
    expect(name).not.toBeChecked();
  });

  it("only replaces the fields selected in the dialog", async () => {
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter({ name: "My Kagha", ac: 16 })}
      />,
    );

    await runImport(["name"]);

    expect(screen.getByTestId("name")).toHaveValue("Kagha");
    expect(screen.getByLabelText("form.ac")).toHaveValue(16);
    // Not selected but empty before: filled anyway
    expect(screen.getByTestId("shortDescription")).toHaveValue(
      "Wood elf Druid level 5",
    );
  });

  it("replaces existing values when asked, and fields stay editable", async () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter({ name: "My Kagha", ac: 16 })}
        onSubmit={onSubmit}
      />,
    );

    await runImport(true);

    expect(screen.getByTestId("name")).toHaveValue("Kagha");
    expect(screen.getByLabelText("form.ac")).toHaveValue(14);
    expect(screen.getByTestId("maxHp")).toHaveValue(84);

    fireEvent.change(screen.getByTestId("name"), {
      target: { value: "Kagha the Archdruid" },
    });
    fireEvent.submit(screen.getByTestId("edit-character-form"));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Kagha the Archdruid",
          ac: 14,
          initiativeScore: 12,
          isNpc: false,
        }),
      ),
    );
  });

  const lineOf = (testId: string) => screen.getByTestId(`${testId}-field`);
  // The name is a text input, the other fields number inputs
  const HIGHLIGHTED_TEXT = "text-input--highlighted";
  const HIGHLIGHTED = "number-input--highlighted";

  it("lists and highlights the replaced fields, until they are edited", async () => {
    mockedCreateFromWiki.mockResolvedValueOnce({
      character: { ...kaghaFromWiki, movement: 9, abilities: { dex: 16 } },
    });
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter({ name: "My Kagha", ac: 14 })}
      />,
    );

    await runImport(true);

    const abilitiesFieldset = screen.getByTestId("abilities-fieldset");
    expect(screen.getByTestId("imported-fields")).toHaveTextContent(
      "form.importedFields",
    );
    expect(lineOf("name")).toHaveClass(HIGHLIGHTED_TEXT);
    expect(lineOf("maxHp")).toHaveClass(HIGHLIGHTED);
    expect(lineOf("movement")).toHaveClass(HIGHLIGHTED);
    expect(abilitiesFieldset).toHaveClass("container-box--highlighted");
    // Same value as before (14): not highlighted
    expect(lineOf("ac")).not.toHaveClass(HIGHLIGHTED);
    // Never imported
    expect(lineOf("initiativeRoll")).not.toHaveClass(HIGHLIGHTED);

    fireEvent.change(screen.getByTestId("name"), {
      target: { value: "Kagha the Archdruid" },
    });
    fireEvent.change(screen.getByTestId("movement"), {
      target: { name: "movement", value: "6" },
    });
    fireEvent.change(screen.getByTestId("abilityScore-dex"), {
      target: { value: "14" },
    });

    expect(lineOf("name")).not.toHaveClass(HIGHLIGHTED_TEXT);
    expect(lineOf("movement")).not.toHaveClass(HIGHLIGHTED);
    expect(abilitiesFieldset).not.toHaveClass("container-box--highlighted");
    // The fields not edited, and the summary, stay
    expect(lineOf("maxHp")).toHaveClass(HIGHLIGHTED);
    expect(screen.getByTestId("imported-fields")).toBeInTheDocument();
  });

  it("says so when the import changed nothing", async () => {
    render(
      <EditCharacterForm {...drawerProps} initialCharacter={kaghaFromWiki} />,
    );

    await runImport(true);

    expect(screen.getByTestId("imported-fields")).toHaveTextContent(
      "form.noImportedFields",
    );
  });
});

describe("EditCharacterForm NPC attitude", () => {
  it("is only asked for NPCs, and saved with the character", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter({ isNpc: false })}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.queryByTestId("attitude")).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("form.npc"));
    fireEvent.change(screen.getByTestId("attitude"), {
      target: { value: NpcAttitudeEnum.FRIEND },
    });
    fireEvent.submit(screen.getByTestId("edit-character-form"));

    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      isNpc: true,
      attitude: NpcAttitudeEnum.FRIEND,
    });
  });
});

describe("EditCharacterForm conditions", () => {
  it("shows the existing conditions and removes one", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter({
          conditions: [
            {
              id: "s1",
              name: "Poisoned",
              numberOfTurns: 2,
              saveThrowStat: "CON",
              saveThrowDc: 13,
            },
            { id: "s2", name: "Blessed" },
          ],
        })}
        onSubmit={onSubmit}
      />,
    );

    const [poisoned] = screen.getAllByTestId("condition-item");
    expect(poisoned).toHaveTextContent("Poisoned");
    expect(poisoned).toHaveTextContent(
      "stats.conditionDuration · CON stats.saveDc 13",
    );
    fireEvent.click(within(poisoned).getByRole("button"));
    fireEvent.submit(screen.getByTestId("edit-character-form"));

    expect(onSubmit.mock.calls[0][0].conditions).toEqual([
      { id: "s2", name: "Blessed" },
    ]);
  });

  it("adds a condition by name, with an id", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("conditionName"), {
      target: { value: "  Hasted  " },
    });
    fireEvent.click(screen.getByTestId("addCondition"));
    fireEvent.submit(screen.getByTestId("edit-character-form"));

    expect(onSubmit.mock.calls[0][0].conditions).toEqual([
      { id: expect.any(String), name: "Hasted" },
    ]);
  });

  it("adds a condition with its duration and saving throw", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("conditionName"), {
      target: { value: "Poisoned" },
    });
    fireEvent.change(screen.getByTestId("conditionDuration"), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByTestId("conditionSaveThrowStat"), {
      target: { value: " CON " },
    });
    fireEvent.change(screen.getByTestId("conditionSaveThrowDc"), {
      target: { value: "13" },
    });
    fireEvent.click(screen.getByTestId("addCondition"));

    // The fields are cleared for the next one
    expect(screen.getByTestId("conditionDuration")).toHaveValue(null);
    expect(screen.getByTestId("conditionSaveThrowStat")).toHaveValue("");
    fireEvent.submit(screen.getByTestId("edit-character-form"));

    expect(onSubmit.mock.calls[0][0].conditions).toEqual([
      {
        id: expect.any(String),
        name: "Poisoned",
        numberOfTurns: 3,
        saveThrowStat: "CON",
        saveThrowDc: 13,
      },
    ]);
  });

  it("stores the turn the condition was applied on during a combat", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter()}
        onSubmit={onSubmit}
        currentTurn={4}
      />,
    );

    fireEvent.change(screen.getByTestId("conditionName"), {
      target: { value: "Blessed" },
    });
    fireEvent.change(screen.getByTestId("conditionDuration"), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByTestId("addCondition"));
    fireEvent.submit(screen.getByTestId("edit-character-form"));

    expect(onSubmit.mock.calls[0][0].conditions).toEqual([
      {
        id: expect.any(String),
        name: "Blessed",
        numberOfTurns: 2,
        appliedOnTurn: 4,
      },
    ]);
  });
});

describe("EditCharacterForm actions", () => {
  const submit = () =>
    fireEvent.submit(screen.getByTestId("edit-character-form"));

  it("keeps a whole character when an action is the first thing added", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={null}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("actionName"), {
      target: { value: "Dodge" },
    });
    fireEvent.click(screen.getByTestId("addAction"));
    fireEvent.change(screen.getByTestId("initiativeRoll"), {
      target: { name: "initiativeRoll", value: "10" },
    });
    submit();

    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      id: expect.any(String),
      hp: expect.any(Number),
      actions: [{ name: "Dodge", costs: [] }],
    });
  });

  it("adds an action by name, without details", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("actionName"), {
      target: { value: "  Dodge  " },
    });
    fireEvent.click(screen.getByTestId("addAction"));
    submit();

    expect(onSubmit.mock.calls[0][0].actions).toEqual([
      { name: "Dodge", costs: [] },
    ]);
  });

  it("ignores a blank name and removes an existing action", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter({
          actions: [
            { name: "Moonbeam", costs: ["action", "2"] },
            { name: "Misty Step", costs: ["bonus", "2"] },
          ],
        })}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("actionName"), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByTestId("addAction"));
    fireEvent.click(
      within(screen.getAllByTestId("action-chip")[0]).getByRole("button", {
        name: "form.remove",
      }),
    );
    submit();

    expect(onSubmit.mock.calls[0][0].actions).toEqual([
      { name: "Misty Step", costs: ["bonus", "2"] },
    ]);
  });
});

describe("CharacterStats action tooltip and short description", () => {
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

  it("shows the description of an action in its tooltip", async () => {
    renderStats(
      buildCharacter({
        actions: [
          {
            name: "Moonbeam",
            costs: ["action", "2"],
            description: "Call down a beam of light.",
          },
        ],
      }),
    );

    fireEvent.mouseOver(screen.getByTestId("action-chip"));

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Call down a beam of light.",
    );
  });

  it("shows a translated action in french, and its english description on demand", async () => {
    renderStats(
      buildCharacter({
        actions: [
          {
            name: "Fire Bolt",
            costs: ["action"],
            description: "Hurl a mote of fire.",
            wikiLink: "https://bg3.wiki/wiki/Fire_Bolt",
          },
        ],
      }),
    );

    expect(screen.getByTestId("action-chip")).toHaveTextContent(
      "fire-bolt.name",
    );
    fireEvent.mouseOver(screen.getByTestId("action-chip"));
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Fire Bolt");
    expect(tooltip).toHaveTextContent("fire-bolt.description");

    fireEvent.click(within(tooltip).getByTestId("language-switch"));

    expect(tooltip).toHaveTextContent("Hurl a mote of fire.");
  });

  it("does not display the short description when there is none", () => {
    renderStats(buildCharacter());

    expect(
      screen.queryByTestId("character-short-description"),
    ).not.toBeInTheDocument();
  });
});

describe("CharacterStats conditions", () => {
  const renderStats = (character: CombatCharacter) => {
    const onCharacterChange = jest.fn();
    const onHistoryEdited = jest.fn();
    const result = render(
      <CharacterStats
        selectedCharacter={character}
        characters={[character]}
        onCharacterChange={onCharacterChange}
        onCharactersChange={jest.fn()}
        onHistoryEdited={onHistoryEdited}
        isCombatOngoing={false}
      />,
    );
    return { ...result, onCharacterChange, onHistoryEdited };
  };

  it("displays no conditions section when there are none", () => {
    renderStats(buildCharacter({ conditions: [] }));

    expect(
      screen.queryByTestId("character-conditions"),
    ).not.toBeInTheDocument();
  });

  it("removes a condition from its chip and logs it in the history", () => {
    const character = buildCharacter({
      name: "Goblin",
      conditions: [
        { id: "s1", name: "Poisoned" },
        { id: "s2", name: "Prone" },
      ],
    });
    const { onCharacterChange, onHistoryEdited } = renderStats(character);

    fireEvent.click(
      within(screen.getByTestId("condition-s1")).getByRole("button", {
        name: "form.remove",
      }),
    );

    expect(onCharacterChange).toHaveBeenCalledWith(
      expect.objectContaining({ conditions: [{ id: "s2", name: "Prone" }] }),
    );
    expect(onHistoryEdited).toHaveBeenCalledWith(["history.removeCondition"]);
  });
});

describe("EditCharacterForm action resources", () => {
  it("adds an action resource by its id, however it is written", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("actionResourceName"), {
      target: { value: " Rage " },
    });
    fireEvent.change(screen.getByLabelText("form.value"), {
      target: { value: "4" },
    });
    fireEvent.click(screen.getByTestId("addActionResource"));
    fireEvent.submit(screen.getByTestId("edit-character-form"));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ actionResourcesLeft: { rage: 4 } }),
    );
  });

  it("adds an action resource on Enter, without submitting the form", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("actionResourceName"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("actionResourceValue"), {
      target: { value: "3" },
    });
    fireEvent.keyDown(screen.getByTestId("actionResourceValue"), {
      key: "Enter",
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId("actionResourceName")).toHaveValue("");

    fireEvent.submit(screen.getByTestId("edit-character-form"));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ actionResourcesLeft: { 1: 3 } }),
    );
  });
});

describe("CombatActionForm isDying/isDead behavior", () => {
  it("submits registered spell and timed-condition values", async () => {
    const attacker = buildCharacter({
      id: "attacker",
      name: "Attacker",
      actionResourcesLeft: { 1: 2 },
    });
    const target = buildCharacter({ id: "target", name: "Target" });
    const onCharactersChange = jest.fn();

    render(
      <CombatActionForm
        {...drawerProps}
        characters={[attacker, target]}
        selectedCharacter={attacker}
        onCharactersChange={onCharactersChange}
        onHistoryEdited={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("form.nameOrLevel"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("inflictedConditionTargetName"), {
      target: { value: target.id },
    });
    fireEvent.change(screen.getByTestId("conditionName"), {
      target: { value: "Restrained" },
    });
    fireEvent.change(screen.getByLabelText("combatAction.duration"), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "form.save" }));

    await waitFor(() => expect(onCharactersChange).toHaveBeenCalled());

    const [updatedCharacters] = onCharactersChange.mock.calls[0];
    expect(
      updatedCharacters.find(
        (character: CombatCharacter) => character.id === attacker.id,
      ).actionResourcesLeft[1],
    ).toBe(1);
    expect(
      updatedCharacters.find(
        (character: CombatCharacter) => character.id === target.id,
      ).conditions[0],
    ).toMatchObject({ name: "Restrained", numberOfTurns: 2 });
  });

  it("records an attack from registered inputs before saving", async () => {
    const attacker = buildCharacter({ id: "attacker", name: "Attacker" });
    const target = buildCharacter({ id: "target", name: "Target", hp: 5 });
    const onHistoryEdited = jest.fn();

    render(
      <CombatActionForm
        {...drawerProps}
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
      screen.getAllByRole("button", { name: "combatAction.validate" })[0],
    );

    expect(screen.getByText("history.attack")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "form.save" }));

    await waitFor(() => {
      expect(onHistoryEdited).toHaveBeenCalledWith(["history.attack"]);
    });
  });

  it("records each action only once", () => {
    const attacker = buildCharacter({ id: "attacker", name: "Attacker" });
    const target = buildCharacter({ id: "target", name: "Target" });
    render(
      <CombatActionForm
        {...drawerProps}
        characters={[attacker, target]}
        selectedCharacter={attacker}
        onCharactersChange={jest.fn()}
        onHistoryEdited={jest.fn()}
      />,
    );
    const validateAttack = () =>
      screen.getAllByRole("button", { name: "combatAction.validate" })[0];

    fireEvent.change(screen.getByTestId("targetName"), {
      target: { value: target.id },
    });
    fireEvent.change(screen.getByTestId("attackDamage"), {
      target: { value: "3" },
    });
    fireEvent.click(validateAttack());

    expect(validateAttack()).toBeDisabled();
    expect(screen.getAllByText("history.attack")).toHaveLength(1);
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
      <CombatActionForm
        {...drawerProps}
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
      screen.getAllByRole("button", { name: "combatAction.validate" })[1],
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
      <CombatActionForm
        {...drawerProps}
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
      <CombatActionForm
        {...drawerProps}
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
      <CombatActionForm
        {...drawerProps}
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
      <CombatActionForm
        {...drawerProps}
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

describe("EditCharacterForm save and restart", () => {
  it("is hidden when the parent does not handle it", () => {
    render(<EditCharacterForm {...drawerProps} initialCharacter={null} />);

    expect(screen.queryByTestId("save-and-restart")).not.toBeInTheDocument();
  });

  it("saves the character, then empties the form for the next one", () => {
    const onSubmit = jest.fn();
    const onSaveAndRestart = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={null}
        onSubmit={onSubmit}
        onSaveAndRestart={onSaveAndRestart}
      />,
    );

    const fillCharacter = (name: string) => {
      fireEvent.change(screen.getByTestId("name"), {
        target: { name: "name", value: name },
      });
      fireEvent.change(screen.getByTestId("maxHp"), {
        target: { name: "maxHp", value: "7" },
      });
      fireEvent.change(screen.getByTestId("initiativeRoll"), {
        target: { name: "initiativeRoll", value: "10" },
      });
    };

    fillCharacter("Goblin");
    fireEvent.change(screen.getByTestId("passiveName"), {
      target: { value: "Unsaved draft" },
    });
    fireEvent.click(screen.getByTestId("save-and-restart"));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onSaveAndRestart).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Goblin" }),
    );
    expect(screen.getByTestId("name")).toHaveValue("");
    expect(screen.getByTestId("passiveName")).toHaveValue("");

    fillCharacter("Goblin 2");
    fireEvent.click(screen.getByTestId("save-and-restart"));

    const [first, second] = onSaveAndRestart.mock.calls.map(([c]) => c);
    expect(second.name).toBe("Goblin 2");
    expect(second.id).not.toBe(first.id);
  });

  it("is blocked by the same checks as the save button", () => {
    const onSaveAndRestart = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={null}
        onSaveAndRestart={onSaveAndRestart}
      />,
    );

    // Max HP stays at 0, under its minimum of 1
    fireEvent.change(screen.getByTestId("name"), {
      target: { name: "name", value: "Goblin" },
    });
    fireEvent.click(screen.getByTestId("save-and-restart"));

    expect(onSaveAndRestart).not.toHaveBeenCalled();
    expect(screen.getByTestId("name")).toHaveValue("Goblin");
  });

  it("is not blocked by a condition or action resource that was never added", () => {
    const onSaveAndRestart = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter({ maxHp: 7 })}
        onSaveAndRestart={onSaveAndRestart}
      />,
    );

    // Invalid drafts, left without clicking "Add"
    fireEvent.change(screen.getByTestId("conditionDuration"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByTestId("actionResourceValue"), {
      target: { value: "-1" },
    });
    fireEvent.click(screen.getByTestId("save-and-restart"));

    expect(onSaveAndRestart).toHaveBeenCalledTimes(1);
    const [saved] = onSaveAndRestart.mock.calls[0];
    expect(saved.conditions ?? []).toEqual([]);
    expect(saved.actionResourcesLeft ?? {}).toEqual({});
  });

  it("does nothing when the form is empty", () => {
    const onSaveAndRestart = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={null}
        onSaveAndRestart={onSaveAndRestart}
      />,
    );

    fireEvent.click(screen.getByTestId("save-and-restart"));

    expect(onSaveAndRestart).not.toHaveBeenCalled();
  });
});

describe("EditCharacterForm initiative", () => {
  const submit = () =>
    fireEvent.submit(screen.getByTestId("edit-character-form"));
  const enterRoll = (value: string) =>
    fireEvent.change(screen.getByTestId("initiativeRoll"), {
      target: { name: "initiativeRoll", value },
    });

  it("saves the roll plus the dexterity modifier as initiative", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter({ abilities: { dex: 16 } })}
        onSubmit={onSubmit}
      />,
    );

    enterRoll("14");
    submit();

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ initiativeRoll: 14, initiativeScore: 17 }),
    );
  });

  it("saves the roll as initiative without dexterity", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter()}
        onSubmit={onSubmit}
      />,
    );

    enterRoll("9");
    submit();

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ initiativeRoll: 9, initiativeScore: 9 }),
    );
  });

  it("shows the saved roll, not the initiative, when editing again", () => {
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter({
          abilities: { dex: 16 },
          initiativeRoll: 14,
          initiativeScore: 17,
        })}
      />,
    );

    expect(screen.getByTestId("initiativeRoll")).toHaveValue(14);
  });

  it("reminds to roll the initiative, then saves anyway on confirm", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={null}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("name"), {
      target: { name: "name", value: "Goblin" },
    });
    submit();

    expect(screen.getByTestId("initiative-reminder")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("initiative-reminder-confirm"));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Goblin",
        initiativeRoll: 0,
        initiativeScore: 0,
      }),
    );
  });

  it("goes back to the roll field without saving", async () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={buildCharacter({ initiativeRoll: 0 })}
        onSubmit={onSubmit}
      />,
    );

    submit();
    fireEvent.click(screen.getByTestId("initiative-reminder-back"));

    expect(onSubmit).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByTestId("initiativeRoll")).toHaveFocus(),
    );
  });

  it("reminds to roll the initiative on save and restart too", () => {
    const onSaveAndRestart = jest.fn();
    render(
      <EditCharacterForm
        {...drawerProps}
        initialCharacter={null}
        onSaveAndRestart={onSaveAndRestart}
      />,
    );

    fireEvent.change(screen.getByTestId("name"), {
      target: { name: "name", value: "Goblin" },
    });
    // Max HP is required by the form, before the reminder
    fireEvent.change(screen.getByTestId("maxHp"), {
      target: { name: "maxHp", value: "7" },
    });
    fireEvent.click(screen.getByTestId("save-and-restart"));

    expect(onSaveAndRestart).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("initiative-reminder-confirm"));
    expect(onSaveAndRestart).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Goblin" }),
    );
    expect(screen.getByTestId("name")).toHaveValue("");
  });
});

describe("CharacterStats death saves", () => {
  const renderStats = (character: CombatCharacter, isCombatOngoing = true) => {
    const onCharacterChange = jest.fn();
    render(
      <CharacterStats
        selectedCharacter={character}
        characters={[character]}
        onCharacterChange={onCharacterChange}
        onCharactersChange={jest.fn()}
        onHistoryEdited={jest.fn()}
        isCombatOngoing={isCombatOngoing}
      />,
    );
    return onCharacterChange;
  };
  const dying = (deathSaveThrowsLeft: number) =>
    buildCharacter({ hp: 0, isDying: true, deathSaveThrowsLeft });

  it("shows the death saves instead of the hit points of a downed character", () => {
    renderStats(dying(2));

    expect(screen.queryByTestId("hp-bar")).not.toBeInTheDocument();
    const track = screen.getByTestId("death-saves");
    expect(within(track).getAllByTestId("death-save-success")).toHaveLength(1);
    // The next save, then the last one
    expect(within(track).getByTestId("death-save-next")).toBeInTheDocument();
    expect(within(track).getAllByTestId("death-save-left")).toHaveLength(1);
    expect(track).toHaveAttribute("aria-label", "stats.deathSavesLeft");
  });

  it("shows the hit points of a character who is not down", () => {
    renderStats(buildCharacter());

    expect(screen.getByTestId("hp-bar")).toBeInTheDocument();
    expect(screen.queryByTestId("death-saves")).not.toBeInTheDocument();
  });

  it("records death saves during the combat only", () => {
    renderStats(dying(3), false);

    expect(screen.getAllByTestId("death-save-left")).toHaveLength(3);
    expect(screen.queryByTestId("death-save-next")).not.toBeInTheDocument();
  });

  it("asks whether the next death save succeeded, then records a success", () => {
    const onCharacterChange = renderStats(dying(3));

    expect(
      screen.queryByTestId("death-save-choice-success"),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("death-save-next"));
    fireEvent.click(screen.getByTestId("death-save-choice-success"));

    expect(onCharacterChange).toHaveBeenCalledWith(
      expect.objectContaining({ deathSaveThrowsLeft: 2, isDying: true }),
    );
  });

  it("makes the character dead on the first failed death save", () => {
    const onCharacterChange = renderStats(dying(3));

    fireEvent.click(screen.getByTestId("death-save-next"));
    fireEvent.click(screen.getByTestId("death-save-choice-fail"));

    expect(onCharacterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        isDead: true,
        isDying: false,
        deathSaveThrowsLeft: 3,
      }),
    );
  });

  it("closes the choice when another downed character is selected", () => {
    const props = {
      onCharacterChange: jest.fn(),
      onCharactersChange: jest.fn(),
      onHistoryEdited: jest.fn(),
      isCombatOngoing: true,
    };
    const first = { ...dying(3), id: "first" };
    const second = { ...dying(3), id: "second" };
    const { rerender } = render(
      <CharacterStats selectedCharacter={first} {...props} />,
    );

    fireEvent.click(screen.getByTestId("death-save-next"));
    expect(screen.getByTestId("death-save-choice-fail")).toBeInTheDocument();

    rerender(<CharacterStats selectedCharacter={second} {...props} />);

    expect(
      screen.queryByTestId("death-save-choice-fail"),
    ).not.toBeInTheDocument();
  });

  it("has nothing left to record after three successes", () => {
    renderStats(dying(0));

    expect(screen.getAllByTestId("death-save-success")).toHaveLength(3);
    expect(screen.queryByTestId("death-save-next")).not.toBeInTheDocument();
  });
});
