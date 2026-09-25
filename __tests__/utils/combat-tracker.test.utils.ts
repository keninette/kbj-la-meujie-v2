import { CombatStatusEnum } from "@/app/_lib/enums/combat-status.enum";
import { CombatCharacter } from "@/app/_lib/types/combat-character.type";
import { Combat } from "@/app/_lib/types/combat.type";

export const buildCharacter = (
  overrides: Partial<CombatCharacter> = {},
): CombatCharacter => ({
  id: "char-1",
  name: "Aragorn",
  hp: 10,
  maxHp: 10,
  isDying: false,
  isDead: false,
  isNpc: false,
  deathSaveThrowsLeft: 3,
  ac: 15,
  initiativeScore: 12,
  ...overrides,
});

export const buildCombat = (characters: CombatCharacter[] = []): Combat => ({
  status: CombatStatusEnum.PREPARING,
  currentTurn: 0,
  selectedCharacterIndex: 0,
  characters,
  history: [],
});
