import { File } from "./File";

export class SpeechFile extends File {
  author: string;
  date: Date;
  tags: Array<string>;
}
