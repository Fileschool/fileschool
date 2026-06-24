# File Upload with Filestack

This project demonstrates how to implement a modern file upload feature with a customizable document upload UI using the Filestack API. Users can upload files, preview uploaded documents, and enjoy a seamless experience with features like drag-and-drop, progress bars, and real-time feedback.

## Features
- Upload up to 5 files simultaneously. (In this example, the maximum number of files allowed for upload is set to 5.)
- Preview uploaded documents in an iframe.
- Stylish, responsive UI with success messages for user feedback.
- Supports all document types (`application/*`).

## Prerequisites
To use this project, you'll need:
1. A Filestack API Key. Sign up at [Filestack](https://www.filestack.com) to get started.

## Getting Started
### 1. Clone the Repository
Clone this repository to your local machine:

`git clone <repository-url>`

`cd filestack-snippets/content/blogs/customizable-document-upload-ui`

### 2. Add Your Filestack API Key
Open the HTML file and replace `YOUR_API_KEY` with your actual Filestack API key:

`const filestackClient = filestack.init('YOUR_API_KEY'); // Replace 'YOUR_API_KEY' with your actual Filestack API key.`

### 3. Serve the Application
Use a local web server to serve the HTML file. For example:

Using Python:

`python3 -m http.server`

Using Node.js:

`npx http-server`

### 4. Access the Application
Open your browser and navigate to `http://localhost:8000` (or the appropriate local server address).

## How to Use
1. Click the **Upload Files** button.
2. Select up to 5 files to upload. (In this example, the maximum number of files allowed for upload is set to 5.)
3. View the uploaded files in the file list and preview them in the embedded iframe.
4. A success message will appear after successful uploads.
   
## File Overview
### HTML
- Provides the structure of the app.
- Includes the upload button, file list, and preview area.

### CSS
- Implements a responsive, clean design with gradient backgrounds, buttons, and hover effects.
- Adds visual feedback for uploaded files and previews.

### JavaScript
- Integrates the Filestack API for file uploads.
- Displays uploaded files and previews using iframes.
- Provides a user-friendly upload process with success messages.

## Notes
- Ensure your Filestack API key is valid and has appropriate permissions.
- For production use, optimize the code and review security settings.
  
## Resources
- [Filestack Documentation](https://www.filestack.com/docs/)
- [Filestack API Reference](https://www.filestack.com/docs/api/)

## License
This project is licensed under the MIT License. Feel free to use, modify, and distribute it as needed.


