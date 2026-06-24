const client = filestack.init("YOUR_API_KEY_HERE"); // Replace the placeholder text with your Filestack API Key

document.getElementById("uploadBtn").addEventListener("click", () => {
  const studentId = document.getElementById("studentId").value;
  const assignmentId = document.getElementById("assignmentId").value;

  if (!studentId || !assignmentId) {
    alert("Please enter your Student ID and Assignment ID before uploading.");
    return;
  }

  client.picker({

    // Add Filestack virus detection workflow
    storeTo: {
          workflows: ['YOUR_WORKFLOW_ID']  // Replace the placeholder text with your actual workflow ID in Filestack
        },
    maxFiles: 10,
    fromSources: ["local_file_system", "googledrive", "dropbox"],
    accept: [
      ".pdf",
      ".docx",
      ".png",
      ".jpg",
      ".jpeg",
      ".zip",
      "video/*"
    ],
    transformations: {
      
      crop: false,
      circle: false
    },
    onFileSelected: file => {
      if (file.size > 50 * 1024 * 1024) { // 50MB
        alert("One of the files is too large (max 50MB).");
        return false;
      }
      return file;
    },

    uploadInBackground: false,

    // Metadata tagging (super useful for EdTech)
    onUploadDone: result => {
      const uploadedFilesDiv = document.getElementById("uploadedFiles");

      result.filesUploaded.forEach(file => {
        handle = file.handle;
        buildCompressedUrl(handle); // Compress the file

        // Show uploaded file list
        const div = document.createElement("div");
        div.classList.add("file-item");
        div.innerHTML = `
          <strong>${file.filename}</strong><br>
          Size: ${(file.size / 1024 / 1024).toFixed(2)} MB<br>
          CDN URL: <a href="${file.url}" target="_blank">${file.url}</a>
        `;
        uploadedFilesDiv.appendChild(div);

        // Example: Send metadata to your backend
        sendToServer({
          studentId,
          assignmentId,
          filename: file.filename,
          url: file.url,
          mimetype: file.mimetype,
          size: file.size
        });
      });
    }

  }).open();
});


// Simulated backend storage call  
function sendToServer(data) {
  console.log("Saving submission:", data);

  // You can replace this with:
  // fetch("/save-submission", { method: "POST", body: JSON.stringify(data) })
}

// Build compressed file URL with transformations
    function buildCompressedUrl(handle) {
      // compress file
      return `https://cdn.filestackcontent.com/compress/${handle}`;
    }
