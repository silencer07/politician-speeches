import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FileService} from "../file.service";
import {MenuItem, TreeNode} from "primeng/primeng";
import {Folder} from "../../model/Folder";
import {File} from "../../model/File";

import * as _ from "lodash";

@Component({
  selector: 'app-editor-sidebar',
  templateUrl: './editor-sidebar.component.html',
  styleUrls: ['./editor-sidebar.component.scss']
})
export class EditorSidebarComponent implements OnInit {

  static FILE_ICON = "fa-file-word-o";
  static OPEN_FOLDER_ICON = "fa-folder-open";
  static COLLAPSED_FOLDER_ICON = "fa-folder";

  nodes: TreeNode[];
  selectedNode: TreeNode;

  fileActions: Array<MenuItem> = [
    {
      label: 'Delete',
      icon: 'fa-close'
    },
    {
      label: 'Restore',
      icon: 'fa-undo',
    }
  ];

  @Output()
  onNewButtonClicked = new EventEmitter();

  @Output()
  onSpeechFileSelect: EventEmitter<number> = new EventEmitter<number>();

  constructor(private fileService: FileService) { }

  ngOnInit() {
    this.getFiles();
  }

  private getFiles() {
    this.fileService.getFiles().subscribe((files: Array<File>) => {
      this.nodes = files.map((file) => this.convertFileToTreeNode(file));
    });
  }

  private convertFileToTreeNode(file: File, expanded = false): TreeNode {
    const node: TreeNode = _.merge({}, file);
    if (file.id) {
      node.data = file.id;
      node.icon = EditorSidebarComponent.FILE_ICON;
    } else {
      node.data = 0;
      node.expandedIcon = EditorSidebarComponent.OPEN_FOLDER_ICON;
      node.collapsedIcon = EditorSidebarComponent.COLLAPSED_FOLDER_ICON;
      node.expanded = expanded;

      node.children = (file as Folder).children.map((child) => this.convertFileToTreeNode(child, expanded));
    }
    return node;
  }

  onQueryType(query: string) {
    if (query) {
      this.fileService.search(query).subscribe((files: Array<File>) => {
        this.nodes = files.map((file) => this.convertFileToTreeNode(file, true));
      });
    } else {
      this.getFiles();
    }
  }

  onFileSelect() {
    if (this.selectedNode.data === 0) {
      this.selectedNode.expanded = !this.selectedNode.expanded;
    } else {
      this.onSpeechFileSelect.emit(this.selectedNode.data);
    }
  }

  newButtonClicked() {
    this.selectedNode = null;
    this.onNewButtonClicked.emit(this.selectedNode.data);
  }

  removeSelectedNode() {
    const nodeToRemove = this.selectedNode;
    const parent = nodeToRemove.parent;
    const index = parent.children.findIndex((node) => node.data === nodeToRemove.data);
    parent.children.splice(index, 1);
    this.selectedNode = parent;
  }

}
