// Filestack API credentials
    const apiKey = 'YOUR_API_KEY'; // Replace with your Filestack API Key 
    const policy = 'YOUR_POLICY'; // Replace with your Filestack policy
    const signature = 'YOUR_SIGNATURE'; // Replace with your Filestack signature

    // Initialize Filestack client
    const client = filestack.init(apiKey);

    // Add event listener for the "Upload Image" button
    document.getElementById('uploadBtn').addEventListener('click', function() {
        client.pick().then(function(result) {
            // Extract file handle after successful upload
            const handle = result.filesUploaded[0].handle;

            // Construct the API URL for tagging
            const tagsUrl = `https://cdn.filestackcontent.com/${apiKey}/security=p:${policy},s:${signature}/tags/${handle}`;

            // Fetch tags from the Filestack API
            fetch(tagsUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.tags && data.tags.auto) {
                        // Extract tag names and generate hashtags
                        const tagNames = Object.keys(data.tags.auto);
                        const hashtags = tagNames.map(tag => `#${tag}`).join(' ');
                        document.getElementById('hashtags').textContent = hashtags;
                    } else {
                        document.getElementById('hashtags').textContent = 'No hashtags found for this image.';
                    }
                })
                .catch(error => {
                    document.getElementById('hashtags').textContent = 'Error fetching hashtags.';
                });
        }).catch(function(error) {
            console.error('File upload error:', error);
        });
    });
