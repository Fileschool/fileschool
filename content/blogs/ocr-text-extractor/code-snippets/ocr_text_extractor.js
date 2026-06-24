window.onload = function() {
            const filestackClient = filestack.init('YOUR_API_KEY'); // Replace with your Filestack API Key 

            window.uploadFile = function() {
                filestackClient.picker({
                    accept: ['image/*', 'application/pdf'],
                    uploadInBackground: false, // Background upload is disabled to avoid conflicts when the cropper is enabled
                    onUploadDone: (response) => {
                        const fileUrl = response.filesUploaded[0].url;
                        const fileHandle = response.filesUploaded[0].handle;
                        displayImage(fileUrl);
                        extractText(fileHandle);
                    }
                }).open();
            };

            function displayImage(fileUrl) {
                document.getElementById('image-preview').innerHTML = 
                    `<img src="${fileUrl}" class="uploaded-image">`;
            }

            function extractText(fileHandle) {
                const policy = 'YOUR_POLICY'; // Replace with your generated policy
                const signature = 'YOUR_SECURITY'; // Replace with your generated signature
                fetch(`https://cdn.filestackcontent.com/security=p:${policy},s:${signature}/ocr/${fileHandle}`)
                    .then(res => res.json())
                    .then(data => {
                        document.getElementById('text-output').value = data.text || 'No text detected.';
                    })
                    .catch(error => {
                        console.error('Error extracting text:', error);
                        document.getElementById('text-output').value = 'Error processing file.';
                    });
            }
        };
