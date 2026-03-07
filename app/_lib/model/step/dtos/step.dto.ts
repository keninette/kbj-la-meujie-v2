import { PlaceDto } from "@/app/_lib/model/place/dtos/place.dto";
import { AudioListDto } from "@/app/_lib/model/audio/dtos/audio-list.dto";
import { DicerollListDto } from "@/app/_lib/model/diceroll/dtos/diceroll-list.dto";
import { NonPlayerCharacterListDto } from "@/app/_lib/model/character/dtos/non-player-character-list.dto";

export class StepDto {
  id!: number;
  name!: string;
  description!: string;
  date?: string;
  chapterId?: number;
  placeId?: number;
  place?: PlaceDto;
  audios?: AudioListDto[];
  diceRolls?: DicerollListDto[];
  nonPlayerCharacters?: NonPlayerCharacterListDto[];
}
