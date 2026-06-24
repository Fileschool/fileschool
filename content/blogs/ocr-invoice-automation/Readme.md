# Invoice Automation with OCR Data Extraction Example

This repository contains an example of how to use Filestack's OCR (Optical Character Recognition) API to automate invoice processing by extracting text from images of invoices in a web application.

## Features

- **Image Upload**: Allows users to upload an image of a scanned document.
- **OCR Processing**: Extracts text from the uploaded image using Filestack's OCR API.
- **Real-Time Display**: Displays the extracted text directly in the app interface.
- **Clean User Interface**: Features a responsive and user-friendly design.

## Prerequisites

To run this example, you need the following:

1. A valid [Filestack API Key](https://www.filestack.com/).
2. A security policy and signature configured in your Filestack account for OCR functionality.

## How to Use

1. **Clone the Repository**
   
   `git clone <repository-url>`

   `cd <repository-folder>`

2. **Edit API Key and Credentials**

   - Open the `index.html` file.

   - Replace the placeholders `YOUR_API_KEY`, `YOUR_POLICY`, and `YOUR_SIGNATURE` with your Filestack credentials.

Learn more about [Security Policies](https://www.filestack.com/docs/security/policies/)

3. **Serve the Application**  

   When you test the application, use a local web server to serve the `index.html` file. This avoids CORS-related issues when accessing the app in a browser.

   - **Using Python's Built-in HTTP Server**:

     `python3 -m http.server`
    
   - **Using Node.js http-server**:
     
     `npx http-server`
     

4. **Access the Application** 

   Open your browser and navigate to [http://localhost:8000](http://localhost:8000) (or the appropriate address for your local server).

---

## Use the App

1. **Click the "Upload Image" button.**  

2. **Select an image of a scanned document to upload.**  

3. **The extracted text will be displayed in the app interface.**

---

## Code Overview

### HTML:

- Provides the structure of the app, including:

  - The "Upload Image" button.

  - Display area for the OCR output.

- Includes a background image for a clean visual appeal.

### CSS:

- Implements responsive and modern styling for the app.

- Includes custom button styles and a clean layout.

### JavaScript:

- Initializes the Filestack client.

- Handles file uploads using Filestack's file picker.

- Processes the uploaded image with Filestack's OCR API.

- Dynamically updates the DOM to display extracted text.

---

## Notes

- Ensure your Filestack API Key, policy, and signature are valid.

- This example uses Filestack's OCR feature, which may require specific permissions in your security policy.

- For production use, review security settings and optimize the code as needed.

---

## Resources

- [Filestack Documentation](https://www.filestack.com/docs/)

- [Filestack API Reference](https://www.filestack.com/docs/api/)

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Feedback

If you encounter any issues or have suggestions for improvements, feel free to create an issue or submit a pull request.

