# Filestack Profile Dashboard with Asynchronous Workflows

This repository contains the source code for a responsive social media-style profile dashboard. It demonstrates how to use the Filestack API for robust file uploads and asynchronous image processing with Filestack Workflows, all handled on the client-side.

This project uses a client-side polling strategy to check the status of a workflow, providing an instant preview to the user while processing happens in the background. This repository contains all the code snippets from our accompanying blog post on this topic.

---

## Features

* **Profile & Cover Photo Uploads** : Seamlessly upload images using the Filestack File Picker.
* **Asynchronous Image Processing** : Utilizes Filestack Workflows to resize and permanently store profile pictures without blocking the UI.
* **Instant Previews** : Displays an on-the-fly resized version of the image immediately after upload, enhancing user experience.
* **Client-Side Polling** : Checks the status of the workflow job periodically using the Filestack Workflows API until processing is complete.
* **Optimized Storage** : Automatically deletes the original uploaded file after the workflow successfully creates the permanent version.
* **Modern UI** : A clean and responsive dashboard layout built with Tailwind CSS.

---

## Prerequisites

To run this example, you will need the following from your [Filestack Dashboard](https://dev.filestack.com/):

1. A valid  **Filestack API Key** .
2. A **security policy** and **signature** that includes the `runWorkflow` and `remove` calls.
3. A **Workflow ID** for a pre-configured workflow (e.g., a simple resize and store workflow).

---

## How to Run

### 1. Download the Project

* Clone this repository or download the `index.html` file.

### 2. Configure Your Credentials

* Open the `index.html` file in a text editor.
* Find the `<script>` section at the bottom of the file.
* Replace the placeholder values for your Filestack  **API Key** ,  **policy** ,  **signature** , and  **Workflow ID** .

**JavaScript**

```
// Configuration - YOUR credentials
const key = "YOUR_API_KEY";
const p = "YOUR_POLICY";
const s = "YOUR_SIGNATURE";
const wfID = "YOUR_WORKFLOW_ID";
```

### 3. Run the Application

* Open the `index.html` file directly in your web browser. No web server is required.

---

### How It Works

1. The user clicks the **"Change Picture"** button, which opens the Filestack File Picker.
2. After an image is uploaded, an **instant preview** is generated using a Filestack CDN transformation URL (e.g., `resize=width:400...`).
3. Simultaneously, a GET request is sent to the `/run_workflow` API endpoint with the uploaded file's handle. This returns a `jobid`.
4. The application then begins **polling** the `/workflow_status` endpoint every few seconds, using the `jobid` to check on the progress.
5. While polling, the UI displays a "Processing..." status message.
6. Once the workflow `status` returns as  **"Finished"** , the preview image's `src` is updated with the final, permanently stored URL from the workflow results.
7. Finally, a `DELETE` request is sent to the Filestack REST API to remove the original, unprocessed file, saving storage space.

---

### Notes

* Ensure your Filestack **policy** and **signature** are valid and have a future expiry date. The policy must have permissions for `runWorkflow` and `remove` for all features to work correctly.
* This example is designed for client-side demonstration. In a production environment, it is highly recommended to manage your API keys, policies, and signatures on a secure server to prevent exposure.

---

### Resources

* Read our article: [Why You Should Offload Your Image Processing (And How) with Profile Pictures](blog.filestack.com/offload-image-processing-profile-pictures)
* [Filestack Workflows API Reference](https://www.google.com/search?q=https://www.filestack.com/docs/api/workflows/)
* [Filestack File Picker Documentation](https://www.filestack.com/docs/)

---

### License

This project is licensed under the  **MIT License** . You are free to use, modify, and distribute it.
