# OCR Text Extractor using Filestack API

This repository contains a simple, user-friendly web-based application for extracting text from scanned documents (images/PDFs) using the **Filestack OCR API**. The application features a modern design, easy file upload, and editable text output.

## Features

- **User-Friendly Interface**: Clean and modern design.
- **File Upload Support**: Works with scanned images and PDF files.
- **OCR Integration**: Extracts text using Filestack API.
- **Editable Output**: Displays extracted text in a text area for further editing or copying.

---

## How It Works

1. **Upload a File**: The user clicks the **Upload File** button to open the Filestack file picker.
2. **Select a File**: The user selects a scanned document (image/PDF) to upload.
3. **Text Extraction**: The Filestack OCR API processes the uploaded file to extract text.
4. **Editable Output**: Extracted text is displayed in a text area for editing or copying.

---

## Setup Instructions

### Prerequisites

- A [**Filestack API Key**](https://www.filestack.com/signup-free/)
- A generated **Filestack Policy** and **Signature** (created programmatically or via the Filestack dashboard)
- Learn more about Filestack security policies here: https://www.filestack.com/docs/security/policies/

### Steps

1. Clone this repository and navigate to the specific folder:
    ```bash
    git clone https://github.com/Fileschool/filestack-snippets.git
    cd filestack-snippets/content/blogs/ocr-text-extractor
    ```

2. Replace placeholders in the script:
    - `'YOUR_API_KEY'` with your Filestack API key.
    - `'YOUR_POLICY'` and `'YOUR_SIGNATURE'` with your [Filestack-generated policy and signature](https://www.filestack.com/docs/security/policies/).

3. Open the `index.html` file in a browser or host it on a local/online server.

---

**You can find the complete code example in the demo folder.**

---

## Next Steps

1. **Deploy the Application**: Host the application on a server or a cloud platform.
2. **Customize the UI**: Update the styling to align with your brand.
3. **Explore Filestack Features**: Experiment with other Filestack capabilities, such as image transformations and storage options. Explore more in our [comprehensive documentation](https://www.filestack.com/docs/).

---

## Output

- Initial Screen: Displays the file picker.
- File Upload: Allows users to upload images or PDFs.
- Text Extraction: Displays extracted text in a text area below the uploaded image.

---

## License

This project is licensed under the MIT License. Feel free to use and modify it for your needs.

---
Visit [Filestack](https://www.filestack.com/) to explore powerful file handling, transformations, and OCR capabilities for your projects.
