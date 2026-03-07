export class AudioListDto {
  id!: number;
  name!: string;
  filename!: string;
  loop!: boolean;
  autoPlay!: boolean;
  volume!: number;
  helper?: string;
}
