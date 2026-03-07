import { Step } from "@/app/_lib/model/step/step.entity";
import { StepDto } from "@/app/_lib/model/step/dtos/step.dto";
import { StepListDto } from "@/app/_lib/model/step/dtos/step-list.dto";
import { PlaceMapper } from "@/app/_lib/model/place/place.mapper";
import { AudioMapper } from "@/app/_lib/model/audio/audio.mapper";
import { DicerollMapper } from "@/app/_lib/model/diceroll/diceroll.mapper";
import { NonPlayerCharacterMapper } from "@/app/_lib/model/character/non-player-character.mapper";

type StepLike = Step & {
  chapterId?: number;
  placeId?: number;
};

export class StepMapper {
  toStepListDto(rawStep: StepLike): StepListDto {
    return {
      id: rawStep.id,
      name: rawStep.name,
      description: rawStep.description,
      date: rawStep.date,
      chapterId: rawStep.chapterId,
      placeId: rawStep.placeId,
    };
  }

  toStepDto(
    rawStep: StepLike,
    placeMapper: PlaceMapper,
    audioMapper: AudioMapper,
    dicerollMapper: DicerollMapper,
    nonPlayerCharacterMapper: NonPlayerCharacterMapper,
  ): StepDto {
    return {
      ...this.toStepListDto(rawStep),
      place: rawStep.place && placeMapper.toPlaceDto(rawStep.place),
      audios: rawStep.audios && audioMapper.toAudioListDtos(rawStep.audios),
      diceRolls:
        rawStep.diceRolls &&
        dicerollMapper.toDicerollListDtos(rawStep.diceRolls),
      nonPlayerCharacters:
        rawStep.nonPlayerCharacters &&
        nonPlayerCharacterMapper.toNonPlayerCharacterListDtos(
          rawStep.nonPlayerCharacters,
        ),
    };
  }

  toStepDtos(
    rawSteps: StepLike[],
    placeMapper: PlaceMapper,
    audioMapper: AudioMapper,
    dicerollMapper: DicerollMapper,
    nonPlayerCharacterMapper: NonPlayerCharacterMapper,
  ): StepDto[] {
    return rawSteps.map((rawStep) =>
      this.toStepDto(
        rawStep,
        placeMapper,
        audioMapper,
        dicerollMapper,
        nonPlayerCharacterMapper,
      ),
    );
  }

  toStepListDtos(rawSteps: StepLike[]): StepListDto[] {
    return rawSteps.map((rawStep) => this.toStepListDto(rawStep));
  }
}
