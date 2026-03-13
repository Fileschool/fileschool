# React SDK (filestack-react)

**GitHub:** [filestack/filestack-react](https://github.com/filestack/filestack-react)
**Requires:** React 18+

A wrapper around `filestack-js` that provides ready-to-use React components: `PickerOverlay`, `PickerInline`, and `PickerDropPane`.

---

## Installation

```bash
npm install filestack-react filestack-js
```

---

## Components

### PickerOverlay — Modal

Opens the picker as a modal overlay.

> Full example: [`examples/react/PickerOverlayApp.jsx`](../examples/react/PickerOverlayApp.jsx)

```jsx
import { PickerOverlay } from "filestack-react";

function App() {
  return (
    <PickerOverlay
      apikey="YOUR_API_KEY"
      onSuccess={(res) => console.log("Success:", res)}
      onUploadDone={(res) => {
        const url = res.filesUploaded[0].url;
        console.log("Uploaded URL:", url);
      }}
    />
  );
}

export default App;
```

---

### PickerInline — Embedded

Embeds the picker directly in the page.

```jsx
import { PickerInline } from "filestack-react";

function App() {
  return (
    <div style={{ height: 500 }}>
      <PickerInline
        apikey="YOUR_API_KEY"
        onUploadDone={(res) => console.log(res)}
      />
    </div>
  );
}
```

---

### PickerDropPane — Drag & Drop

A minimal drag-and-drop zone.

```jsx
import { PickerDropPane } from "filestack-react";

function App() {
  return (
    <PickerDropPane
      apikey="YOUR_API_KEY"
      onUploadDone={(res) => console.log(res)}
    />
  );
}
```

---

## Notes

- **SSR (Next.js / Gatsby):** Import the component dynamically with `ssr: false` to avoid server-side rendering issues.

```js
// Next.js
import dynamic from "next/dynamic";

const PickerOverlay = dynamic(
  () => import("filestack-react").then((mod) => mod.PickerOverlay),
  { ssr: false }
);
```

---

## Back to main guide

[← README](../README.md)
