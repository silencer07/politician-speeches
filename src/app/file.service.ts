import { Injectable } from '@angular/core';
import {TreeNode} from 'primeng/primeng';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
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

  findSpeechFileById(id: number): Observable<SpeechFile> {
    return this.getFiles().map((files: Array<File>) => {
      const result: File = files.find((file) => file.id === id);

      if (result) {
        return result as SpeechFile;
      }

      return files.filter((file) => file.id === 0)
        .map((folder) => this.findSpeechFileByIdAndFolder(id, folder as Folder))
        .find((file) => file != null);
    })
  }

  findSpeechFileByIdAndFolder(id: number, folder: Folder): SpeechFile {
    const result = folder.children.find((child) => child.id === id);
    if (result) {
      return result as SpeechFile;
    }

    const children = folder.children.filter((child) => child.id === 0);
    if (children.length) {
      return children.map((child) => this.findSpeechFileByIdAndFolder(id, child as Folder))
        .find((file) => file != null);
    }

    return null;
  }

  // title, tag, text, author
  search(query: string): Observable<Array<File>> {
    return this.getFiles()
      .map((files: Array<File>) =>
        files.slice()
          .map((file) => _.cloneDeep(file))
          .filter(file => this.filterByQuery(file, query))
      );
  }

  private filterByQuery(file: File, query): boolean {
    const q = query.toLowerCase();
    if (file.id) {
      const speechFile = file as  SpeechFile;
      return speechFile.label.toLowerCase().includes(q) ||
        speechFile.tags.filter((tag) => tag.toLowerCase().includes(q)).length > 0 ||
        speechFile.data.toLowerCase().includes(q) ||
        speechFile.author.toLowerCase().includes(q);
    } else {
      const folder = file as Folder;
      folder.children = folder.children.filter((child) => this.filterByQuery(child, q));
      return folder.children.length > 0;
    }
  }

  modifySpeechFile(file: SpeechFile, modification: any) {
    return Observable.of(_.merge(file, modification));
  }

  delete(toDelete: SpeechFile) {
    const folder = toDelete.parent;
    const index = folder.children.findIndex((file) => file.id === toDelete.id);
    folder.children.splice(index, 1);
  }

}
