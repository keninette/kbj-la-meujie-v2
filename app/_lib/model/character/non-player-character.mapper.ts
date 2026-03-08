import { CharacterType } from "@/app/_lib/model/character/enums/character-type.enum";
import { NonPlayerCharacter } from "@/app/_lib/model/character/entities/non-player-character.entity";
import { NonPlayerCharacterDto } from "@/app/_lib/model/character/dtos/non-player-character.dto";
import { NonPlayerCharacterListDto } from "@/app/_lib/model/character/dtos/non-player-character-list.dto";

type NonPlayerCharacterLike = NonPlayerCharacter &
  Partial<NonPlayerCharacterDto> & {
    id?: number;
    stepId?: number;
    step?: {
      uuid?: string;
    };
  };

export class NonPlayerCharacterMapper {
  toNonPlayerCharacterListDto(
    rawNonPlayerCharacter: NonPlayerCharacter,
  ): NonPlayerCharacterListDto {
    const nonPlayerCharacter = rawNonPlayerCharacter as NonPlayerCharacterLike;

    return {
      uuid: nonPlayerCharacter.uuid,
      name: nonPlayerCharacter.name,
      type: nonPlayerCharacter.type,
      ruleset: nonPlayerCharacter.ruleset,
      stepUuid: nonPlayerCharacter.stepUuid ?? nonPlayerCharacter.step?.uuid,
    };
  }

  toNonPlayerCharacterDto(
    rawNonPlayerCharacter: NonPlayerCharacter,
  ): NonPlayerCharacterDto {
    const nonPlayerCharacter = rawNonPlayerCharacter as NonPlayerCharacterLike;

    return {
      ...this.toNonPlayerCharacterListDto(nonPlayerCharacter),
      identifiesAs: nonPlayerCharacter.identifiesAs,
      currentHealthPoints: nonPlayerCharacter.currentHealthPoints,
      maxHealthPoints: nonPlayerCharacter.maxHealthPoints,
      portrait: nonPlayerCharacter.portrait as string | undefined,
      characterClass: nonPlayerCharacter.characterClass,
      level: nonPlayerCharacter.level,
      inspirationPoints: nonPlayerCharacter.inspirationPoints,
      proficiencyBonus: nonPlayerCharacter.proficiencyBonus,
      initiativeBonus: nonPlayerCharacter.initiativeBonus,
      armorClass: nonPlayerCharacter.armorClass,
      race: nonPlayerCharacter.race,
      alignment: nonPlayerCharacter.alignment,
      backstory: nonPlayerCharacter.backstory,
      occupation: nonPlayerCharacter.occupation,
      currentMagicPoints: nonPlayerCharacter.currentMagicPoints,
      maxMagicPoints: nonPlayerCharacter.maxMagicPoints,
      currentSanPoints: nonPlayerCharacter.currentSanPoints,
      maxSanPoints: nonPlayerCharacter.maxSanPoints,
      type: nonPlayerCharacter.type ?? CharacterType.NON_PLAYER_CHARACTER,
    };
  }

  toNonPlayerCharacterDtos(
    rawNonPlayerCharacters: NonPlayerCharacter[],
  ): NonPlayerCharacterDto[] {
    return rawNonPlayerCharacters.map((rawNonPlayerCharacter) =>
      this.toNonPlayerCharacterDto(rawNonPlayerCharacter),
    );
  }

  toNonPlayerCharacterListDtos(
    rawNonPlayerCharacters: NonPlayerCharacter[],
  ): NonPlayerCharacterListDto[] {
    return rawNonPlayerCharacters.map((rawNonPlayerCharacter) =>
      this.toNonPlayerCharacterListDto(rawNonPlayerCharacter),
    );
  }
}
