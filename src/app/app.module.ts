import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {FileService} from './file.service';
import {HttpModule} from '@angular/http';
import {CalendarModule, SharedModule, TreeModule} from "primeng/primeng";
import {TagInputModule} from "ng2-tag-input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    TreeModule,
    SharedModule,
    TagInputModule,
    CalendarModule
  ],
  providers: [
    FileService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
