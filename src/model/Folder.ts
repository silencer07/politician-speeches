import { File } from "./File";

export class Folder extends File {
  expandedIcon = "fa-folder-open";
  collapsedIcon = "fa-folder";

  children: Array<File>
}
