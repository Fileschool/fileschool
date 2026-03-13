// ES Module upload example
// Run with a bundler (Webpack, Vite, etc.) after: npm install filestack-js

import * as filestack from "filestack-js";

const API_KEY = "YOUR_API_KEY"; // Replace with your Filestack API key

const client = filestack.init(API_KEY);

client.picker({
  onUploadDone: (result) => {
    console.log("Uploaded:", result.filesUploaded[0].url);
  },
}).open();
