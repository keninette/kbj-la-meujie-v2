# CLAUDE.md

## Workflow

- **Almost always get the plan validated before you start coding.** Before you create, edit or delete any file, present a short plan: what you will change, which files you will touch, and the approach you will take. Then wait for my explicit approval. Do not write any code until I have validated the plan.
- If the plan has to change a lot while you are implementing it, stop and ask me to validate the new plan before you go on.
- You don't need to validate review changes since you've already presented the plan in the review report.
- You don't need to validate the plan when it's minor changes I asked for.
- Reading files, searching the codebase and running read-only commands to build the plan is fine without asking.
- **Always review your code before saying it's done**, look for duplicated code or components and make sure files and directories are named following the existing convention.
- **KISS: keep the code as simple as possible**, as long as it respects the best practices and the existing infrastructure. Don't write code that isn't used yet (optional props, options, abstractions "for later"): add it when it's needed. Simple code keeps the app maintainable.
- **Match the solution to the size of the problem.** A small visual adjustment (spacing, alignment, a few pixels) gets a small CSS change: a padding, a margin or a height. No measurement scripts, no values computed from font metrics, no Sass variables or extra wrappers created just for it.
- **Prefer plain values I can adjust by eye** (e.g. `padding-top: 2px`) over calculated ones, unless the value really needs to adapt to something.
- **If a fix needs a long comment to justify it, look for a simpler one first.**
- **For pixel-level tweaks, propose the simple change and let me check it in the browser**, instead of trying to prove it is exact.
- **If I'm asking for design updates, please ask before creating an artefact**. Sometimes it's ok to edit code directly in the page, and even to duplicate a block to allow for several suggestions. Just ask what I prefer.
- **Before saying it's done, run the same checks as the CI**: `npx prettier . --check`, `npm run lint`, `npm run bem-lint`, `npx tsc --noEmit` and `npm run test`. Say which ones fail, if any.
- **Always update README.md and CLAUDE.md after a coding session if necessary, ask before**

## Project

Scratchie: a Next.js (App Router) app for tabletop RPG game masters, in French. It has adventures (stored in Supabase) and a D&D / Baldur's Gate 3 combat tracker (stored in the browser's local storage, with characters imported from bg3.wiki).

## Code structure and naming

- `app/_components/_basics/`: shared components, used across the whole app. **Look here before creating a component**, and extend one rather than duplicating it (see below).
- `app/<feature>/_components/`: components of one feature (e.g. `app/combat-tracker/_components/`). A component used by several components of the feature goes in its own folder at that level (e.g. `hp-bar/`), not inside one of them.
- `app/_lib/`: code shared by the app (types, enums, data access). `app/<feature>/_lib/`: code of one feature.
- One folder per component, in kebab-case, with the component in PascalCase and its styles next to it: `custom-drawer/CustomDrawer.tsx` + `custom-drawer.module.scss`. Sub-components of a component go in its `_components/` folder.
- File suffixes:
  - `.helper.ts`: domain logic as pure functions (turn order, damage, modifiers…).
  - `.parser.ts`: reading external data (the wiki).
  - `.enum.ts`, `.type.ts`, `.dto.ts`, `.entity.ts`, `.repository.ts`, `.service.ts`, `.mapper.ts`.
  - Generic tools that don't know the domain (e.g. `class-names.ts`) have no suffix.
- Path aliases: `@/app/…`, `@lib/…` (`app/_lib`), `@components/…` (`app/_components`).
- **All text shown to the user goes through `translate(key, namespace)`** with its key in `app/_dictionaries/fr/<namespace>.fr.json`. Keys are grouped by feature with a dot (`combatAction.damage`, `stats.hp`). For a count, use `key.one` / `key.other` and pass `count`.
- **Shared components carry their own generic text** in `app/_dictionaries/fr/components.fr.json`, under the component's name (`autocompleteInput.noResult`, `customDialog.close`). The text specific to a page (a label, a title) is passed as a prop.
- Add `data-testid` to the elements the tests need (see Tests).
- Remove dead code and unused imports, variables, classes and translation keys when you see them.

## Shared components

Use them instead of raw HTML elements:

