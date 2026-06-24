# 📄 Resume Upload UI – React + Filestack

This is a simple React app that demonstrates how to build a **resume upload UI** using [Filestack](https://www.filestack.com) for drag-and-drop or mobile resume uploads.  
It supports **PDF** and **DOCX** formats, validates file types, and displays upload success confirmation.

---

## ✨ Features

- Upload resumes (PDF or DOCX) via file picker
- Drag-and-drop or mobile upload support
- File type and size validation
- Upload progress bar with success message

---

## 🚀 Demo Use Case

This is based on the following case study:

> “A job board startup needs to collect candidates' resumes—usually in PDF or DOCX format. Instead of building a complex upload system, the dev team uses Filestack’s file upload UI to allow resume uploads via drag-and-drop or mobile. It validates file types, shows upload status, and makes the process seamless for job seekers.”

---

## 📁 File Structure

This repository provides only the essential files needed for the Filestack resume uploader component.

```
filestack-resume-uploader/
├── src/
│   ├── ResumeUpload.js     # 👉 Upload component
│   └── App.js              # App entry point
├── LICENSE
└── README.md
```

> ℹ️ Other folders like `public/`, `.gitignore`, `package.json`, and `node_modules/` will be created automatically when you initialize the app locally using:
>
> `npx create-react-app resume-uploader`

---

## 🧰 Prerequisites

- Node.js (v14 or later)
- npm or yarn
- A [Filestack API Key](https://www.filestack.com/signup-start/)

---

## 🛠️ Installation

### 1. Clone the repository
git clone https://github.com/fileschool/filestack-snippets.git

### 2. Navigate to the project directory
cd filestack-snippets/content/blogs/filestack-resume-uploader

### 3. Install dependencies
npm install

### 4. Create a new React app
```
npx create-react-app resume-uploader
cd resume-uploader
```
### 5. Install Filestack SDK

`npm install filestack-js`

### 6. Replace default src files

Copy the following files from this repo and replace the files inside your local app’s src/ folder:

- App.js
- ResumeUpload.js

You can delete the default files such as App.css, index.css, logo.svg, etc.

## 🔑 Set Your API Key

Open the src/ResumeUpload.js file and replace the placeholder:

`const client = filestack.init('YOUR_API_KEY');`

with your actual Filestack API key.

## 🖥️ Running the App Locally

```
# Start the local development server
npm start
```

This will launch the app at:

`http://localhost:3000`

## ✅ Output

Once the app runs successfully:

	- Click the 'Upload Resume' button.
	- Choose a .pdf or .docx file.
	- You will see a “Upload successful!” message upon completion.

---

## 📦 Resources
- [Filestack Docs](https://www.filestack.com/docs/)
- [ReactJS Docs](https://react.dev/)
- [Filestack Article: File Upload UI for Non-Technical Users](https://blog.filestack.com/file-upload-ui-for-non-technical-users/)

---

## 📝 License

This project is open source under the [MIT License](https://github.com/fileschool/filestack-snippets/blob/main/content/blogs/filestack-resume-uploader/LICENSE).

---

## 💡 Credits

Created as part of the article:
File Upload UI for Non-Technical Users

Brought to life using the Filestack File Picker.

Created by [Shamal Jayawardhana](https://www.linkedin.com/in/shamal-jayawardhana/)
