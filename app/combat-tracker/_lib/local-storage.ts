import { Combat } from "../../_lib/types/combat.type";
import { CombatCharacter } from "../../_lib/types/combat-character.type";
import { CombatState } from "../../_lib/types/combat-state.type";
import { CombatStatusEnum } from "../../_lib/enums/combat-status.enum";

const STORAGE_KEY = "scratchie-combat-tracker";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isCombatState = (value: unknown): value is CombatState => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    (value.numberOfTurns === undefined ||
      typeof value.numberOfTurns === "number") &&
    (value.saveThrowStat === undefined ||
      typeof value.saveThrowStat === "string") &&
    (value.saveThrowDc === undefined || typeof value.saveThrowDc === "number")
  );
};

const isCombatCharacter = (value: unknown): value is CombatCharacter => {
  if (!isRecord(value)) {
    return false;
  }

  const spellSlotsAreValid =
    value.spellSlotsLeft === undefined ||
    (isRecord(value.spellSlotsLeft) &&
      Object.values(value.spellSlotsLeft).every(
        (slotCount) => typeof slotCount === "number",
      ));
  const statesAreValid =
    value.states === undefined ||
    (Array.isArray(value.states) && value.states.every(isCombatState));
  const passivesAreValid =
    value.passives === undefined ||
    (Array.isArray(value.passives) &&
      value.passives.every((passive) => typeof passive === "string"));
  const usableObjectsAreValid =
    value.usableObjects === undefined ||
    (Array.isArray(value.usableObjects) &&
      value.usableObjects.every((object) => typeof object === "string"));

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.hp === "number" &&
    typeof value.maxHp === "number" &&
    (value.alternativeHp === undefined ||
      typeof value.alternativeHp === "number") &&
    (value.maxAlternativeHp === undefined ||
      typeof value.maxAlternativeHp === "number") &&
    (value.tempHp === undefined || typeof value.tempHp === "number") &&
    typeof value.isDying === "boolean" &&
    typeof value.isDead === "boolean" &&
    typeof value.isNpc === "boolean" &&
    typeof value.deathSaveThrowsLeft === "number" &&
    typeof value.ac === "number" &&
    typeof value.initiativeScore === "number" &&
    spellSlotsAreValid &&
    statesAreValid &&
    passivesAreValid &&
    usableObjectsAreValid
  );
};

const isCombat = (value: unknown): value is Combat => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.status === CombatStatusEnum.PREPARING ||
      value.status === CombatStatusEnum.ONGOING) &&
    typeof value.currentTurn === "number" &&
    typeof value.selectedCharacterIndex === "number" &&
    Array.isArray(value.characters) &&
    value.characters.every(isCombatCharacter) &&
    (value.idleCharacters === undefined ||
      (Array.isArray(value.idleCharacters) &&
        value.idleCharacters.every(isCombatCharacter))) &&
    Array.isArray(value.history) &&
    value.history.every(
      (entry) =>
        isRecord(entry) &&
        typeof entry.id === "string" &&
        typeof entry.turn === "number" &&
        typeof entry.action === "string",
    )
  );
};

const createCharacterId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `character-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createHistoryEntryId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `history-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeStoredCombat = (value: unknown): unknown => {
  if (!isRecord(value)) {
    return value;
  }

  const withCharacterIds = (list: unknown[]) =>
    list.map((character) =>
      isRecord(character)
        ? { ...character, id: character.id || createCharacterId() }
        : character,
    );
  const characters = Array.isArray(value.characters)
    ? withCharacterIds(value.characters)
    : value.characters;
  const idleCharacters = Array.isArray(value.idleCharacters)
    ? withCharacterIds(value.idleCharacters)
    : value.idleCharacters;
  const history = Array.isArray(value.history)
    ? value.history.map((entry) =>
        isRecord(entry)
          ? { ...entry, id: entry.id || createHistoryEntryId() }
          : entry,
      )
    : value.history;

  return {
    ...value,
    characters,
    ...(idleCharacters !== undefined && { idleCharacters }),
    history,
  };
};

export function loadCombat(): Combat | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = normalizeStoredCombat(JSON.parse(raw));
    if (!isCombat(parsed)) {
      backupUnreadableCombat(raw);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Erreur chargement personnages:", error);
    if (raw) {
      backupUnreadableCombat(raw);
    }
    return null;
  }
}

// Keeps a copy of data we could not read so it is never lost by a later save
function backupUnreadableCombat(raw: string): void {
  try {
    localStorage.setItem(`${STORAGE_KEY}-backup`, raw);
  } catch (error) {
    console.error("Erreur sauvegarde de secours:", error);
  }
}

export function saveCombat(combat: Combat): void {
  try {
    const raw = JSON.stringify(combat);
    localStorage.setItem(STORAGE_KEY, raw);
  } catch (error) {
    console.error("Erreur sauvegarde personnages:", error);
  }
}

export function clearCombat(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Erreur suppression personnages:", error);
  }
}
