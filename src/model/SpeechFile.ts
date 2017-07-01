import { File } from "./File";

export class SpeechFile extends File {
  icon = "fa-file-word-o";
  author: string;
  date: Date;
  tags: Array<string>;
}
