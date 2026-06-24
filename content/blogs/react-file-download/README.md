# Real-World Example Project: React File Download

This project demonstrates a simple real-world React application where users can download a file from an API.

## Features
- A button to trigger the file download.
- `Axios` for API requests.
- `File-saver` for saving the file to the user's device.
- A mock API to simulate file downloading.

---

## Step 1: Set Up Your React Project

1. Create a new React app:
  
   `npx create-react-app react-file-download`
   
   `cd react-file-download`

3. Install the necessary libraries:
   
    `npm install axios file-saver json-server`

---

## Step 2: Mock API Setup

1. Create a `db.json` file in the root directory for `json-server`. (Refer to the `demo/db.json` file for this file content)

2. Start the mock API:

   `npx json-server --watch db.json --port 5000`

3. Your mock API will be available at: http://localhost:5000/files.

**Note:**

If port `5000` is already in use by another process, you can start `json-server` on a different port (e.g., `5001`) using the following command:

`npx json-server db.json --port 5001`

This ensures that the mock API starts without conflicts.

---

## Step 3: Create the React Component

Inside the `src` folder, create a file named `FileDownload.js`. (Refer to `demo/FileDownload.js` for the content of `FileDownload.js` file)

---

## Step 4: Update `App.js`

Replace the content of `src/App.js` with the content in the `demo/App.js` file content.

---

## Step 5: Start Your App

1. Run the following command:

    `npm start`

2. Open your browser and navigate to: http://localhost:3000.

---

## How It Works

1. When you click the Download File button:

  - A `GET` request is sent to: http://localhost:5000/files/1.
  - The file URL (`https://file-examples-com.github.io/uploads/2017/10/file-example_PDF_1MB.pdf`) is retrieved.
  - The file is downloaded and saved to the user's device as `example.pdf`.

2. During the download:

  - The button text changes to **Downloading....**
  - The button is disabled until the download completes.

---

## More Features You Can Add

**- Multiple File Downloads:**

Replace the button with a list of files fetched from the API.

**- Progress Indicators:**

Add a progress bar for larger files using Axios' onDownloadProgress.

**- Real API Integration:**

Replace the mock API with a real backend API. (Refer to this [code snippet](https://github.com/shamalja/filestack-snippets/blob/shamalja-new-example/content/blogs/react-file-download/code-snippets/connect-to-real-api.js)).

**Enjoy exploring this example project!**

---

Also read our article **[The Ultimate Guide to File Downloads in React Using APIs](https://blog.filestack.com/the-ultimate-guide-to-file-downloads-in-react-using-apis/)**


