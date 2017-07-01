import {Folder} from "./Folder";

export abstract class File {
  id: number;
  parent: Folder;
  label: string;
  data: string;
}
