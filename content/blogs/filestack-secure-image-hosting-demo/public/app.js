let filestackClient = null;
let data = null;

// Fetch security details from backend, then initialize client
async function initFilestackClient() {
  try {
    const res = await fetch("/api/filestack-security");
    data = await res.json();

    if (!data.apiKey || !data.policy || !data.signature) {
      console.error("Invalid security payload from server:", data);
      alert("Error: Could not initialize Filestack. Check the server logs.");
      return;
    }

    filestackClient = filestack.init(data.apiKey, {
      security: {
        policy: data.policy,
        signature: data.signature
      }
    });

    console.log("Filestack client initialized with secure policy.");
  } catch (err) {
    console.error("Failed to initialize Filestack:", err);
    alert("Error: Failed to contact server for Filestack security.");
  }
}

async function openPicker() {
  if (!filestackClient) {
    await initFilestackClient();
  }

  if (!filestackClient) {
    return;
  }

  filestackClient
    .picker({
      accept: ["image/*"],
      maxFiles: 1,
      uploadConfig: {
        intelligent: true // handles big files + flaky networks
      },
      onUploadDone: handleUploadDone
    })
    .open();
}

function handleUploadDone(result) {
  if (!result.filesUploaded || result.filesUploaded.length === 0) {
    alert("No files were uploaded.");
    return;
  }

  const file = result.filesUploaded[0];
  const cdnUrl = file.url;
  const handle = file.handle;

  // Show preview box
  const resultBox = document.getElementById("resultBox");
  const previewImage = document.getElementById("previewImage");
  const cdnUrlBox = document.getElementById("cdnUrl");
  const transformedImage = document.getElementById("transformedImage");

  resultBox.classList.remove("hidden");
  previewImage.src = cdnUrl;
  cdnUrlBox.textContent = cdnUrl;

  // Apply a secure transformation (resize + quality)
  const transformedUrl = `https://cdn.filestackcontent.com/security=policy:${data.policy},signature:${data.signature}/resize=width:300/output=quality:80/${handle}`;

  transformedImage.src = transformedUrl;
}

// Attach click handler
document.addEventListener("DOMContentLoaded", () => {
  const uploadBtn = document.getElementById("uploadBtn");
  uploadBtn.addEventListener("click", openPicker);
});
