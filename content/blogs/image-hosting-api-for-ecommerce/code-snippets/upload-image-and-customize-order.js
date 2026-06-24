// Initialize Filestack client

        const client = filestack.init('YOUR_API_KEY'); //Replace the placeholder with your Filestack API Key


        // Upload button click event

        document.getElementById('uploadBtn').addEventListener('click', () => {

            client.picker({

                onUploadDone: (result) => {

                    // Get uploaded file URL and show preview

                    const fileUrl = result.filesUploaded[0].url;

                    document.getElementById('previewImage').src = fileUrl;

                    document.getElementById('previewImage').classList.remove('hidden');

                    document.getElementById('customizationForm').classList.remove('hidden');

                }

            }).open();

        });


        // Submit button click event

        document.getElementById('submitBtn').addEventListener('click', () => {

            const quantity = document.getElementById('quantity').value;

            const color = document.getElementById('color').value;

            const size = document.getElementById('size').value;

           

            // Validate quantity input

            if (!quantity || quantity < 1) {

                alert("Please enter a valid quantity.");

                return;

            }


            // Display order confirmation

            document.getElementById('finalDetails').innerText =

                `Quantity: ${quantity}, Color: ${color}, Size: ${size}`;

           

            document.getElementById('customizationForm').classList.add('hidden');

            document.getElementById('confirmationMessage').classList.remove('hidden');

            document.getElementById('resetBtn').classList.remove('hidden');

        });



        // Reset button click event

        document.getElementById('resetBtn').addEventListener('click', () => {

            // Reset the form and hide elements

            document.getElementById('previewImage').src = '';

            document.getElementById('previewImage').classList.add('hidden');

            document.getElementById('customizationForm').classList.add('hidden');

            document.getElementById('confirmationMessage').classList.add('hidden');

            document.getElementById('resetBtn').classList.add('hidden');

        });
