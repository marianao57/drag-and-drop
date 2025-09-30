import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UploadDocumentsComponent } from './components/upload-documents/upload-documents.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    UploadDocumentsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }