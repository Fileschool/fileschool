// Include the Filestack JavaScript SDK
src="https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"

// Initialize the SDK
const client = filestack.init('YOUR_API_KEY'); // Replace with your Filestack API Key 

    document.getElementById('filePicker').addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (!file) {
        alert('Please select a file!');
        return;
      }

      // File upload with Filestack
      try {
        const uploadResponse = await client.upload(file);
        const fileHandle = uploadResponse.handle;
        const originalImageUrl = `https://cdn.filestackcontent.com/${fileHandle}`;

        // Generate URLs for normal and smart crops
        const normalCropUrl = `https://cdn.filestackcontent.com/resize=w:576,h:1024,fit:crop/${fileHandle}`;
        const smartCropUrl = `https://cdn.filestackcontent.com/smart_crop=width:576,height:1024,mode:face/${fileHandle}`;

        displayImages(originalImageUrl, normalCropUrl, smartCropUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('File upload failed.');
      }
    });

// Dynamically generate <img> tags for the images and captions    
function displayImages(original, normal, smart) {
      const outputDiv = document.getElementById('imageOutput');
      outputDiv.innerHTML = `
        <div>
          <img src="${original}" alt="Original Image">
          <p>Original Image</p>
        </div>
        <div>
          <img src="${normal}" alt="Normal Crop">
          <p>Normal Crop (9:16)</p>
        </div>
        <div>
          <img src="${smart}" alt="Smart Crop">
          <p>Smart Crop (9:16)</p>
        </div>
      `;
    }