- **Buttons and links**: `ButtonWithIcon` (label + icon, variants `fab` / `secondary` / `tertiary`), `IconButton` (icon only, with a tooltip; `size="small"` to be as high as the text around it), `LinkWithIcon` (colored like the buttons; without a label, it looks like a small `IconButton`), `SubmitButton`, `SplitButton`, `KebabMenu` (⋮ menu of actions and links).
- **Containers**: `ContainerBox` (the card look of panels and fieldsets), `Tile` (titled stat block), `Chip` (small label, with an optional delete button), `DetailedChip` (icon on a dark square, title, optional `titleAdornment`, subtitle, tooltip and delete button: actions and conditions).
- **Forms**: `Fieldset` (titled section, can be highlighted) with its layouts `FieldsetGrid`, `FieldsetRow` and `FieldsetChips`; `TextInput`, `NumberInput` (can be highlighted), `SelectInput`, `CheckboxInput` (label + input; they work with react-hook-form's `register`); `AutocompleteInput` (search input that filters a list of options, each with an optional icon).
- **Overlays**:
  - `CustomDrawer`: side panel with a title and separator, scrollable content, and optional `actions` always visible at the bottom. A form shown in a drawer renders the drawer itself and passes its buttons as `actions`, linked to the `<form>` by its id (`form={formId}`). The parent gives it a `key` that changes on each opening, so the form starts empty every time.
  - `CustomDialog`: centered dialog with a title, a close cross and optional `actions`.
- **Icons**: `FontAwesomeIcon` (Font Awesome kit, web font).

**Never override a shared component's style.** A parent may place it (margin, flex, grid, position) and lay out what it puts inside it, but never change what the component sets itself (height, padding, colors, borders, fonts). If a different look is needed, add a variant to the component (a prop mapped to a BEM modifier, e.g. `isHighlighted`, `size="small"`), or create a new component.

## CSS

- **One CSS module per component** (`*.module.scss`), named after the component. No global classes, no Tailwind.
- **BEM**, checked by `npm run bem-lint`:
  - block = the file's component (`.hp-bar`), element `__name` (`.hp-bar__track`), modifier `--name` (`.hp-bar__fill--temp`);
  - everything in kebab-case, including modifiers built from values in the code (convert `spellSlot` to `spell-slot`);
  - **no element inside an element** (`__line__title`): use a new element (`__line-title`);
  - **no tag selectors** (`.block li`, `.block a`): give the element a class;
  - a modifier class is always applied with its base class: `cx(styles["chip"], styles["chip--empty"])`;
  - **comments are `/* */`, never `//`**: the linter reads plain CSS, so a `//` comment becomes part of the next selector, or breaks the file.
- **Variables: tokens and sys.**
  - `app/variables.token.scss` holds the raw values (`--color-default-blue--primary: #3b5bdb`, `--spacing--xs`, `--radius--s`…). Tokens are only used in `variables.sys.scss`.
  - `app/variables.sys.scss` gives them a meaning (`--color-border--light`, `--spacing-padding--text`, `--radius--field`…). **Components only use sys variables.**
  - When no sys variable fits, add one (and a token if the value is new). No hard-coded colors in components.
  - Existing spacing conventions: `--spacing-padding--button` for the smallest gaps, `--spacing-padding--text` for regular ones, `--spacing-panel` between panels.
- **Mixins** (`app/mixins.scss`) hold the shared patterns: `overlay--*` (drawers and dialogs), `dropdown` / `tooltip` (menus and MUI tooltips), `form-*`, `button*`, `separator`, `scrollbar`, `caption`. Use them, and add one rather than copying a block of styles into a second file.
- `!important` only to override Material UI's styles.
- Small visual tweaks can use plain values (see Workflow).

## Tests

Jest + React Testing Library, in `__tests__/`:

- `components/`: the shared components of `app/_components/_basics`.
- `<feature>/` (e.g. `combat-tracker/`): the feature's component and page tests, with `helpers/` for the `.helper.ts` tests, `parsers/` for the wiki import, and `_fixtures/` for test data (`buildCharacter`, `buildCombat`).

**Write tests for:**

- behaviour: clicks, typing, saving, opening and closing, what gets saved;
- conditional display: whether something is there or not (a button, a section, a warning), and display rules (alternative HP first, death saves instead of HP);
- the main flows of a page, components together (add, edit, play a turn…), not only each component alone with mock callbacks;
- domain rules in helpers (damage, healing, turn order) and parsing of external data, including what the user sees when it fails;
- what protects the data: invalid stored data, imports that fail.

**Don't write tests for:**

- components that only display their props, or basic layout ("shows the title and the content");
- trivial wrappers and one-line functions;
- a rule already tested in a helper: one display case is enough in the component test.

**How:**

- Find elements by `data-testid`, role or label. **Never by class, id or DOM structure** (`querySelector`, `closest`, `parentElement`). Add a test id when needed. `toHaveClass` is fine to check a state (highlighted, color level).
- Mock `translate` (the dictionary uses top-level await, unsupported by Jest); the tests check keys, not French text.
- Group cases of the same rule with `it.each`.
- Name tests after the behaviour, in plain English ("records each action only once").
- jsdom doesn't apply CSS: what only CSS guarantees (visible, not overflowing) can only be checked in the browser.

## Git

- Work on a branch named `feat/<issue>-<description>` (e.g. `feat/25-add-enemy-status`), never directly on `main`.
- Commit messages: `Feat #<issue> - <what changed>`.
- Only commit or push when I ask.
