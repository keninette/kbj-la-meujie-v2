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
import { NpcAttitudeEnum } from "@/app/_lib/enums/npc-attitude.enum";
import EditCharacterForm from "@/app/combat-tracker/_components/edit-character-form/EditCharacterForm";
import AttackForm from "@/app/combat-tracker/_components/attack-form/AttackForm";
import { createCharacterFromWiki } from "@/app/combat-tracker/_lib/bg3-wiki/bg3-wiki.actions";
import CharacterStats from "@/app/combat-tracker/_components/character-stats/CharacterStats";
import {
  buildCharacter,
  buildCombat,
} from "../utils/combat-tracker.test.utils";

// dictionnary.ts uses top-level await, unsupported by Jest's CJS environment.
jest.mock("../../app/_dictionaries/dictionnary", () => ({
  translate: (key: string) => key,
}));

// Never call the real wiki from the tests
jest.mock("../../app/combat-tracker/_lib/bg3-wiki/bg3-wiki.actions", () => ({
  createCharacterFromWiki: jest.fn(),
}));
const mockedCreateFromWiki = jest.mocked(createCharacterFromWiki);

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

  it("round-trips the actions", () => {
    const combat = buildCombat([
      buildCharacter({
        actions: [
          {
            name: "Moonbeam",
            type: "spell",
            costs: ["action", "2"],
            spellLevel: 2,
            damages: [{ dice: "2d10", type: "Radiant" }],
            save: "CON",
            isConcentration: true,
            description: "Call down a beam of light.",
            iconUrl: "https://bg3.wiki/w/images/a/ab/Moonbeam.webp",
            wikiLink: "https://bg3.wiki/wiki/Moonbeam",
          },
          { name: "Dodge", costs: [] },
        ],
      }),
    ]);

    saveCombat(combat);

    expect(loadCombat()).toEqual(combat);
  });

  it.each([
    ["costs is not an array", { name: "Moonbeam", costs: "action" }],
    ["a damage has no dice", { name: "Moonbeam", costs: [], damages: [{}] }],
    ["the name is missing", { costs: [] }],
  ])("returns null when a stored action is invalid: %s", (_, action) => {
    localStorage.setItem(
      "scratchie-combat-tracker",
      JSON.stringify(
        buildCombat([buildCharacter({ actions: [action] } as never)]),
      ),
    );

    expect(loadCombat()).toBeNull();
  });

  it("round-trips the short description, picture and wiki link", () => {
    const combat = buildCombat([
      buildCharacter({
        shortDescription: "Wood elf Druid level 5",
        imageUrl: "https://bg3.wiki/w/images/5/5d/Portrait_Kagha.png",
        wikiLink: "https://bg3.wiki/wiki/Kagha",
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

  it("keeps the NPC attitude, and refuses an unknown one", () => {
    const combat = buildCombat([
      buildCharacter({ isNpc: true, attitude: NpcAttitudeEnum.ENEMY }),
    ]);
    saveCombat(combat);
    expect(loadCombat()?.characters[0].attitude).toBe(NpcAttitudeEnum.ENEMY);

    localStorage.setItem(
      "scratchie-combat-tracker",
      JSON.stringify(
        buildCombat([
          buildCharacter({
            attitude: "grumpy" as unknown as NpcAttitudeEnum,
          }),
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

describe("EditCharacterForm short description", () => {
  it("submits the typed short description", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("shortDescription"), {
      target: { value: "Human Ranger level 4" },
    });
    fireEvent.submit(screen.getByTestId("name").closest("form")!);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ shortDescription: "Human Ranger level 4" }),
    );
  });

  it("prefills the short description of an existing character", () => {
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter({ shortDescription: "Elf Druid" })}
      />,
    );

    expect(screen.getByTestId("shortDescription")).toHaveValue("Elf Druid");
  });
});

describe("EditCharacterForm wiki link", () => {
  it("submits the typed wiki link", async () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("wikiLink"), {
      target: { value: " https://bg3.wiki/wiki/Halsin " },
    });
    fireEvent.submit(screen.getByTestId("name").closest("form")!);

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ wikiLink: "https://bg3.wiki/wiki/Halsin" }),
      ),
    );
  });

  it("prefills the wiki link and removes it when the field is cleared", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter({
          wikiLink: "https://bg3.wiki/wiki/Kagha",
        })}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByTestId("wikiLink")).toHaveValue(
      "https://bg3.wiki/wiki/Kagha",
    );

    fireEvent.change(screen.getByTestId("wikiLink"), {
      target: { value: "" },
    });
    fireEvent.submit(screen.getByTestId("name").closest("form")!);

    expect(onSubmit.mock.calls[0][0].wikiLink).toBeUndefined();
  });
});

