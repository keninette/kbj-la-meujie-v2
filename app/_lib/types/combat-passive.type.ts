import { Bg3PassiveId } from "@/app/combat-tracker/_lib/bg3-passives";

export type CombatPassive = {
  name: string;
  /** Set when it's one of our Baldur's Gate 3 passives: they hold its texts, icon and link */
  bg3PassiveId?: Bg3PassiveId;
  description?: string;
  iconUrl?: string;
  wikiLink?: string;
};
