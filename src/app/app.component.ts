import {Component, NgZone, OnInit} from '@angular/core';
import {ConfirmationService, MenuItem, TreeModule, TreeNode} from 'primeng/primeng';
import {FileService} from "./file.service";
import {File} from "../model/File";
import {SpeechFile} from "../model/SpeechFile";
import {Folder} from "../model/Folder";

import * as _ from "lodash"

const stringify = require('json-stringify-safe');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  static FILE_ICON = "fa-file-word-o";
  static OPEN_FOLDER_ICON = "fa-folder-open";
  static COLLAPSED_FOLDER_ICON = "fa-folder";

  nodes: TreeNode[];
  toggled = true;
  keywords = '';

  constructor(private confirmationService: ConfirmationService, private fileService: FileService, private zone: NgZone) {}

  ngOnInit() {
    this.fileService.getFiles().subscribe((files: Array<File>) => {
      this.nodes = files.map((file) => this.convertFileToTreeNode(file));
    });

    const mql: MediaQueryList = window.matchMedia('(min-width: 768px)');

    mql.addListener((res: MediaQueryList) => {
      this.zone.run( () => { // Change the property within the zone, CD will run after
        this.toggled = res.matches;
      });
    });
  }

  private convertFileToTreeNode(file: File): TreeNode {
    const node: TreeNode = _.merge({}, file);
    if (file.id) {
      node.data = file.id;
      node.icon = AppComponent.FILE_ICON;
    } else {
      node.data = 0;
      node.expandedIcon = AppComponent.OPEN_FOLDER_ICON;
      node.collapsedIcon = AppComponent.COLLAPSED_FOLDER_ICON;

      node.children = (file as Folder).children.map((child) => this.convertFileToTreeNode(child));
    }
    return node;
  }

  toggleMenu(event: Event) {
   this.toggled = !this.toggled;
  }


  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure that you to delete file "My election speech 2017" ?',
      accept: () => {
        // Actual logic to perform a confirmation
      }
    });
  }
}
