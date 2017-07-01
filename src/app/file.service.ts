import { Injectable } from '@angular/core';
import {TreeNode} from 'primeng/primeng';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map'
import {SpeechFile} from "../model/SpeechFile";
import * as _ from "lodash";
import {Folder} from "../model/Folder";
import {File} from "../model/File";

@Injectable()
export class FileService {

  private files: Array<File> = [];

  constructor(private http: Http) { }

  getFiles(): Observable<Array<File>> {
    if (!this.files.length) {
      return this.http.get('assets/data/files.json')
        .map((res: Response) => {
          this.files = res.json().map((datus) => this.createSpeechFileOrFolder(datus, null));
          return this.files;
        });
    }
    return Observable.of(this.files);
  }

  private createSpeechFile(data: any, folder: Folder): File{
    const file: SpeechFile = _.merge({}, data);
    file.parent = folder;
    folder.children.push(file);
    return file;
  }

  private createFolder(data: any, parent: Folder): Folder {
    const folder: Folder = _.merge({}, data);
    folder.id = 0;
    folder.parent = parent;

    if (parent) {
      parent.children.push(folder);
    }

    folder.children = data.children.map((datus: any) => this.createSpeechFileOrFolder(datus, folder));
    return folder;
  }

  private createSpeechFileOrFolder(data, folder): File {
    if (data.id) {
      return this.createSpeechFile(data, folder);
    } else {
      return this.createFolder(data, folder);
    }
  }

}
