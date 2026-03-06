export class Audio {
  id!: number;
  name!: string;
  filename!: string;
  loop!: boolean;
  autoPlay!: boolean;
  volume!: number;
  helper?: string;

  constructor(name: string, filename: string) {
    this.name = name;
    this.filename = filename;
    this.loop = false;
    this.autoPlay = false;
    this.volume = 1;
  }
}
