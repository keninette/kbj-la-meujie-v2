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

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.hp === "number" &&
    typeof value.maxHp === "number" &&
    (value.alternativeHp === undefined ||
      typeof value.alternativeHp === "number") &&
    (value.tempHp === undefined || typeof value.tempHp === "number") &&
    typeof value.isDying === "boolean" &&
    typeof value.isDead === "boolean" &&
    typeof value.isNpc === "boolean" &&
    typeof value.deathSaveThrowsLeft === "number" &&
    typeof value.ac === "number" &&
    typeof value.initiativeScore === "number" &&
    spellSlotsAreValid &&
    statesAreValid
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

  const characters = Array.isArray(value.characters)
    ? value.characters.map((character) =>
        isRecord(character)
          ? { ...character, id: character.id || createCharacterId() }
          : character,
      )
    : value.characters;
  const history = Array.isArray(value.history)
    ? value.history.map((entry) =>
        isRecord(entry)
          ? { ...entry, id: entry.id || createHistoryEntryId() }
          : entry,
      )
    : value.history;

  return { ...value, characters, history };
};

export function loadCombat(): Combat | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = normalizeStoredCombat(JSON.parse(raw));
    if (!isCombat(parsed)) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Erreur chargement personnages:", error);
    return null;
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
