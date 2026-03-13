// Angular module setup example
// Run after: npm i @filestack/angular filestack-js

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { FilestackModule } from "@filestack/angular";

const API_KEY = "YOUR_API_KEY"; // Replace with your Filestack API key

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FilestackModule.forRoot({ apikey: API_KEY }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
