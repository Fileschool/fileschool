# 📚 LMS Assignment Submission Page — Filestack Multiple File Upload Example

This project demonstrates how to build a multiple file upload workflow for an LMS (Learning Management System) using the Filestack JavaScript File Picker.
It showcases how students can upload several assignment files at once—PDFs, images, ZIPs, videos—with automatic progress tracking, parallel uploads, metadata tagging, and secure CDN delivery.

This example is part of the article:
“[Multiple File Upload for Student Submissions](https://blog.filestack.com/multiple-file-upload-student-submissions/)”
and is designed for EdTech developers who want reliable batch upload handling.

## 🚀 Features

✔️ Multiple file upload with Filestack picker

✔️ Supports PDFs, DOCX, images, ZIPs, and videos

✔️ Drag-and-drop file selection

✔️ Automatic progress bars (built into Filestack UI)

✔️ Parallel uploads handled by Filestack

✔️ Auto-retry for unstable networks

✔️ File type + size restrictions

✔️ Student/assignment metadata tagging

✔️ CDN-backed delivery URLs

✔️ Simple LMS-style UI

✔️ Ready to integrate into real EdTech platforms

## 📂 Project Structure

```
📁 lms-assignment-submission/
│
├── index.html        # Main LMS submission page
├── styles.css        # UI styling
├── main.js           # Filestack picker logic + metadata handling
├── README.md         # This README file
└── LICENSE           # MIT License
```

## 🛠️ Requirements

- A Filestack API Key
Sign up for free at: https://www.filestack.com

- A simple local server (e.g., Live Server, http-server, Vite, etc.)

## ⚙️ Setup Instructions

1. Clone this repository
   
`git clone https://github.com/fileschool/filestack-snippets.git`

`cd filestack-snippets/content/blogs/lms-assignment-submission-page`

2. Add your Filestack API Key

In `main.js`, replace:

`const client = filestack.init("YOUR_API_KEY_HERE");`

with your actual API key.

3. Run a local server

You can use VS Code Live Server or:

`npx http-server`

4. Open in browser
   
`http://localhost:8080`, `http://127.0.0.1:8080` or `http://192.168.1.8:8080`

You’ll see the LMS upload form.

## 📬 Saving Metadata (Optional)

Each uploaded file includes:

- Student ID
- Assignment ID
- File name
- File size
- MIME type
- CDN delivery URL

You can send these to your backend with:

```
fetch("/save-submission", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
});
```

## 🛡️ Security Notes

Do not expose Filestack security policies or signatures in frontend code.

This example uses only client-side uploads, which is safe for demos.

For delete / virus scanning workflows, move logic to backend.

## 🔗 Useful Filestack Documentation

File Picker Docs: https://www.filestack.com/docs/uploads/pickers/web/

Transformations: https://www.filestack.com/products/transformations/

Virus Detection: https://www.filestack.com/products/virus-detection/

Delivery CDN: https://www.filestack.com/docs/delivery/cdn/

Filestack Documentation: https://www.filestack.com/docs/

## 📄 License

This project is open-source and available under the [MIT License](https://github.com/fileschool/filestack-snippets/blob/main/content/blogs/lms-assignment-submission-page/LICENSE).

## 💡 Credits

Created as part of the article:
Multiple File Upload for Student Submissions

Brought to life using [Filestack](https://www.filestack.com/).

Created by [Shamal Jayawardhana](https://www.linkedin.com/in/shamal-jayawardhana/)
