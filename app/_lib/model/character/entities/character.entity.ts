import { Picture } from "../../picture/picture.entity";
import { CharacterType } from "../enums/character-type.enum";

export abstract class Character {
  id!: number;
  uuid!: string;
  name!: string;
  identifiesAs!: "Female" | "Male" | "Non-binary";
  currentHealthPoints!: number;
  maxHealthPoints!: number;
  type?: CharacterType;
  portrait?: string | Picture;
}
