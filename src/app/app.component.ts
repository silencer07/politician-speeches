import {Component, NgZone, OnInit} from '@angular/core';
import {ConfirmationService, MenuItem, TreeModule, TreeNode} from 'primeng/primeng';
import {FileService} from "./file.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  files: TreeNode[];
  toggled = true;
  keywords = '';

  constructor(private confirmationService: ConfirmationService, private fileService: FileService, private zone: NgZone) {}

  ngOnInit() {
    this.fileService.getFiles().subscribe((files) => this.files = files);

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


  confirmDelete(){
    this.confirmationService.confirm({
      message: 'Are you sure that you to delete file "My election speech 2017" ?',
      accept: () => {
        // Actual logic to perform a confirmation
      }
    });
  }
}
