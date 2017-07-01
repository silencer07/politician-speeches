import {Component, NgZone, OnInit} from '@angular/core';
import {ConfirmationService, MenuItem, TreeNode} from 'primeng/primeng';
import {FileService} from "./file.service";
import {File} from "../model/File";
import {SpeechFile} from "../model/SpeechFile";
import {Folder} from "../model/Folder";

import * as _ from "lodash"
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
  toggled = true; // sidebar
  selectedFile: SpeechFile;
  selectedNode: TreeNode;
  form: FormGroup;
  infoMessages = [];
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

  constructor(private formBuilder: FormBuilder, private confirmationService: ConfirmationService,
              private fileService: FileService, private zone: NgZone) {

    this.form = formBuilder.group({
      author: ['', Validators.required],
      date: ['', Validators.required],
      data: ['', Validators.required],
      tags: ['']
    });

  }

  ngOnInit() {
    this.getFiles();
    const mql: MediaQueryList = window.matchMedia('(min-width: 768px)');

    mql.addListener((res: MediaQueryList) => {
      this.zone.run( () => { // Change the property within the zone, CD will run after
        this.toggled = res.matches;
      });
    });
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
      node.icon = AppComponent.FILE_ICON;
    } else {
      node.data = 0;
      node.expandedIcon = AppComponent.OPEN_FOLDER_ICON;
      node.collapsedIcon = AppComponent.COLLAPSED_FOLDER_ICON;
      node.expanded = expanded;

      node.children = (file as Folder).children.map((child) => this.convertFileToTreeNode(child, expanded));
    }
    return node;
  }

  toggleMenu(event: Event) {
    this.toggled = !this.toggled;
  }

  showFileContents() {
    if (this.selectedNode.data !== 0) {
      this.fileService.findSpeechFileById(this.selectedNode.data)
        .subscribe((file: SpeechFile) => {
          this.selectedFile = file;
          this.patchFormValues(this.selectedFile);
        });
    } else {
      this.selectedNode.expanded = !this.selectedNode.expanded;
    }
  }

  private patchFormValues(file: SpeechFile){
    this.form.controls.author.patchValue(this.selectedFile.author);
    this.form.controls.date.patchValue(this.selectedFile.date);
    this.form.controls.data.patchValue(this.selectedFile.data);
    this.form.controls.tags.patchValue(this.selectedFile.tags);
  }


  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure that you to delete file "My election speech 2017" ?',
      accept: () => {
        // Actual logic to perform a confirmation
      }
    });
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

  save() {
    if (this.selectedFile) {
      this.fileService.modifySpeechFile(this.selectedFile, this.form.value).subscribe((file) => {
        this.selectedFile = file;
        this.patchFormValues(this.selectedFile);

        this.infoMessages.push({
          severity: 'info',
          summary: 'Saving successful',
          detail: `Updating of file '${this.selectedFile.label}' is successful`
        });

        // hack! there is a bug with growl not automatically dismissing
        setTimeout(() => this.infoMessages = [], 2000);
      });
    } else {
      // ask user where to save. allow saving at root folder. expand the said folder
    }
  }
}
