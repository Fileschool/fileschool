# Instagram Hashtags Generator

## Overview
This project demonstrates how to generate Instagram hashtags dynamically using Filestack's AI Tagging API. The web app allows users to upload an image and automatically generate relevant hashtags based on the image content. It features a responsive and visually appealing design.

---

## Features
- **File Upload:** Users can upload an image via the Filestack file picker.
- **AI-Generated Hashtags:** Filestack's Tagging API analyzes the uploaded image and generates relevant hashtags.
- **Real-Time Feedback:** The generated hashtags are displayed immediately after image analysis.
- **Responsive Design:** Optimized for both desktop and mobile screens.

---

## Prerequisites
Before running this project, ensure you have the following:
1. A Filestack API Key.
2. A Filestack security policy and signature with the necessary permissions (`pick`, `tags`, etc.).

---

## Setup Instructions

### 1. Clone the Repository
Clone this repository to your local machine:

`git clone <repository-url>` 

`cd filestack-snippets/content/blogs/instagram-hashtag-generator`


### 2. Edit API Key and Credentials
Open the `index.html` file and replace the placeholders:
- Replace `YOUR_API_KEY` with your Filestack API key.
- Replace `YOUR_POLICY` with your Filestack policy.
- Replace `YOUR_SIGNATURE` with your Filestack signature.

### 3. Serve the Application
Use a local web server to serve the `index.html` file. This avoids CORS-related issues when accessing the app in a browser.

#### Using Python's Built-in HTTP Server:

`python3 -m http.server`

#### Using Node.js http-server:

`npx http-server`


### 4. Access the Application
Open your browser and navigate to `http://localhost:8000` (or the appropriate address for your local server).

---

## Usage Instructions
1. **Launch the Application**: Open the app in your browser.
2. **Upload an Image**: Click the "Upload Image" button to open the Filestack file picker.
3. **Generate Hashtags**: Select an image to upload. The generated hashtags will appear under the "Generated Hashtags" section.

---

## Code Overview

### HTML
- **Structure**: Provides the layout of the application.
  - Includes the "Upload Image" button and the section to display generated hashtags.
  - Contains a decorative circle for visual enhancement.

### CSS
- **Styling**:
  - Implements a gradient background.
  - Customizes button and text styling.
  - Adds animations for a polished user interface.

### JavaScript
- **Functionality**:
  - Initializes the Filestack client.
  - Handles image uploads using Filestack's file picker.
  - Uses Filestack's AI Tagging API to fetch and display hashtags.

---

## Notes
- Ensure that your Filestack API Key, policy, and signature are valid.
- Filestack's Tagging API requires specific permissions in your security policy.
- For production use, optimize the code and review security settings.

---

## Resources
- [Filestack Documentation](https://www.filestack.com/docs/)
- [Filestack API Reference](https://www.filestack.com/docs/api/)
- [AI Innovation with Multi-Object Recognition API](https://blog.filestack.com/ai-innovation-multi-object-recognition-api/)

---

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## Feedback
If you encounter any issues or have suggestions, feel free to create an issue or submit a pull request.






