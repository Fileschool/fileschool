// Angular component example

import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <ng-picker-overlay
      [apikey]="apikey"
      (uploadSuccess)="onUploadSuccess($event)"
      (uploadError)="onUploadError($event)">
      <button>Open Filestack Picker</button>
    </ng-picker-overlay>

    <p *ngIf="uploadedUrl">
      Uploaded: <a [href]="uploadedUrl" target="_blank">{{ uploadedUrl }}</a>
    </p>
  `,
})
export class AppComponent implements OnInit {
  apikey: string;
  uploadedUrl: string | null = null;

  ngOnInit() {
    this.apikey = "YOUR_API_KEY"; // Replace with your Filestack API key
  }

  onUploadSuccess(res: any) {
    this.uploadedUrl = res?.filesUploaded?.[0]?.url ?? null;
    console.log("Upload success:", res);
  }

  onUploadError(err: any) {
    console.error("Upload error:", err);
  }
}
