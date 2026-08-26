import { Combat, CombatCharacter } from "../page";

const STORAGE_KEY = 'scratchie-combat-tracker';

export function loadCombat(): Combat {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { currentTurn: 1, characters: [] };
    return JSON.parse(raw) as Combat;
  } catch (error) {
    console.error('Erreur chargement personnages:', error);
    return { currentTurn: 1, characters: [] };
  }
}

export function saveCombat(combat: Combat): void {
  try {
    const raw = JSON.stringify(combat ?? { currentTurn: 1, characters: [] } );
    localStorage.setItem(STORAGE_KEY, raw);
  } catch (error) {
    console.error('Erreur sauvegarde personnages:', error);
  }
}

export function clearCombat(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erreur suppression personnages:', error);
  }
}
