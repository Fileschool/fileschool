src="https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"
 
    const FILESTACK_API_KEY = 'YOUR_API_KEY'; //Replace with your Filestack API key 
    const policy = 'YOUR_POLICY'; //Replace with your Policy generated in Filestack dashboard 
    const signature = 'YOUR_SIGNATURE'; //Replace with your Signature generated in Filestack dashboard 

    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('upload-btn').addEventListener('click', function() {
        // Open Filestack file uploader
        filestackFileUpload();
      });

      // Function to open Filestack file uploader
      function filestackFileUpload() {
        const client = filestack.init(FILESTACK_API_KEY);

        const options = {
          onUploadDone: function(result) {
            console.log('Filestack upload result:', result);
            const fileHandle = result.filesUploaded[0].handle;
            performOCR(fileHandle);
          },
          accept: ['image/*']
        };

        client.picker(options).open();
      }
      
     // Function to perform OCR
      function performOCR(fileHandle) {
        const ocrUrl = `https://cdn.filestackcontent.com/${FILESTACK_API_KEY}/security=p:${policy},s:${signature}/ocr/${fileHandle}`;

        fetch(ocrUrl)
        .then(response => response.json())
        .then(data => {
          console.log('OCR data:', data);
          const ocrText = data.text;
          document.getElementById('ocr-output').style.display = 'block';
          document.getElementById('ocr-text').textContent = 'OCR Result:\n' + ocrText;
        })
        .catch(error => console.error('Error performing OCR:', error));
      }
    });
