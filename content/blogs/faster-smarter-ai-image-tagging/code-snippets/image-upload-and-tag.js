// Replace with your Filestack API key, policy, and signature
    const apiKey = 'YOUR_API_KEY'; 
    const policy = 'YOUR_POLICY'; 
    const signature = 'YOUR_SIGNATURE'; 

    // Initialize Filestack client
    const client = filestack.init(apiKey);

    // Add click event listener to the upload button
    document.getElementById('uploadBtn').addEventListener('click', () => {
      client.pick()
        .then(result => {
          // Get the handle and URL of the uploaded file
          const handle = result.filesUploaded[0].handle;
          const imageUrl = result.filesUploaded[0].url;

          // Display the uploaded image
          const uploadedImageElement = document.getElementById('uploadedImage');
          uploadedImageElement.src = imageUrl;
          uploadedImageElement.style.display = 'block';

          // Construct the URL to fetch tags
          const tagsUrl = `https://cdn.filestackcontent.com/security=p:${policy},s:${signature}/tags/${handle}`;

          // Fetch the tags for the uploaded image
          fetch(tagsUrl)
            .then(response => response.text())
            .then(text => {
              console.log('Response:', text); // Debug the raw response
              const data = JSON.parse(text);

              // Check if tags exist and display them
              if (data.tags && data.tags.auto) {
                const tagNames = Object.keys(data.tags.auto);
                const tags = tagNames.join(', ');
                document.getElementById('tags').textContent = tags;
              } else {
                document.getElementById('tags').textContent = 'No tags found for this image.';
              }
            })
            .catch(error => {
              console.error('Error fetching tags:', error);
              document.getElementById('tags').textContent = 'Error fetching tags.';
            });
        })
        .catch(error => {
          console.error('File upload error:', error);
          document.getElementById('tags').textContent = 'Error uploading image.';
        });
    });
