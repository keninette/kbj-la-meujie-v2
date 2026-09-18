import { Combat, CombatCharacter } from "../page";

const STORAGE_KEY = "scratchie-combat-tracker";

export function loadCombat(): Combat | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as Combat;
  } catch (error) {
    console.error("Erreur chargement personnages:", error);
    return null;
  }
}

export function saveCombat(combat: Combat): void {
  try {
    if (!combat) {
      console.error("no combat to save", combat);
    }
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
