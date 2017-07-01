import {Folder} from "./Folder";

export abstract class File {
  parent: Folder;
  label: string;
  data: string;
}
