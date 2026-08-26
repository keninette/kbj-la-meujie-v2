import { PlaceDto } from "@lib/model/place/dtos/place.dto";
import { AudioListDto } from "@lib/model/audio/dtos/audio-list.dto";
import { DicerollListDto } from "@lib/model/diceroll/dtos/diceroll-list.dto";
import { NonPlayerCharacterListDto } from "@lib/model/character/dtos/non-player-character-list.dto";

export class StepDto {
  uuid!: string;
  name!: string;
  description!: string;
  date?: string;
  chapterUuid?: string;
  placeUuid?: string;
  place?: PlaceDto;
  audios?: AudioListDto[];
  diceRolls?: DicerollListDto[];
  nonPlayerCharacters?: NonPlayerCharacterListDto[];
}
