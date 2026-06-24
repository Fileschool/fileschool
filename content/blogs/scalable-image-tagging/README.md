# Filestack AI Image Tagging Example

This project demonstrates how to integrate Filestack's scalable image tagging into your web application. Using Filestack's API and JavaScript SDK, you can upload images, process them with transformations, and tag them automatically using AI-powered technology.

## Key Features
- **Upload Button**: A button that triggers the Filestack file picker, allowing users to select an image from their local system or a variety of popular sources..
- **Image Display**: Dynamically displays the uploaded image in a designated container.
- **AI-Generated Tagging**: Filestack’s AI analyzes the uploaded image and generates descriptive tags, providing insights into the image's content.
- **Dynamic Updates**: The result container automatically clears and updates with each new image upload.
- **Responsive Design**: The page is styled for clarity and functionality, offering a user-friendly layout.

---

## Steps to Integrate

### Step 1: Sign Up and Obtain Your Filestack API Key
1. Visit [Filestack](https://www.filestack.com/) and sign up for an account.
2. Navigate to the API dashboard to generate your unique API key.

---

### Step 2: Install the Filestack JavaScript SDK
Add the Filestack JavaScript SDK to your project using one of the following methods:

#### Option 1: Using npm
Run the following command in your terminal or PowerShell:

`npm install filestack-js`

#### Option 2: Using a CDN

Add this `<script>` tag in your HTML file within the `<head>` or at the end of the `<body>` section:

`<script src="https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"></script>`

---

### Step 3: Create HTML Containers for Image and Tags
In the `<body>` section of your HTML file, add an upload button, along with containers to display the uploaded image and its recognized tags. Refer to the code in `code-snippets/filestack-image-tagging-example.html`.

---

### Step 4: Initialize Filestack in Your App
Set up the Filestack client in your app by replacing `YOUR_API_KEY` with your unique API key:

`const client = filestack.init('YOUR_API_KEY');`

---

### Step 5: Implement Image Upload, Transformation, and Tagging Logic
Attach an event listener to the upload button to:

- Open the Filestack file picker.
- Resize the uploaded image using Filestack transformations.
- Fetch AI-generated tags and display them dynamically.
  
Refer to the code in `code-snippets/filestack-image-tagging.js`.

---

### Step 6: Store or Display Tags

You can store the generated tags in your database or use them to enhance your app’s search functionality.

---

### Complete Example

See the complete example of the HTML file in `demo/index.html`.

---

### Steps to Use

1. Replace `YOUR_API_KEY`, `YOUR_POLICY`, and `YOUR_SIGNATURE` with your valid [Filestack API key](https://www.filestack.com/signup-free/), [policy, and signature](https://www.filestack.com/docs/security/policies/).
2. Save the file as `index.html`.
3. Open the file in a browser. For best results, test the script on a local web server to avoid CORS issues.
4. Click the `Upload an Image` button to select an image and experience scalable image tagging in action.

---

### License
This example is provided under the MIT License.

---

Check out our article, [The Ultimate Guide to Scalable Image Tagging](https://blog.filestack.com/the-ultimate-guide-to-scalable-image-tagging/), for more insights.



