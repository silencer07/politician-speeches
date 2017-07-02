import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {FileService} from './file.service';
import {HttpModule} from '@angular/http';
import {
  CalendarModule, ConfirmationService, ConfirmDialogModule, ContextMenuModule, EditorModule, GrowlModule, SharedModule,
  TieredMenuModule,
  TreeModule
} from "primeng/primeng";
import {TagInputModule} from "ng2-tag-input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { EditorSidebarComponent } from './editor-sidebar/editor-sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorSidebarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    TreeModule,
    SharedModule,
    TagInputModule,
    CalendarModule,
    EditorModule,
    TieredMenuModule,
    ConfirmDialogModule,
    GrowlModule,
    ContextMenuModule
  ],
  providers: [
    FileService,
    ConfirmationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