describe("EditCharacterForm portrait", () => {
  const submitWith = (character: CombatCharacter) => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm initialCharacter={character} onSubmit={onSubmit} />,
    );
    fireEvent.submit(screen.getByTestId("name").closest("form")!);
    return onSubmit;
  };

  it("saves the picture as typed", () => {
    const onSubmit = submitWith(
      buildCharacter({ imageUrl: "https://example.com/custom.png" }),
    );

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ imageUrl: "https://example.com/custom.png" }),
    );
  });

  it("removes the picture when its field is cleared, even with a wiki link", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter({
          wikiLink: "https://bg3.wiki/wiki/Halsin",
          imageUrl: "https://bg3.wiki/w/images/a/a1/Portrait_Halsin.png",
        })}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("imageUrl"), {
      target: { value: "" },
    });
    fireEvent.submit(screen.getByTestId("name").closest("form")!);

    // Saved right away: the wiki is only called by the import dialog
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0].imageUrl).toBeUndefined();
    expect(mockedCreateFromWiki).not.toHaveBeenCalled();
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
            damages: [{ dice: "2d10", type: "Radiant" }],
            save: "CON",
            isConcentration: true,
          },
        ],
      },
    });
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter()}
        onSubmit={onSubmit}
      />,
    );

    await runImport(false);

    const moonbeam = screen.getByTestId("actions-list-action");
    expect(moonbeam).toHaveTextContent(
      "2d10 Radiant · CON · actions.concentration",
    );
    expect(
      within(moonbeam).getByTestId("action-cost-action"),
    ).toBeInTheDocument();
    expect(
      within(moonbeam).getByTestId("action-cost-spellSlot"),
    ).toHaveTextContent("2");
    expect(
      screen.getByTestId("actions-list-action").closest("fieldset"),
    ).toHaveClass("edit-character-form__fieldset--imported");
    fireEvent.submit(screen.getByTestId("name").closest("form")!);
    expect(onSubmit.mock.calls[0][0].actions).toHaveLength(1);
  });

  it("marks a new character imported from the wiki as an NPC", async () => {
    render(<EditCharacterForm initialCharacter={null} />);
    expect(screen.getByLabelText("form.npc")).not.toBeChecked();

    await runImport(false);

    expect(screen.getByLabelText("form.npc")).toBeChecked();
    expect(screen.getByTestId("name")).toHaveValue("Kagha");
  });

  it("keeps the NPC status of an existing character", async () => {
    render(
      <EditCharacterForm initialCharacter={buildCharacter({ isNpc: false })} />,
    );

    await runImport(true);

    expect(screen.getByLabelText("form.npc")).not.toBeChecked();
  });

  it("lets every field be selected at once, or one by one", () => {
    render(<EditCharacterForm initialCharacter={buildCharacter()} />);
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
    fireEvent.submit(screen.getByTestId("name").closest("form")!);

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

  const lineOf = (testId: string) => screen.getByTestId(testId).closest("div");
  const IMPORTED = "edit-character-form__line--imported";

  it("lists and highlights the fields replaced by the import", async () => {
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter({ name: "My Kagha", ac: 14 })}
      />,
    );

    await runImport(true);

    expect(screen.getByTestId("imported-fields")).toHaveTextContent(
      "form.importedFields",
    );
    expect(lineOf("name")).toHaveClass(IMPORTED);
    expect(lineOf("maxHp")).toHaveClass(IMPORTED);
    expect(lineOf("shortDescription")).toHaveClass(IMPORTED);
    // Same value as before (14): not highlighted
    expect(lineOf("ac")).not.toHaveClass(IMPORTED);
    // Never imported
    expect(lineOf("initiativeScore")).not.toHaveClass(IMPORTED);
  });

  it("removes the highlight of a field edited by hand", async () => {
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter({ name: "My Kagha" })}
      />,
    );

    await runImport(true);
    fireEvent.change(screen.getByTestId("name"), {
      target: { value: "Kagha the Archdruid" },
    });

    expect(lineOf("name")).not.toHaveClass(IMPORTED);
    expect(lineOf("maxHp")).toHaveClass(IMPORTED);
    // The summary still tells what the import did
    expect(screen.getByTestId("imported-fields")).toBeInTheDocument();
  });

  it("says so when the import changed nothing", async () => {
    render(<EditCharacterForm initialCharacter={kaghaFromWiki} />);

    await runImport(true);

    expect(screen.getByTestId("imported-fields")).toHaveTextContent(
      "form.noImportedFields",
    );
  });

  it("shows the portrait next to its field", () => {
    render(<EditCharacterForm initialCharacter={buildCharacter()} />);

    expect(screen.queryByTestId("imageUrl-preview")).not.toBeInTheDocument();

    fireEvent.change(screen.getByTestId("imageUrl"), {
      target: { value: "https://bg3.wiki/w/images/5/5d/Portrait_Kagha.png" },
    });

    expect(screen.getByTestId("imageUrl-preview")).toBeInTheDocument();
  });

  it.each(["https://bg3.wiki/w/images/", "//cdn.example/x.png", "htt"])(
    "does not preview the half-typed URL %s",
    (value) => {
      render(<EditCharacterForm initialCharacter={buildCharacter()} />);

      fireEvent.change(screen.getByTestId("imageUrl"), {
        target: { value },
      });

      expect(screen.queryByTestId("imageUrl-preview")).not.toBeInTheDocument();
    },
  );
});

