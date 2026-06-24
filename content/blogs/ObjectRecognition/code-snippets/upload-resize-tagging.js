// Replace with your Filestack API key, policy, and signature
    const apiKey = 'YOUR_API_KEY';
    const policy = 'YOUR_POLICY';
    const signature = 'YOUR_SIGNATURE';

    // Initialize Filestack client
    const client = filestack.init(apiKey);

    // Add click event listener to the upload button
    document.getElementById('uploadBtn').addEventListener('click', () => {
      client.pick().then(result => {
        const fileHandle = result.filesUploaded[0].handle;

        // Resize the image using Filestack transformations
        const resizedImageUrl = `https://cdn.filestackcontent.com/resize=width:600,height:600,fit:clip/${fileHandle}`;
        const uploadedImageElement = document.getElementById('uploadedImage');
        uploadedImageElement.src = resizedImageUrl;
        uploadedImageElement.style.display = 'block';

        // Fetch AI tags
        const tagsUrl = `https://cdn.filestackcontent.com/security=p:${policy},s:${signature}/tags/${fileHandle}`;
        fetch(tagsUrl)
          .then(response => response.json())
          .then(data => {
            const tags = data.tags.auto || {};
            const objectList = document.getElementById('objectList');
            objectList.innerHTML = '';

            // Display tags and confidence
            Object.keys(tags).forEach(tag => {
              const li = document.createElement('li');
              li.textContent = `${tag} (Confidence: ${tags[tag]}%)`;
              objectList.appendChild(li);
            });

            document.getElementById('results').style.display = 'block';
          })
          .catch(error => {
            console.error('Error fetching tags:', error);
            alert('An error occurred while fetching image tags.');
          });
      }).catch(error => {
        console.error('File upload error:', error);
        alert('An error occurred while uploading the image.');
      });
    });
