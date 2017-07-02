import {Component, NgZone, OnInit, ViewChild} from "@angular/core";
import {FileService} from "./file.service";
import {SpeechFile} from "../model/SpeechFile";
import {EditorSidebarComponent} from "./editor-sidebar/editor-sidebar.component";
import {EditorComponent} from "./editor/editor.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('editorSidebar')
  sidebar: EditorSidebarComponent;

  @ViewChild('editor')
  editor: EditorComponent;

  toggled = true; // sidebar
  selectedFile: SpeechFile;


  constructor(private fileService: FileService, private zone: NgZone) {}

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

  getFile(fileId: number) {
    this.fileService.findSpeechFileById(fileId)
      .subscribe((file: SpeechFile) => {
        this.selectedFile = file;
      });
  }
}
