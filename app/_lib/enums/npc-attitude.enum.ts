/** How an NPC stands towards the players */
export enum NpcAttitudeEnum {
  FRIEND = "friend",
  NEUTRAL = "neutral",
  ENEMY = "enemy",
}

export const isNpcAttitude = (value: unknown): value is NpcAttitudeEnum =>
  Object.values(NpcAttitudeEnum).includes(value as NpcAttitudeEnum);
