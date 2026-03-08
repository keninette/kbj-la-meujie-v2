import { Audio } from "@/app/_lib/model/audio/audio.entity";
import { AudioDto } from "@/app/_lib/model/audio/dtos/audio.dto";
import { AudioListDto } from "@/app/_lib/model/audio/dtos/audio-list.dto";

type AudioLike = Audio & {
  stepId?: number;
  stepUuid?: string;
  step?: {
    uuid?: string;
  };
};

export class AudioMapper {
  toAudioListDto(rawAudio: AudioLike): AudioListDto {
    return {
      uuid: rawAudio.uuid,
      name: rawAudio.name,
      filename: rawAudio.filename,
      loop: rawAudio.loop,
      autoPlay: rawAudio.autoPlay,
      volume: rawAudio.volume,
      helper: rawAudio.helper,
    };
  }

  toAudioDto(rawAudio: AudioLike): AudioDto {
    return {
      ...this.toAudioListDto(rawAudio),
      stepUuid: rawAudio.stepUuid ?? rawAudio.step?.uuid,
    };
  }

  toAudioDtos(rawAudios: AudioLike[]): AudioDto[] {
    return rawAudios.map((rawAudio) => this.toAudioDto(rawAudio));
  }

  toAudioListDtos(rawAudios: AudioLike[]): AudioListDto[] {
    return rawAudios.map((rawAudio) => this.toAudioListDto(rawAudio));
  }
}