describe("EditCharacterForm NPC attitude", () => {
  it("is only asked for NPCs, and saved with the character", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter({ isNpc: false })}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.queryByTestId("attitude")).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("form.npc"));
    fireEvent.change(screen.getByTestId("attitude"), {
      target: { value: NpcAttitudeEnum.FRIEND },
    });
    fireEvent.submit(screen.getByTestId("name").closest("form")!);

    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      isNpc: true,
      attitude: NpcAttitudeEnum.FRIEND,
    });
  });

  it("can be left unknown", () => {
    const onSubmit = jest.fn();
    render(
      <EditCharacterForm
        initialCharacter={buildCharacter({
          isNpc: true,
          attitude: NpcAttitudeEnum.ENEMY,
        })}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByTestId("attitude"), {
      target: { value: "" },
    });
    fireEvent.submit(screen.getByTestId("name").closest("form")!);

    expect(onSubmit.mock.calls[0][0].attitude).toBeUndefined();
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

describe("EditCharacterForm actions", () => {
  const submit = () =>
    fireEvent.submit(screen.getByTestId("name").closest("form")!);

  it("keeps a whole character when an action is the first thing added", () => {
    const onSubmit = jest.fn();
    render(<EditCharacterForm initialCharacter={null} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByTestId("actionName"), {
      target: { value: "Dodge" },
    });
    fireEvent.click(screen.getByTestId("addAction"));
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
      within(screen.getAllByTestId("actions-list-action")[0]).getByRole(
        "button",
        {
          name: "form.remove",
        },
      ),
    );
    submit();

    expect(onSubmit.mock.calls[0][0].actions).toEqual([
      { name: "Misty Step", costs: ["bonus", "2"] },
    ]);
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

  it("displays the actions with an icon per cost", () => {
    renderStats(
      buildCharacter({
        actions: [
          {
            name: "Moonbeam",
            costs: ["action", "2"],
            damages: [{ dice: "2d10", type: "Radiant" }],
            isConcentration: true,
            description: "Call down a beam of light.",
          },
          { name: "Lay on Hands", costs: ["action", "layonh:2"] },
          { name: "Misty Step", costs: ["bonus"] },
          { name: "Hellish Rebuke", costs: ["reaction"] },
        ],
      }),
    );

    const [moonbeam, layOnHands, mistyStep, rebuke] = within(
      screen.getByTestId("character-actions"),
    ).getAllByTestId("actions-list-action");

    expect(moonbeam).toHaveTextContent("Moonbeam");
    expect(moonbeam).toHaveTextContent("2d10 Radiant · actions.concentration");
    expect(moonbeam).toHaveAttribute("title", "Call down a beam of light.");
    // An action that also uses a spell slot shows both icons
    expect(
      within(moonbeam).getByTestId("action-cost-action"),
    ).toBeInTheDocument();
    expect(
      within(moonbeam).getByTestId("action-cost-spellSlot"),
    ).toHaveTextContent("2");
    expect(
      within(layOnHands).getByTestId("action-cost-resource"),
    ).toHaveAttribute("title", "layonh ×2");
    expect(
      within(mistyStep).getByTestId("action-cost-bonus"),
    ).toBeInTheDocument();
    expect(
      within(rebuke).getByTestId("action-cost-reaction"),
    ).toBeInTheDocument();
  });

  it("does not display the actions block when there are none", () => {
    renderStats(buildCharacter());

    expect(screen.queryByTestId("character-actions")).not.toBeInTheDocument();
  });

  it("shows the attitude of an NPC only", () => {
    const { unmount } = renderStats(
      buildCharacter({ isNpc: true, attitude: NpcAttitudeEnum.ENEMY }),
    );
    expect(screen.getByTestId("npc-attitude-enemy")).toHaveAttribute(
      "title",
      "attitude.enemy",
    );
    unmount();

    renderStats(
      buildCharacter({ isNpc: false, attitude: NpcAttitudeEnum.ENEMY }),
    );
    expect(screen.queryByTestId("npc-attitude-enemy")).not.toBeInTheDocument();
  });

  it("does not display the passives block when there are none", () => {
    renderStats(buildCharacter());

    expect(screen.queryByTestId("character-passives")).not.toBeInTheDocument();
  });

  it("displays the short description under the name", () => {
    renderStats(buildCharacter({ shortDescription: "Wood elf Druid level 5" }));

    expect(screen.getByTestId("character-short-description")).toHaveTextContent(
      "Wood elf Druid level 5",
    );
  });

  it("does not display the short description when there is none", () => {
    renderStats(buildCharacter());

    expect(
      screen.queryByTestId("character-short-description"),
    ).not.toBeInTheDocument();
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
