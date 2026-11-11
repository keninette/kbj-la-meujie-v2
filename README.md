Scratchie is a [Next.js](https://nextjs.org) application for tabletop RPG game masters, in French:

- **Adventures**: create and edit your adventures, stored in Supabase.
- **Combat tracker**: run a D&D / Baldur's Gate 3 fight, with characters imported from [bg3.wiki](https://bg3.wiki). The combat is kept in the browser's local storage. How the import works, and what to look out for when changing it: [app/combat-tracker/\_lib/bg3-wiki/README.md](app/combat-tracker/_lib/bg3-wiki/README.md).

Stack: Next.js (App Router), React, TypeScript, Sass modules, Material UI (drawers, dialogs, menus), react-hook-form, Supabase, Jest + React Testing Library.

## Getting Started

First, run the development server:

```bash
npm run dev
```

If needed, you can run the equivalent command with Yarn, pnpm, or Bun.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Common commands

```bash
npm run dev         # Dev server (suppressed baseline warning)
npm run dev:raw     # Dev server (unsuppressed warning)
npm run build       # Production build (suppressed baseline warning)
npm run build:raw   # Production build (unsuppressed warning)
npm run start       # Production server (suppressed baseline warning)
npm run start:raw   # Production server (unsuppressed warning)
npm run lint        # ESLint
npm run bem-lint    # Checks the BEM naming of the CSS classes
npm run prettify    # Formats every file with Prettier
npm run test        # Jest
npm run scripts:list
```

## Project structure

```
app/
  _components/
    _basics/         Shared components: buttons, chips, fieldsets and inputs, drawer, dialog, menus…
  _dictionaries/fr/  Translations, one JSON file per namespace
  _lib/              Shared types, enums and data access (Supabase repositories and services)
  adventures/        Pages, with their dedicated components and logic
  mixins.scss        Shared style patterns
  variables.token.scss  Raw design values (colors, spacings, sizes…)
  variables.sys.scss    Their meaning in the app: what the components use
__tests__/
  components/        Tests of the shared components
  combat-tracker/    Page and components, helpers/, parsers/, _fixtures/
```

## Conventions

The full rules, followed by people and by Claude, are in [CLAUDE.md](CLAUDE.md). In short:

- **KISS**: keep the code as simple as possible, as long as it respects the best practices and the existing infrastructure. Don't write code that isn't used yet (optional props, options, abstractions "for later"): add it when it's needed. Simple code keeps the app maintainable.
- **Reuse the shared components** of `app/_components/_basics` before creating new ones. **Never override their style**: if a different look is needed, add a variant to the component (a prop mapped to a BEM modifier) or create a new one.
- **All user-facing text** goes through `translate(key, namespace)` and the French dictionaries.
- **CSS**: one module per component, BEM naming (`block__element--modifier`, kebab-case, no element in an element, no tag selectors). Components only use the **sys** variables of `variables.sys.scss`; the raw **token** values are only used there. Shared patterns are mixins.
- **Tests**: test behaviour, conditional display, the main flows of a page, domain rules and data parsing; not plain display of props. Find elements by test id, role or label, never by class or DOM structure.
- **Git**: branches `feat/<issue>-<description>`, commits `Feat #<issue> - <what changed>`.

## Tests

```bash
npm run test                      # all tests
npx jest __tests__/combat-tracker # one folder
npx jest -t "death saves"         # tests whose name matches
```

Translations are mocked in the tests: they check translation keys, not French text.

## Continuous integration

Every push runs, in `.github/workflows/ci.yml`: ESLint, the BEM lint, the Prettier check, then the tests. Run them locally before pushing:

```bash
npm run lint && npm run bem-lint && npx prettier . --check && npm run test
```

## Baseline warning suppression

Next.js currently emits a recurring `baseline-browser-mapping` stale-data warning during `dev` and `build` in this project.

To keep logs readable, scripts preload a warning filter via `NODE_OPTIONS`:

- Filter file: `scripts/suppress-baseline-warning.cjs`
- Script wiring: `package.json` (`dev`, `build`, `start`)

This only suppresses that specific warning and does not affect build behavior.
If upstream data/warnings are fixed later, this suppression can be removed.

For raw (unsuppressed) variants and script discovery, see [Common commands](#common-commands).

## Connect to the database

Follow [the Supabase local development guide](https://supabase.com/docs/guides/local-development).

### Locally

You need Docker Desktop installed.

```bash
# Start local Supabase services
npx supabase start

# Supabase Studio
http://localhost:54323
```

### Migrations

For now we have to write our migrations manually, you can use the following commands to create & run migrations:

```bash
npm run migration:create
npm run migration:run
```

## Deployment

Production URL: https://kbj-la-meujie-v2-a4hn.vercel.app/.

Deployments are automatic on push/merge to `main`.
For deployment details, see [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
