export class AudioDto {
  uuid!: string;
  name!: string;
  filename!: string;
  loop!: boolean;
  autoPlay!: boolean;
  volume!: number;
  helper?: string;
  stepUuid?: string;
}
