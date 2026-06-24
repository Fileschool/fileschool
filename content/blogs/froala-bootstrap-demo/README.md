# 📝 Froala Bootstrap Demo

A simple example of integrating the **Froala WYSIWYG editor** into a **Bootstrap 5 form**, and submitting the content to a local backend server using **Node.js and Express**.

---

## 📁 Project Structure

```
froala-bootstrap-demo/
├── frontend/
│   └── index.html
├── backend/
│   └── server.js
└── README.md
```

---

## 🚀 Live Demo

Clone the repo and follow the steps below to run it locally.

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v14+ recommended)
- [npm](https://www.npmjs.com/get-npm)
- [npx](https://docs.npmjs.com/cli/v7/commands/npx) (comes with npm)

---

## 🧑‍💻 How to Run the Project Locally

### 1. Clone the Repository

`git clone https://github.com/fileschool/filestack-snippets.git`

`cd filestack-snippets/content/blogs/froala-bootstrap-demo`

### 2. Run the Frontend (Static HTML)

Use any static server to serve the index.html in the frontend/ folder. The easiest way is with:

`npx http-server frontend -p 8080`

This will serve your form at:

http://localhost:8080

ℹ️ You can also just open frontend/index.html directly in your browser, but using a local server is recommended for testing with the backend.

### 3. Run the Backend (Node.js + Express)

In a separate terminal, navigate to the backend/ folder and install dependencies:

`cd backend`

`npm init -y`

`npm install express cors body-parser`

Then run the backend server:

`node server.js`

This will start the backend at:

**http://localhost:3000**

### ✅ Test the Integration

	1.	Go to http://localhost:8080
	2.	Enter a post title and rich text content.
	3.	Click Publish – it will POST the content to the backend.
	4.	The backend will log your submitted data to the terminal.

### 📦 Backend Sample: server.js

Your backend/server.js should look like this:

```
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/submit-post', (req, res) => {
  console.log('Received form submission:');
  console.log('Title:', req.body.title);
  console.log('Content:', req.body.content);
  res.status(200).send('Post received successfully.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

```

## Tools Used
	•	Bootstrap 5
	•	Froala Editor
	•	Node.js + Express
	•	http-server

## License
This project is licensed under the [MIT License](https://github.com/shamalja/filestack-snippets/blob/main/content/blogs/froala-bootstrap-demo/LICENSE).
