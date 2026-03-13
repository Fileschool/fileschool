# JavaScript SDK (filestack-js)

**GitHub:** [filestack/filestack-js](https://github.com/filestack/filestack-js)
**Environments:** Browser + Node.js

The core JavaScript SDK supports both browser and Node.js environments. It powers the Filestack Picker widget and the full processing/upload API.

---

## Installation

### Option A — npm

```bash
npm install filestack-js
```

### Option B — CDN (no build step)

```html
<script src="//static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"
        crossorigin="anonymous"></script>
```

---

## Usage

### Vanilla HTML via CDN

> Full example: [`examples/javascript/cdn-example.html`](../examples/javascript/cdn-example.html)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Filestack Demo</title>
  <script src="//static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"></script>
</head>
<body>
  <button id="picker">Upload File</button>
  <script>
    const client = filestack.init("YOUR_API_KEY");
    const options = {
      onUploadDone: (res) => console.log(res),
    };
    const picker = client.picker(options);
    document.getElementById("picker")
      .addEventListener("click", () => picker.open());
  </script>
</body>
</html>
```

Open the HTML file directly in a browser to see the uploader in action.

---

### ES Module (npm / bundler)

> Full example: [`examples/javascript/esm-upload.js`](../examples/javascript/esm-upload.js)

```js
import * as filestack from "filestack-js";

const client = filestack.init("YOUR_API_KEY");
client.picker({
  onUploadDone: (result) => {
    console.log("Uploaded:", result.filesUploaded[0].url);
  }
}).open();
```

---

### Node.js — Server-side Upload

> Full example: [`examples/javascript/node-upload.js`](../examples/javascript/node-upload.js)

```js
const client = require("filestack-js").init("YOUR_API_KEY");

async function upload() {
  const result = await client.upload(Buffer.from("hello world"), {}, {
    filename: "hello.txt",
    mimetype: "text/plain"
  });
  console.log("Handle:", result.handle);
  console.log("URL:", result.url);
}

upload();
```

> **Note:** In Node.js, `client.upload` accepts a file path string or a `Buffer`. In the browser, pass a `Blob` or `File` object.

---

## Back to main guide

[← README](../README.md)
