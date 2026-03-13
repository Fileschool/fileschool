// React PickerOverlay example
// Run after: npm install filestack-react filestack-js

import React, { useState } from "react";
import { PickerOverlay } from "filestack-react";

const API_KEY = "YOUR_API_KEY"; // Replace with your Filestack API key

function App() {
  const [uploadedUrl, setUploadedUrl] = useState(null);

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Filestack React Demo</h1>

      <PickerOverlay
        apikey={API_KEY}
        onSuccess={(res) => console.log("Success:", res)}
        onUploadDone={(res) => {
          const url = res.filesUploaded[0]?.url;
          if (url) setUploadedUrl(url);
          console.log("Uploaded URL:", url);
        }}
      />

      {uploadedUrl && (
        <p>
          Uploaded:{" "}
          <a href={uploadedUrl} target="_blank" rel="noreferrer">
            {uploadedUrl}
          </a>
        </p>
      )}
    </div>
  );
}

export default App;
