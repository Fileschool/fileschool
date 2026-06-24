// Replace with your actual Filestack API key
const client = filestack.init('YOUR_API_KEY');

// Method 1: File Picker

  function openPicker() {
    client.picker({
      onUploadDone: (res) => {
        // Log or handle the uploaded file(s)
        console.log('Files uploaded:', res.filesUploaded);

        // Example: display the uploaded file if it’s an image or PDF
        const firstFile = res.filesUploaded[0];
        document.body.insertAdjacentHTML(
          'beforeend',
          `<p>Uploaded file URL: <a href="${firstFile.url}" target="_blank">${firstFile.filename}</a></p>`
        );
      }
    }).open();
  }

// Method 2: Custom SDK Upload
function uploadWithFilestack(file) {
  const status = document.getElementById('uploadStatus');
  status.textContent = 'Uploading...';

  client.upload(file)
    .then(() => {
      status.textContent = 'Upload complete!';
    })
    .catch(() => {
      status.textContent = 'Upload failed.';
    });
}
