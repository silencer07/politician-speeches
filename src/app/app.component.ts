import {Component, OnInit} from '@angular/core';
import {TreeModule, TreeNode} from 'primeng/primeng';
import {FileService} from "./file.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  files: TreeNode[];
  toggled = true;

  constructor(private fileService: FileService) {}

  ngOnInit() {
    this.fileService.getFiles().subscribe((files) => this.files = files);
  }

  toggleMenu(event: Event) {
   this.toggled = !this.toggled;
  }
}
