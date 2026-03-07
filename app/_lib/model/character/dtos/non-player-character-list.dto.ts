import { CharacterType } from "@/app/_lib/model/character/enums/character-type.enum";
import { NonPlayerCharacterRuleset } from "@/app/_lib/model/character/dtos/non-player-character.dto";

export class NonPlayerCharacterListDto {
  id?: number;
  name!: string;
  type?: CharacterType;
  ruleset?: NonPlayerCharacterRuleset;
  stepId?: number;
}
