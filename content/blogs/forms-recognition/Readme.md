# Forms Recognition App

This repository contains a simple example of a **Forms Recognition App** using the Filestack JavaScript API and OCR functionality. This app allows users to upload scanned forms and extracts text from the uploaded forms using Filestack's OCR capabilities.

## Features

- Upload scanned forms using the Filestack File Picker.
- Extract text from the uploaded forms using Filestack's OCR API.
- Display extracted text directly in the browser.
- Modern and responsive user interface.

## Prerequisites

To run this app, you will need:

1. A Filestack API key.
2. A Filestack security policy and signature (if required by your Filestack configuration).

## Setup Instructions

### 1. Clone the Repository

`git clone <repository-url>`

`cd <repository-folder>`

### 2. Edit API Key and Credentials

1. Open the `index.html` file.
2. Replace the placeholders `YOUR_API_KEY`, `YOUR_POLICY`, and `YOUR_SIGNATURE` with your Filestack credentials.

`javascript`

`const apikey = 'YOUR_API_KEY'; // Replace with your Filestack API key`

`const policy = 'YOUR_POLICY'; // Replace with your Filestack policy`

`const signature = 'YOUR_SIGNATURE'; // Replace with your Filestack signature`

### 3. Serve the Application

Use a local web server to serve the index.html file. This is necessary to avoid CORS-related issues when testing by opening it directly from the folder.

#### Using Python's Built-in HTTP Server:

`python3 -m http.server`

#### Using Node.js `http-server`:

`npx http-server`

---

### 4. Access the Application

Open your browser and navigate to [http://localhost:8000](http://localhost:8000) (or the appropriate local server address).

---

### 5. Use the App

1. Click the **"Upload a Scanned Form"** button.
2. Select a scanned form to upload.
3. The extracted text will be displayed directly in the app interface.

---

### Code Overview

#### **HTML**
- Basic structure for the user interface, including:
  - Upload button.
  - Display area for extracted text.
  - Error messages.

#### **CSS**
- Modern, responsive styling.
- Clean, user-friendly design.

#### **JavaScript**
- Initializes the Filestack client.
- Handles file uploads using Filestack's File Picker.
- Sends the uploaded file to Filestack's OCR API to extract text.
- Dynamically updates the DOM to display results.

---

### Notes

- Ensure your Filestack API Key, policy, and signature are valid.
- For production, review security settings and ensure proper optimization.
- This example uses Filestack's OCR feature, which may require specific permissions in your security policy.

---

### Resources

- [Filestack Documentation](https://www.filestack.com/docs/)
- [Filestack API Reference](https://www.filestack.com/docs/api/)
- Read our article: [Unlock Efficiency with Advanced Forms Recognition SDKs](https://blog.filestack.com/unlock-efficiency-advanced-forms-recognition-sdks/)

---

### License

This project is licensed under the MIT License. You are free to use, modify, and distribute it. See the `LICENSE` file for details.

