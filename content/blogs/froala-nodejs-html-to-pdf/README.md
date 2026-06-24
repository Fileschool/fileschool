# Froala → PDF Export (Node.js + Express + Puppeteer)

This project demonstrates how to export WYSIWYG HTML (from Froala) to a PDF on the server using Puppeteer.

## What it includes
- A Froala editor page (`/`)
- An Export button that sends editor HTML to the backend
- An Express API (`POST /convert-html-to-pdf`) that returns a PDF download

## Requirements
- Node.js 18+ recommended

## Clone
```
git clone https://github.com/fileschool/filestack-snippets.git
cd filestack-snippets/content/blogs/froala-nodejs-html-to-pdf

```

## Install
```
npm install

```

## Run

`npm start`

Open:

`http://localhost:3000/`

## API

### POST /convert-html-to-pdf

Body:

JSON

`{ "html": "<p>Editor HTML...</p>" }`

Response:

PDF as `application/pdf` (download attachment)

## Run in VS Code

```

npm install
npm start

```

Open `http://localhost:3000/`, type in Froala, click **Export to PDF**.

### Notes (practical)

Puppeteer generation can take ~1–3 seconds per document depending on complexity.

For production, consider browser pooling + job queues for large volumes.
