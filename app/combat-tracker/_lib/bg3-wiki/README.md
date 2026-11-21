# bg3.wiki import

The combat tracker can fill a character from its [bg3.wiki](https://bg3.wiki) page: paste the page URL in the edit form, and the import fills its stats, resources, portrait, passives and actions. The game master then reviews the highlighted fields before saving.

A single passive can also be imported from its page, in the passives of the edit form (see "How a passive import works").

This folder holds everything that reads the wiki. The rest of the app only knows `CombatCharacter`, `CombatAction` and `CombatPassive`.

## Files

| File                                | Role                                                                                                                                                                                                                   |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bg3-wiki.actions.ts`               | **Server action** (`"use server"`): every request to the wiki. bg3.wiki doesn't allow cross-origin requests, so the browser can't call it. Entry points: `createCharacterFromWiki(url)`, `createPassiveFromWiki(url)`. |
| `bg3-wiki.parser.ts`                | Pure functions reading the character page: URL → title, the `{{Infobox creature}}` fields, abilities, saving throws, resources, portrait candidates, wiki links.                                                       |
| `bg3-wiki-combat-actions.parser.ts` | Pure functions reading the actions: the feature boxes of the page, the rows of the `actions` and `weapons` Cargo tables, costs, damages, descriptions.                                                                 |
| `bg3-wiki-passives.parser.ts`       | Pure functions turning the infobox's passives and resistances, or a passive's own page, into `CombatPassive`s.                                                                                                         |
| `bg3-wiki.images.ts`                | The wiki host and image path. Shared with `next.config.ts` (allowed image host), so **it keeps relative imports only**.                                                                                                |
| `merge-wiki-character.ts`           | Merges an imported character into the edited one, and lists the fields that changed, so the form can highlight them. Combat state (initiative, conditions, death saves…) is never touched.                             |

Related data, outside this folder, in `app/combat-tracker/_lib/`:

- `bg3-action-resources.ts`: spell slots and class resources (rage, wild shape…), with the wiki's aliases and icons.
- `bg3-conditions.ts`: the game's conditions.
- `bg3-passives.ts`: the 200 passives most used by the wiki's creatures, with their description, icon and link (see "Passives" below).
- `bg3-resistances.ts`: the resistance keywords of the infobox, their names and icons.
- `bg3-damage-types.ts`: the damage type icons.

Translations are in `app/_dictionaries/fr/`: `dnd-conditions.fr.json`, `dnd-actions.fr.json` and `dnd-passives.fr.json`, plus the resistance wordings under `resistance.*` in `combat-tracker.fr.json`.

## How an import works

1. **The page.** `action=parse&prop=wikitext` on the MediaWiki API, following redirects.
2. **The fight subpage.** Bosses keep their fight stats and actions on a "/Combat" subpage (`{{Main|Minthara/Combat}}`). When there's one, its infobox is merged over the main one, and its actions win.
3. **The infobox.** `{{Infobox creature}}` gives HP, AC, abilities, movement, level, resources and passives. Fields can exist per difficulty (`h hp`, `t hp`, `hp`): we take Honour, then Tactician, then the plain field.
4. **The actions**, in four steps (`fetchActions`):
   1. **Feature boxes.** We list the `{{Feature box|…}}` and `{{Reaction box|…}}` of the "Attacks and actions" section (or of the whole page if it has none), with their `item=`, `cost=` and `recharge=` overrides.
   2. **Redirects.** We resolve each box's page title (`Firebolt` → `Fire Bolt`), since the Cargo tables only know the real titles.
   3. **The `actions` table.** We read its rows through `Special:CargoExport` (see below): costs, damages, save, concentration, description, icon.
   4. **Icons and weapons, in parallel.** We find the URLs of the action icons. For an attack dealing "weapon" damage with an `item=`, we read the `weapons` table for that weapon's damage (see below).
5. **The passives,** without any request: their names are looked up in `bg3-passives.ts` (see below).
6. **The resistances.** We find the URLs of their icons.
7. **The portrait.** We try several image file names from the infobox, best first, and keep the first one that exists.

**What may fail:** only the first step throws (page not found, no infobox, network). Everything after it never throws. A failed subpage, icon, weapon or actions request is logged, and the character is still imported without that part. The passives never depend on the wiki answering.

## How a passive import works

In the passives of the edit form, "Importer un passif depuis le wiki" opens the URL dialog (`WikiImportDialog`, shared with the character import). A new passive fills the form's passive fields for the game master to check; it's only added with the "+" button, and then joins the passives list of the form (see below).

1. **The page,** like a character's (`action=parse&prop=wikitext`, following redirects).
2. **The template.** Every passive page starts with `{{Passive feature page|…}}` (`parseTemplate`, the same reading as the infobox). Without it, the error is "noPassive".
3. **A passive of our list** (matched by its page title, like the infobox's passives) only keeps its id, so it gets our French texts and icon.
4. **Another passive** gets the page title as name, its `description` (or its `brief` when it has none), its wiki link, and the URL of its `icon` file. The icon request never makes the import fail. Its texts stay in English: there's no translation for it.

Only the API is used: no Cargo request, so no rate limit (see the troubleshooting).

**Already in the list.** The form's list offers our 200 passives, plus every passive the game master added by hand or from the wiki (kept in the local storage, `loadCustomPassives`). An imported passive already there (same id, or same wiki page: `isSamePassive`) doesn't fill the fields: a dialog shows its chip, with a button to add it to the character, unless the character already has it.

### Cargo tables

The wiki stores structured data in [Cargo](https://www.mediawiki.org/wiki/Extension:Cargo) tables: `actions`, `weapons`, `conditions`… List them with `api.php?action=cargotables`, and their fields with `api.php?action=cargofields&table=actions`.

We read them with `index.php?title=Special:CargoExport&format=json&tables=…&fields=…&where=…`.

- **No `cargoquery`.** The API's `cargoquery` needs an account; the export page doesn't.
- **Field names.** They take **underscores** in the query (`spell_level`, `damage_1_type`), but come back with **spaces** in the JSON (`"spell level"`). `WikiActionRow` and `WikiWeaponRow` use the JSON names, and `ACTION_FIELDS` / `WEAPON_FIELDS` the query names.
- **Page names.** They're matched without case: `LOWER(_pageName) IN ("main hand attack", …)` (`buildPagesWhere`). See the troubleshooting below.

### Actions in detail

- **Costs** (`parseCosts`) become the keys the app uses:
  - `"action, spell2"` → `["action", "2"]`, `"layonh:2"` → `"layonh:2"`;
  - the movement: `"movement"`, `"half movement"` → `"movement:half"`, `"movement m:6"` → `"movement:6"`;
  - `"ba"` and `"bonus action"` → `"bonus"`;
  - resources go through `normalizeActionResourceId`, so all the wiki's aliases (`spell1`, `level1`, `s1`, `l1`; `wldshp`, `ws`, `wild shape`…) give one id. The list of aliases comes from the wiki's [Module:Resource/data](https://bg3.wiki/wiki/Module:Resource/data).
- **Weapon damage.** When an action deals `"weapon"` damage and its box names an `item=`, we read that weapon in the `weapons` table.
  - **Dice:** its damage already includes the enchantment (`"1d8 + 1"` → `"1d8+1"`). A versatile weapon keeps both dice. The weapon's extra damages (Everburn Blade's 1d4 Fire) are added.
  - **Ability:** DEX for a ranged weapon, FOR for a melee one. For a finesse weapon, the best of the two scores in the infobox, or both when they're unknown.
  - **Weapon not found:** the damage stays `"weapon"`.
- **Damage types** map to `DamageTypeEnum`, without case. An unknown one (`"Weapon"`) is left out, and the dice are kept.
- **Descriptions.** They come as escaped HTML mixed with wiki markup (icons, links, damage colour spans). `cleanDescription` turns them into plain text.

### Passives and resistances

**Passives** are stored like conditions: a passive of our list keeps only its name and `bg3PassiveId`, and `PassiveChip` reads its icon, description and link from `bg3-passives.ts` (French texts with `getPassiveText`). This avoids a `passives` Cargo request at each import, often refused by the rate limit (see the troubleshooting).

- **Matching.** The infobox lists page names (the wiki's own infobox needs exact names too). `buildPassives` turns the name into our id (`toWikiPageId`: `Hunter's Prey` → `hunter-s-prey`), so the case doesn't matter.
- **Item passives.** `Tenacity @ Maul` is the `Tenacity` passive, given by an item. The item is dropped.
- **Unknown passive.** It keeps its name, and a wiki link built from it.
- **Their own texts win.** A passive typed by hand, or imported before the list existed, keeps its own description, icon and link.

**Which passives are in the list.** The 200 most used in the infoboxes, most used first: 96 % of the uses, on 2,446 creature pages. They're counted like the actions (see "Which actions are translated" below), with the `passives` field instead of the feature boxes, and `@ item` removed. To regenerate or extend the list:

1. Read the rows of these pages in the `passives` table (`_pageName`, `name`, `icon`, `brief`, `description`), in batches of 50, slowly (see the rate limits).
2. Find the URLs of their icons (`prop=imageinfo`). Some passives have no icon on the wiki.
3. Clean them through the parser itself, in a temporary Jest test: `decodeHtmlEntities` for the names, `cleanDescription` for the descriptions (the `brief` when there's no description), `buildWikiLink` for the links.
4. Write `bg3-passives.ts`, and add the French `<id>.name` and `<id>.description` keys to `dnd-passives.fr.json`.

**Resistances** (`resistances = fire resistance nm, poison immunity`) aren't pages, but keywords: `<damage type> <kind>`, read like the wiki's [Template:Resistance](https://bg3.wiki/wiki/Template:Resistance) does (`bg3-resistances.ts`, with the wiki's spelling variants). They become passives named like on the wiki ("Resistant to Non-Magical Fire"), with their icon (`Fire Resistance NM.png`) and a link to the Resistances page. Their French name is built from the kind and the damage type ("Résistance : Feu (non magique)"), so every one is translated. An unknown value keeps its raw name.

### Translations

The wiki is in English only. The French texts are ours, in dictionaries keyed by our own ids:

- **Conditions:** `dnd-conditions.fr.json`, keyed by the condition id in `bg3-conditions.ts`.
- **Passives:** `dnd-passives.fr.json`, keyed by the passive id in `bg3-passives.ts`.
- **Actions:** `dnd-actions.fr.json`, keyed by the action's wiki page, from its `wikiLink`: `.../wiki/Lay_on_Hands:_Greater_Healing` → `lay-on-hands-greater-healing` (`getWikiTextId` in `wiki-text.helper.ts`). We key by page, not by name, because two pages may share a name (several "Fly"). Already imported characters get new translations without a re-import.

**Fallback.** When there's no translation, the original English text is shown. The tooltip's switch shows the English description either way.

**Which actions are translated.** The 200 actions most used by the wiki's characters, monster abilities left out. They cover 95 % of the uses by non-monster characters. To find them:

1. List the pages using `{{Infobox creature}}` (`list=embeddedin`).
2. Read their wikitext in batches of 50 (`prop=revisions&rvprop=content`).
3. Count the feature boxes.
4. Drop the monster abilities (Claws, Multiattack, Bite (…), creature-specific variants…).

The order in `dnd-actions.fr.json` is the order of use.

**Adding translations.** To translate more actions:

- Get their English text through the parser itself, not the raw export, so it's cleaned exactly like an import (e.g. a temporary Jest test with `@jest-environment node` calling `buildCombatActions` on real rows).
- Add the keys to the dictionary, with distances in meters only.
- Use the official BG3 French names when you know them.

**Another option, not done yet.** The `actions` table has a `uid` field with the game's internal spell name (`Projectile_FireBolt`). With the game files (extracted with LSLib), it could give the official French names for every action.

## Troubleshooting: things to look out for

These all happened, and each one has a regression test in `__tests__/combat-tracker/parsers/`.

- **Page names written in lowercase.** Character pages often write `{{Feature box|main hand attack}}`, and the wiki has no redirect for these. Cargo's `_pageName` comparison is case-sensitive, so the actions were missing (Maggran had 2 actions out of 5). We use `LOWER(_pageName)` in queries, and compare names without case (`isSamePage`).
- **HTML-escaped values.** The export escapes page names and names: `"Hunter&#039;s Mark"`. The query finds the row, but a plain comparison with the box's `Hunter's Mark` fails, and the action is silently dropped. `normalizePageName` decodes the entities, and so do the stored name and wiki link.
- **Numbers instead of text.** Fields that look like text may come as JSON numbers when the value is a plain number: a flat damage of `5` (Armour of Agathys) or `70` (Heal). Calling `.trim()` on them crashed `fetchActions`, and the character lost **all** its actions. Never assume a Cargo field is a string (`WikiDice = string | number | null`).
- **Wiki-only markup in descriptions.** Besides the icons and links, descriptions may hold markup that isn't text:
  - an `<abbr>` marker: `Radiant<abbr …>[[…|DRS]]</abbr>[[Category:Damage Rider As Source]]`;
  - footnotes: `<sup>[[:Calm Emotions#Bugs|See: Bugs]]</sup>`;
  - text escaped twice: `&amp;#8239;`;
  - `&NoBreak;` between the dice and their damage type.

  When a description looks wrong, look at its raw export, then add the case to the `cleanDescription` tests.

- **Templates written as words in passive pages.** Unlike the Cargo exports, the pages' wikitext keeps its templates. The generic cleaning keeps the last unnamed argument of a template (`{{Cond|Charmed}}` → `Charmed`), which drops or cuts some words: `{{Advantage}}` and `{{SavingThrow}}s` (no argument), `{{dist|m=3}}` (a named one), `{{DamageText|1|Healing}}` (two). `renderDescriptionTemplates` renders them first ("Advantage", "Saving Throws", "3 m", "1 Healing"), for the passive descriptions only, so the infobox isn't affected.
- **Several rows for one page.** A page can store several rows (variants of the same action). We prefer the row named after the page.
- **Feature boxes outside the actions.** A page may use feature boxes for other things (allies, summons). When it has an "Attacks and actions" section, only that section is read.
- **Damage types.** Rows may use a type that isn't one: `"Weapon"` when the weapon's own damage applies. The Cargo `weapons` table only uses the 13 real types.
- **Rate limits.** `Special:CargoExport` is rate-limited for anonymous users ("due to bot activity"): it answers `429 Too Many Requests` with an HTML page instead of JSON, with no `Retry-After`. It happens **during a normal import**: two exports a few seconds apart can be refused. That's why the passives no longer use Cargo (Arron and Karlach had lost their descriptions and icons). The actions and weapons still do, so a 429 leaves a character without its actions. The API (`api.php`) isn't limited the same way. When scripting many requests, batch them, pause between them, retry after a 429, and send a generic `User-Agent`.
- **Query size.** The MediaWiki API accepts at most 50 titles per request for anonymous users (`MAX_TITLES_PER_REQUEST`). Titles containing a double quote can't be written in a Cargo `where`, so `buildPagesWhere` leaves them out.
- **Images.** Wiki images go through Next's image optimisation (allowed in `next.config.ts` via `BG3_WIKI_IMAGE_PATTERN`). A URL from another host is shown as is (`unoptimized`). A URL still being typed is not displayed (`isDisplayableImageUrl`).

## Tests

- **Parsers:** `__tests__/combat-tracker/parsers/` tests the pure functions, with excerpts of real wikitext and Cargo rows.
- **Server action:** `bg3-wiki.actions.ts` is mocked in the component tests. The tests never call the real wiki.
- **Checking a change against the live wiki:** write a temporary Jest test with `@jest-environment node` that calls the server action's steps, run it, then delete it.
