# A code example for a mobile-friendly document upload app built with React, Filestack, and Material UI

This app includes:

✅ Tap to upload files

✅ Real-time upload progress indicator

✅ Drag-and-drop and tap-to-upload functionality

✅ Image cropping & rotation

✅ Adaptive file compression for faster uploads

✅ Image resizing and transformation

It uses:

✅ Material UI for UI components (buttons, progress bar, card layout)

✅ Filestack SDK for document uploads

✅ React with Vite for quick project setup

## Step 1: Create a new Vite project

Run:

`npm create vite@latest filestack-upload-app --template react`

Select framework – **React**

Select Variant – **JavaScript**

Then, navigate into the project:

`cd filestack-upload-app`

Install dependencies:

`npm install`

## Step 2: Install required packages

Install the Filestack SDK and Material UI:

`npm install filestack-js @mui/material @mui/icons-material @emotion/react @emotion/styled`

## Step 3: Replace App.jsx with the New Code

Now, replace the contents of src/App.jsx with the code from the App.jsx file in this directory.

## Step 4: Run the Project

Start the development server:

`npm run dev`

Your mobile-friendly document upload app is now live at:

[http://localhost:5173](http://localhost:5173)

## Setup Instructions:

Replace “YOUR_FILESTACK_API_KEY” with your actual Filestack API key.

Run the app and start uploading files seamlessly on mobile.

## Output

When you run the project, open the browser’s Developer Tools (Inspect Element) and switch to mobile view. You can test how the UI adapts by selecting different mobile devices from the responsive mode in the inspector. This allows you to ensure a smooth and optimized experience across various screen sizes.

## Resources

[Filestack](https://www.filestack.com/)

[Filestack Documentation](https://www.filestack.com/docs/)

Also read our article [The Impact of Mobile Usability on Document Upload UIs](https://blog.filestack.com/the-impact-of-mobile-usability-on-document-upload-uis/)
