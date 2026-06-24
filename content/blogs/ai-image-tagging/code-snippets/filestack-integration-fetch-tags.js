// Replace placeholders with your Filestack API credentials
        const apiKey = 'YOUR_API_KEY';
        const policy = 'YOUR_POLICY';
        const signature = 'YOUR_SIGNATURE';

        // Initialize the Filestack client
        const client = filestack.init(apiKey);

        // Add an event listener to the upload button
        document.getElementById('uploadBtn').addEventListener('click', function () {
            // Open the Filestack File Picker
            client.pick().then(function (result) {
                // Get the handle of the uploaded file
                const handle = result.filesUploaded[0].handle;

                // Construct the URL to fetch tags
                const tagsUrl = `https://cdn.filestackcontent.com/${apiKey}/security=p:${policy},s:${signature}/tags/${handle}`;

                // Fetch the tags using the constructed URL
                fetch(tagsUrl)
                    .then(response => response.json()) // Parse the response as JSON
                    .then(data => {
                        // Check if tags exist and are auto-generated
                        if (data.tags && data.tags.auto) {
                            // Extract tag names
                            const tagNames = Object.keys(data.tags.auto);
                            // Join tag names into a comma-separated string
                            const tags = tagNames.join(', ');
                            // Display tags in the tags paragraph
                            document.getElementById('tags').textContent = tags;
                        } else {
                            // Display a message if no tags are found
                            document.getElementById('tags').textContent = 'No tags found for this image.';
                        }
                    })
                    .catch(error => {
                        // Display an error message if fetching tags fails
                        document.getElementById('tags').textContent = 'Error fetching tags.';
                    });
            }).catch(function (error) {
                // Log errors related to file upload
                console.error('File upload error:', error);
            });
        });
