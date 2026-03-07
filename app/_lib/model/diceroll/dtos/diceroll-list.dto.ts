import { Skill } from "@/app/_lib/model/character/enums/skill.enum";

export class DicerollListDto {
  id?: number;
  dice!: string;
  skill!: Skill;
  condition?: string;
}
