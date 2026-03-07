export class AudioDto {
  id!: number;
  name!: string;
  filename!: string;
  loop!: boolean;
  autoPlay!: boolean;
  volume!: number;
  helper?: string;
  stepId?: number;
}
