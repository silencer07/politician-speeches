import {Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConfirmationService} from "primeng/primeng";
import {FileService} from "../file.service";
import {SpeechFile} from "../../model/SpeechFile";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnChanges {

  form: FormGroup;
  infoMessages = [];

  @Input()
  file: SpeechFile;

  onDeleteSuccess: EventEmitter<SpeechFile> = new EventEmitter<SpeechFile>();

  constructor(private formBuilder: FormBuilder, private confirmationService: ConfirmationService,
              private fileService: FileService) {
    this.form = formBuilder.group({
      author: ['', Validators.required],
      date: ['', Validators.required],
      data: ['', Validators.required],
      tags: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.file.currentValue) {
      this.patchFormValues(changes.file.currentValue);
    }
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: `Are you sure that you to delete file '${this.file.label}' ?`,
      accept: () => {
        this.fileService.delete(this.file);
        this.showMessage('Delete successful', `Deletion of file '${this.file.label}' is successful`, 'warn');

        this.onDeleteSuccess.emit(this.file);
      }
    });
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

  save() {
    if (this.file) {
      this.fileService.modifySpeechFile(this.file, this.form.value).subscribe((file) => {
        this.file = file;
        this.patchFormValues(this.file);
        this.showMessage('Saving successful', `Updating of file '${this.file.label}' is successful`);
      });
    } else {
      this.showMessage("Not implemented", "Saving new file is not yet implemented");
    }
  }

  private patchFormValues(file: SpeechFile) {
    this.form.controls.author.patchValue(this.file.author);
    this.form.controls.date.patchValue(this.file.date);
    this.form.controls.data.patchValue(this.file.data);
    this.form.controls.tags.patchValue(this.file.tags);
  }

  reset() {
    this.file = null;
    this.form.reset();
  }
}
