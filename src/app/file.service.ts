import { Injectable } from '@angular/core';
import {TreeNode} from 'primeng/primeng';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map'

@Injectable()
export class FileService {

  constructor(private http: Http) { }

  getFiles(): Observable<TreeNode[]> {
    return this.http.get('assets/data/files.json').map((res) => <TreeNode[]> res.json());
  }

}
