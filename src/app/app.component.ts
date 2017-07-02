import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MenuItem, TreeNode} from 'primeng/primeng';
import {FileService} from "./file.service";
import {File} from "../model/File";
import {SpeechFile} from "../model/SpeechFile";
import {Folder} from "../model/Folder";

import * as _ from "lodash"
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EditorSidebarComponent} from "./editor-sidebar/editor-sidebar.component";

const stringify = require('json-stringify-safe');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('editorSidebar')
  sidebar: EditorSidebarComponent;

  toggled = true; // sidebar
  selectedFile: SpeechFile;
  form: FormGroup;
  infoMessages = [];

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
    const mql: MediaQueryList = window.matchMedia('(min-width: 768px)');

    mql.addListener((res: MediaQueryList) => {
      this.zone.run( () => { // Change the property within the zone, CD will run after
        this.toggled = res.matches;
      });
    });
  }



  toggleMenu(event: Event) {
    this.toggled = !this.toggled;
  }

  showFileContents(fileId: number) {
    this.fileService.findSpeechFileById(fileId)
      .subscribe((file: SpeechFile) => {
        this.selectedFile = file;
        this.patchFormValues(this.selectedFile);
      });
  }

  private patchFormValues(file: SpeechFile) {
    this.form.controls.author.patchValue(this.selectedFile.author);
    this.form.controls.date.patchValue(this.selectedFile.date);
    this.form.controls.data.patchValue(this.selectedFile.data);
    this.form.controls.tags.patchValue(this.selectedFile.tags);
  }


  confirmDelete() {
    this.confirmationService.confirm({
      message: `Are you sure that you to delete file '${this.selectedFile.label}' ?`,
      accept: () => {
        this.fileService.delete(this.selectedFile);
        this.sidebar.removeSelectedNode();
        this.showMessage('Delete successful', `Deletion of file '${this.selectedFile.label}' is successful`, 'warn');
      }
    });
  }

  save() {
    if (this.selectedFile) {
      this.fileService.modifySpeechFile(this.selectedFile, this.form.value).subscribe((file) => {
        this.selectedFile = file;
        this.patchFormValues(this.selectedFile);
        this.showMessage('Saving successful', `Updating of file '${this.selectedFile.label}' is successful`);
      });
    } else {
      this.showMessage("Not implemented", "Saving new file is not yet implemented");
    }
  }

  private showMessage(title: string, message: string, severity = 'info') {
    this.infoMessages.push({
      severity: severity,
      summary: title,
      detail: message
    });

    // hack! there is a bug with growl not automatically dismissing
    setTimeout(() => this.infoMessages = [], 2000);
  }

  clearSelectedFile() {
    this.selectedFile = null;
    this.form.reset();
  }
}
