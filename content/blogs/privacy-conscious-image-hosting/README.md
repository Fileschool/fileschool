# Example: Using Filestack to Enhance Privacy in Image Hosting with React

This example demonstrates how to securely upload, manage, and process images using Filestack, integrating features such as real-time editing and face redaction with image blurring.

## Step 1: Set up a new React app

Create a new React app using the following commands in the Terminal or PowerShell:

`npx create-react-app filestack-image-hosting`

`cd filestack-image-hosting`

## Step 2: Install the Filestack JavaScript SDK

Run this command to install the Filestack JavaScript SDK:

`npm install filestack-js`

## Step 3: Import and configure the Filestack client in your app

Create a file named `filestackConfig.js` in the `src` folder to store your Filestack API key and configurations:

Refer to `demo/filestackConfig.js` in this directory for the content of this file.

## Step 4: Implement secure file upload with real-time image editing and sensitive information redaction

In this step, we securely upload image files using the Filestack [file picker](https://www.filestack.com/docs/uploads/pickers/), which provides real-time editing. Additionally, we implement face redaction by combining Filestack's [face detection](https://blog.filestack.com/facial-detection/) and [image blurring](https://www.filestack.com/docs/api/processing/#blur) options.

Create a component named `ImageProcessor.js` in the `src` folder:

Refer to the `demo/ImageProcessor.js` in this directory for the content of this file.

## Step 5: Update App.js

Replace the content of `src/App.js` with the content in the `demo/App.js` file. 

## Step 6: Start the app

Run the following command to start the app:

`npm start`

Open your browser and navigate to http://localhost:3000.

## How it works

- The **Process Image** button allows users to upload an image with real-time editing (cropping, rotation).
- After upload, the original image URL is logged.
- The processed image URL applies face detection and blurring for enhanced privacy.
  
This example integrates Filestack's privacy-focused features and provides a strong foundation for secure and private image hosting in React.

Also read our article on [Privacy-Conscious Image Hosting APIs to Protect Sensitive Data](https://blog.filestack.com/privacy-conscious-image-hosting-apis/).
