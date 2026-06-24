# Print-Ready Image Workflow with Filestack

This example demonstrates how to build a simple web application that converts user-uploaded images into print-ready files using Filestack Workflows.

The example shows how to:

- Upload images using the Filestack File Picker

- Create a print-prep workflow with Filestack Workflows

- Run a print-prep workflow automatically

- Normalize color space and format for printing

- Retrieve and display the processed, print-ready image from Filestack’s CDN

This project is designed to support printing applications that need consistent, predictable input from user uploads.

---

## What This Demo Does

1. A user uploads an image using the Filestack File Picker

2. The uploaded file is sent to a Filestack Workflow

3. The workflow:

   - Inspects file metadata

   - Converts the image to CMYK

   - Normalizes format and quality
     
   - Resize the image

   - Stores the processed output

4. The app polls the workflow status

5. The final, print-ready image is displayed using Filestack’s CDN

---

## Project Structure

```
.
├── index.html     # UI for uploading and previewing images
├── style.css      # Basic styling
├── app.js         # Frontend logic (File Picker + workflow polling)
├── server.js      # Backend server (policy, signature, workflow API)
└── README.md
```

---

## Prerequisites

- Node.js v18 or later

- A Filestack account

- A Filestack Workflow configured in the dashboard

---

## Setup Instructions

### 1️⃣ Clone the repository

`git clone https://github.com/fileschool/filestack-snippets.git`

`cd filestack-snippets/content/blogs/print-ready-app`

### 2️⃣ Create a Filestack Workflow

In the Filestack Dashboard:

1. Go to Workflows

2. Create a new workflow

3. Add the following tasks:

   - Metadata (to inspect file properties)

   - Output (convert to JPG, CMYK, quality 90, white background)

   - Resize (optional, for print dimensions)

   - Store (to save the processed image)

4. Save the workflow

5. Copy the Workflow ID

Update this value in `server.js`:

`const WORKFLOW_ID = "YOUR_WORKFLOW_ID";`

### 3️⃣ Configure Filestack credentials

Update the following values in `server.js`:

```
const FILESTACK_API_KEY = "YOUR_FILESTACK_API_KEY";

const FILESTACK_APP_SECRET = "YOUR_FILESTACK_APP_SECRET";
```

⚠️ **Important:**

The App Secret must remain on the server and should never be exposed to the frontend.

### 4️⃣ Start the backend server

`node server.js`

You should see:

`Server running at http://localhost:3001`

### 5️⃣ Open the frontend

Open `index.html` in your browser (or serve it using a simple local server).

Click Upload Image, select an image, and watch the workflow process it.

---

## How Security Works

- The backend generates a short-lived policy and signature using the Filestack App Secret

- The policy allows only the required actions (runWorkflow, read, store, convert)

- The signed URL is used to securely run the workflow and fetch its status

- Processed files are delivered via Filestack’s CDN

---

## Workflow Output

The workflow status response includes a sources array containing the final output file handle.

The app creates the URL using the file handle and uses this URL to display the print-ready image:

```
const output = data.sources[0];

processedImage.src = `https://cdn.filestackcontent.com/${output}`; 

```

---

## Why This Approach Works Well for Printing Apps

- Handles unpredictable user uploads automatically

- Standardizes color space and format before production

- Prevents low-quality or incompatible files from entering the pipeline

- Reduces manual prepress work

- Scales easily as upload volume increases

---

## Learn More

Filestack Workflows: https://www.filestack.com/docs/workflows/overview/

Workflow API: https://www.filestack.com/docs/api/workflows_api/

Filestack CDN: https://www.filestack.com/docs/delivery/cdn/

---

## License

This project is licensed under the [MIT License](https://github.com/fileschool/filestack-snippets/blob/main/content/blogs/print-ready-app/LICENSE).

---

## Credits

Created as part of the article:
[How to Standardize Color Profiles Before Files Hit Your Print Pipeline](https://blog.filestack.com/color-profile-handling-print-files/)

Brought to life using [Filestack](https://www.filestack.com/).

Created by [Shamal Jayawardhana](https://www.linkedin.com/in/shamal-jayawardhana/)

