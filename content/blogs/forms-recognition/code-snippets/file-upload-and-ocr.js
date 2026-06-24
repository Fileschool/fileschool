const apikey = 'YOUR_API_KEY'; // Replace with your Filestack API key
        const client = filestack.init(apikey);


        function openFilePicker() {
            const options = {
                onUploadDone: (res) => {
                    const fileHandle = res.filesUploaded[0].handle;
                    performOCR(fileHandle);
                }
            };
            client.picker(options).open();
        }


        function performOCR(fileHandle) {
            const policy = 'YOUR_POLICY'; // Replace with your Filestack policy
            const signature = 'YOUR_SIGNATURE'; // Replace with your Filestack signature
            const ocrUrl = `https://cdn.filestackcontent.com/${apikey}/security=p:${policy},s:${signature}/ocr/${fileHandle}`;


            document.getElementById('errorMessage').innerText = "Processing...";


            fetch(ocrUrl)
                .then(response => response.json())
                .then(data => {
                    if (data && data.text) {
                        document.getElementById('ocrText').innerText = data.text;
                        document.getElementById('ocrResult').style.display = 'block';
                        document.getElementById('uploadButton').style.display = 'none';
                        document.getElementById('errorMessage').innerText = '';
                    } else {
                        showError("No text found in the uploaded form.");
                    }
                })
                .catch(() => showError("An error occurred while processing the form. Please try again."));
        }


        function showError(message) {
            document.getElementById('errorMessage').innerText = message;
        }


        function resetApp() {
            document.getElementById('ocrResult').style.display = 'none';
            document.getElementById('uploadButton').style.display = 'inline-block';
            document.getElementById('ocrText').innerText = '';
            document.getElementById('errorMessage').innerText = '';
        }
