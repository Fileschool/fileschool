# Angular SDK (@filestack/angular)

**GitHub:** [filestack/filestack-angular](https://github.com/filestack/filestack-angular)
**Requires:** Angular 12+

Official Angular library wrapping `filestack-js`. Exposes picker components and a `FilestackService` for use with Observables.

---

## Installation

```bash
npm i @filestack/angular filestack-js
```

---

## Setup

### Step 1 — Import `FilestackModule`

> Full example: [`examples/angular/app.module.ts`](../examples/angular/app.module.ts)

```ts
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { FilestackModule } from "@filestack/angular";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FilestackModule.forRoot({ apikey: "YOUR_API_KEY" })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Step 2 — Add the picker to a template

```html
<!-- app.component.html -->
<ng-picker-overlay
  [apikey]="apikey"
  (uploadSuccess)="onUploadSuccess($event)"
  (uploadError)="onUploadError($event)">
  <button>Open Filestack Picker</button>
</ng-picker-overlay>
```

### Step 3 — Set up the component class

> Full example: [`examples/angular/app.component.ts`](../examples/angular/app.component.ts)

```ts
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
  apikey: string;

  ngOnInit() {
    this.apikey = "YOUR_API_KEY";
  }

  onUploadSuccess(res: object) {
    console.log("Upload success:", res);
  }

  onUploadError(err: any) {
    console.log("Upload error:", err);
  }
}
```

---

## Back to main guide

[← README](../README.md)
