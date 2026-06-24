# 🎓 Python File Picker for LMS Apps

This is a simple demo that shows how to integrate **Filestack** with a **Python Flask** backend to create a file picker for Learning Management System (LMS) applications.  
Users can select and upload files from their local folder, web links, or cloud storage — all through an intuitive interface powered by Filestack.

---

## 🚀 Features
- File upload from **local folders, URLs, or cloud storage** (Google Drive, Dropbox, etc.)
- Simple **Python Flask** backend using the **Filestack Python SDK**
- Automatic generation of **secure file URLs**
- Lightweight, ready-to-use **frontend picker**
- Ideal for **EdTech** and **LMS** integrations

---

## 🧩 Folder Structure

```
python-filestack-lms/
│
├── app.py
├── templates/
│   └── index.html
└── requirements.txt
```
---

## ⚙️ Installation

**1. Clone the repository**
   
   `git clone https://github.com/Fileschool/filestack-snippets.git`
   
   `cd filestack-snippets/content/blogs/python-filestack-lms`

**2. Create and activate a virtual environment**

   `python3 -m venv venv`
   
   `source venv/bin/activate     # On macOS/Linux`
   
   `venv\Scripts\activate        # On Windows`

**3. Install dependencies**

   `pip install -r requirements.txt`

**4. Set your Filestack API key**

Replace "YOUR_FILESTACK_API_KEY" in both `app.py` and `index.html` with your actual Filestack API key.

🔒 Tip: In production, use restricted API keys or Filestack [security policies](https://www.filestack.com/docs/security/policies/) for safety.

[Sign up free](https://www.filestack.com/signup-start/) and get your Filestack API key.

## ▶️ Run the App

`python app.py`

Then open your browser and visit:

`http://127.0.0.1:5000/`

## 🌐 How It Works

1. The frontend (index.html) loads the Filestack JavaScript SDK:

    `const client = filestack.init("YOUR_FILESTACK_API_KEY");`

   It opens a File Picker that allows users to choose files from local or cloud sources.

2. When the Upload button is clicked, the selected file is uploaded to Filestack’s cloud.

3. The Flask backend (app.py) handles file uploads and returns a JSON response containing the file URL:

```
client = filestack.Client("YOUR_FILESTACK_API_KEY")
result = client.upload(file_obj=file)
print(result.url)
```

4. The file URL and upload details appear instantly on the webpage.
	
## 🧠 Example Output

When you run the app, you’ll see the following output in your browser:

- Selected files in the Filestack Python File Picker
- Once you click Upload, the file is sent to cloud storage and its URL is displayed on the page.

## 🧰 Requirements

- Python 3.8 or higher
- Flask
- Filestack Python SDK

Install all dependencies:

`pip install flask filestack-python`

## 🔗 Useful Links

- [Filestack Python SDK Documentation](https://www.filestack.com/docs/api/sdk/python/)
- [Filestack File Picker Docs](https://www.filestack.com/docs/uploads/pickers/)
- [Flask Documentation](https://flask.palletsprojects.com/en/stable/)
- [Official Python Docs](https://docs.python.org/3/)

## 💡 About

This example is part of Filestack’s EdTech integration series demonstrating how developers can simplify file uploads and management in Learning Management Systems using python file handling and the Filestack API.

---

## 📝 License

This project is open source under the [MIT License](https://github.com/fileschool/filestack-snippets/blob/main/content/blogs/python-filestack-lms/LICENSE).

---

## 👨‍💻 Author

Created by [Shamal Jayawardhana](https://www.linkedin.com/in/shamal-jayawardhana/)

💼 Powered by [Filestack](https://www.filestack.com/)
