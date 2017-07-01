import {Folder} from "./Folder";

export abstract class File {
  id = 0;
  parent: Folder;
  label: string;
  data: string;
}
