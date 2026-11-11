# bg3.wiki import

The combat tracker can fill a character from its [bg3.wiki](https://bg3.wiki) page: paste the page URL in the edit form, and the import fills its stats, resources, portrait and actions. The game master then reviews the highlighted fields before saving.

This folder holds everything that reads the wiki. The rest of the app only knows `CombatCharacter` and `CombatAction`.

## Files

| File                                | Role                                                                                                                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bg3-wiki.actions.ts`               | **Server action** (`"use server"`): every request to the wiki. bg3.wiki doesn't allow cross-origin requests, so the browser can't call it. Entry point: `createCharacterFromWiki(url)`.    |
| `bg3-wiki.parser.ts`                | Pure functions reading the character page: URL → title, the `{{Infobox creature}}` fields, abilities, saving throws, resources, portrait candidates, wiki links.                           |
| `bg3-wiki-combat-actions.parser.ts` | Pure functions reading the actions: the feature boxes of the page, the rows of the `actions` and `weapons` Cargo tables, costs, damages, descriptions.                                     |
| `bg3-wiki.images.ts`                | The wiki host and image path. Shared with `next.config.ts` (allowed image host), so **it keeps relative imports only**.                                                                    |
| `merge-wiki-character.ts`           | Merges an imported character into the edited one, and lists the fields that changed, so the form can highlight them. Combat state (initiative, conditions, death saves…) is never touched. |

Related data, outside this folder, in `app/combat-tracker/_lib/`:

- `bg3-action-resources.ts`: spell slots and class resources (rage, wild shape…), with the wiki's aliases and icons.
- `bg3-conditions.ts`: the game's conditions.
- `bg3-damage-types.ts`: the damage type icons.

Translations are in `app/_dictionaries/fr/`: `dnd-conditions.fr.json` and `dnd-actions.fr.json`.

## How an import works

1. **The page.** `action=parse&prop=wikitext` on the MediaWiki API, following redirects.
2. **The fight subpage.** Bosses keep their fight stats and actions on a "/Combat" subpage (`{{Main|Minthara/Combat}}`). When there's one, its infobox is merged over the main one, and its actions win.
3. **The infobox.** `{{Infobox creature}}` gives HP, AC, abilities, movement, level, resources and passives. Fields can exist per difficulty (`h hp`, `t hp`, `hp`): we take Honour, then Tactician, then the plain field.
4. **The actions**, in four steps (`fetchActions`):
   1. **Feature boxes.** We list the `{{Feature box|…}}` and `{{Reaction box|…}}` of the "Attacks and actions" section (or of the whole page if it has none), with their `item=`, `cost=` and `recharge=` overrides.
   2. **Redirects.** We resolve each box's page title (`Firebolt` → `Fire Bolt`), since the Cargo tables only know the real titles.
   3. **The `actions` table.** We read its rows through `Special:CargoExport` (see below): costs, damages, save, concentration, description, icon.
   4. **Icons and weapons, in parallel.** We find the URLs of the action icons. For an attack dealing "weapon" damage with an `item=`, we read the `weapons` table for that weapon's damage (see below).
5. **The portrait.** We try several image file names from the infobox, best first, and keep the first one that exists.

**What may fail:** only the first step throws (page not found, no infobox, network). Everything after it never throws. A failed subpage, icon, weapon or actions request is logged, and the character is still imported without that part.

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

### Translations

The wiki is in English only. The French texts are ours, in dictionaries keyed by our own ids:

- **Conditions:** `dnd-conditions.fr.json`, keyed by the condition id in `bg3-conditions.ts`.
- **Actions:** `dnd-actions.fr.json`, keyed by the action's wiki page, from its `wikiLink`: `.../wiki/Lay_on_Hands:_Greater_Healing` → `lay-on-hands-greater-healing` (`getActionId` in `action-text.helper.ts`). We key by page, not by name, because two pages may share a name (several "Fly"). Already imported characters get new translations without a re-import.

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

- **Several rows for one page.** A page can store several rows (variants of the same action). We prefer the row named after the page.
- **Feature boxes outside the actions.** A page may use feature boxes for other things (allies, summons). When it has an "Attacks and actions" section, only that section is read.
- **Damage types.** Rows may use a type that isn't one: `"Weapon"` when the weapon's own damage applies. The Cargo `weapons` table only uses the 13 real types.
- **Rate limits.** The wiki answers `429 Too Many Requests`, or an HTML error page instead of JSON, when it gets too many requests in a short time. This doesn't happen during a normal import, but it does when scripting many requests (e.g. to update translations). Batch your requests, pause between them, and send a generic `User-Agent`.
- **Query size.** The MediaWiki API accepts at most 50 titles per request for anonymous users (`MAX_TITLES_PER_REQUEST`). Titles containing a double quote can't be written in a Cargo `where`, so `buildPagesWhere` leaves them out.
- **Images.** Wiki images go through Next's image optimisation (allowed in `next.config.ts` via `BG3_WIKI_IMAGE_PATTERN`). A URL from another host is shown as is (`unoptimized`). A URL still being typed is not displayed (`isDisplayableImageUrl`).

## Tests

- **Parsers:** `__tests__/combat-tracker/parsers/` tests the pure functions, with excerpts of real wikitext and Cargo rows.
- **Server action:** `bg3-wiki.actions.ts` is mocked in the component tests. The tests never call the real wiki.
- **Checking a change against the live wiki:** write a temporary Jest test with `@jest-environment node` that calls the server action's steps, run it, then delete it.
