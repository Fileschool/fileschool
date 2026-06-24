# Image Upload and Tagging Example

This repository contains an example of an image upload and tagging application using Filestack's API. The example allows users to upload an image, display the uploaded image, and fetch its automatically generated tags.

## Features

- Upload images via the Filestack API.
- Display the uploaded image on the screen.
- Fetch and display AI-generated tags for the uploaded image.
- User-friendly interface with simple styling.

---

## Prerequisites

To run this example, you need the following:

- A Filestack API key.
- A security policy and signature (if required by your Filestack configuration).

---

## How to Run

### 1. Clone the Repository:

`git clone <repository-url>`

`cd <repository-folder>`

### 2. Edit API Key and Credentials:

- Open the `index.html` file.
- Replace the placeholders (`YOUR_API_KEY`, `YOUR_POLICY`, and `YOUR_SIGNATURE`) with your Filestack credentials.

---

### 3. Serve the Application:

Use a local web server to serve the HTML file. This is necessary to avoid CORS-related issues.

- **Using Python's built-in server:**
  
    `python3 -m http.server`
    

- **Using Node.js with http-server:**
    
    `npx http-server`
    

---

### 4. Access the Application:

- Open your browser and go to `http://localhost:8000` (or the appropriate address for your server).

---

### 5. Upload an Image:

- Click the **"Upload Image"** button.
- Select an image to upload.

---

### 6. View Results:

- The uploaded image will be displayed.
- Tags generated for the image will appear below it.

---

### Code Overview

- **HTML:** Basic structure for the application interface.
- **CSS:** Styles for a clean and responsive design.
- **JavaScript:** Handles image uploads, tag fetching, and dynamic updates to the DOM.

---

### Notes

- Ensure you have a valid Filestack account and API key to use this application.
- This example demonstrates integration with Filestack's tagging feature. For production use, review the security settings and optimize the code accordingly.

Read our article on [Faster and Smarter AI Image Tagging Tools.](https://blog.filestack.com/faster-smarter-ai-image-tagging-tools/)

[Visit Filestack](https://www.filestack.com)

