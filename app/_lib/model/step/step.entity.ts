import { Audio } from "../audio/audio.entity";
import { NonPlayerCharacter } from "../character/entities/non-player-character.entity";
import { Diceroll } from "../diceroll/diceroll.entity";
import { Place } from "../place/place.entity";

export class Step {
  id!: number;
  name!: string;
  description!: string;
  date?: string;
  place?: Place
  audios?: Audio[];
  diceRolls?: Diceroll[];
  nonPlayerCharacters?: NonPlayerCharacter[];
}
