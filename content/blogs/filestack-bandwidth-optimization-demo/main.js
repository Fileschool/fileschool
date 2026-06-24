const client = filestack.init("YOUR_API_KEY"); // Replace the placeholder with your Filestack API Key

document
  .getElementById("uploadBtn")
  .addEventListener("click", async function () {

    const options = {
      maxFiles: 1,
      accept: ["image/*", "video/mp4"],
      maxSize: 5 * 1024 * 1024, // 5MB limit
      onUploadDone: handleUpload,
    };

    client.picker(options).open();
  });

async function handleUpload(result) {
  const file = result.filesUploaded[0];
  const handle = file.handle;

  const optimizedURL = `https://cdn.filestackcontent.com/resize=width:600,fit:max/compress/output=format:webp,quality:80/${handle}`;

  const secureURL = `https://cdn.filestackcontent.com/security=policy:YOUR_POLICY,signature:YOUR_SIGNATURE/${handle}`; // Replace the placeholders with your policy and signature created in Filestack dashboard Security section

  document.getElementById("output").innerHTML = `
    <p><strong>Original File (CDN URL):</strong></p>
    <img src="${file.url}" width="300" />

    <p><strong>Optimized Version (Reduced CDN Bandwidth):</strong></p>
    <img src="${optimizedURL}" width="300" />

    <p><strong>Signed Delivery (Hotlink-Protected):</strong></p>
    <img src="${secureURL}" width="300" />
  `;
}
