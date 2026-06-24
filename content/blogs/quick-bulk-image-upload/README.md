# Filestack Bulk Image Upload Demo

## Filestack Bulk Image Upload Example

This project demonstrates a web-based image bulk upload functionality using the Filestack API. It allows users to upload multiple images simultaneously, display resized versions of uploaded images in a grid layout, and provides links to view the original images.

---

### Features
- **Bulk Upload:** Upload up to 50 images simultaneously, with the option to increase the maximum limit as needed.
- **Responsive Grid Display:** Uploaded images are displayed in a neat, responsive grid.
- **Filestack Transformations:** Images are resized and cropped to a uniform 200x200 pixels using Filestack's transformation features.
- **Dynamic File Info:** Each uploaded image includes its name and a link to view the full-size image.

---

### Live Demo

To see this example in action, follow these steps:
1. Clone or download the project files.
2. Open the `index.html` file in any modern web browser.
3. Replace `YOUR_API_KEY` in the JavaScript code with your Filestack API key.

---

### Usage

1. Click the **"Upload Images"** button to open the Filestack file picker.
2. Select up to 50 images from your device (maximum limit is set to 50 in this example).
3. Once uploaded, the images will be displayed in a responsive grid.

---

### File Details

#### HTML Structure
- `index.html`: Contains the main HTML structure and JavaScript logic for the demo.

#### CSS
- Inline CSS styles for responsive grid design and aesthetic user interface.

#### JavaScript
- Uses Filestack's JavaScript SDK for file uploads and image transformations.

---

### How to Run

1. **Clone the Repository:**

   `git clone <repository-url>`
   
   `cd <repository-folder>`

3. **Edit API Key:**

- Open index.html and replace YOUR_API_KEY with your Filestack API key.

3. **Open in Browser:**

- Double-click the `index.html` file or serve it via a local web server. (Using a local server is recommended, as some features may not function correctly when opened directly in the file explorer.)

### Dependencies

- **Filestack SDK:** Included via CDN:
  `<script src="https://static.filestackapi.com/filestack-js/3.27.0/filestack.min.js"></script>`

### Filestack Transformations Used

- **Resize:**
  - Ensures images are uniformly cropped to 200x200 pixels.
  - Example transformation URL:
    `https://cdn.filestackcontent.com/resize=width:200,height:200,fit:crop/<file_handle>`

### Notes

- Ensure you have a valid Filestack API key.
- Use modern browsers (e.g., Chrome, Edge, Firefox) for the best experience.

Read our [Guide to Bulk Quick Image Uploads.](https://blog.filestack.com/ultimate-guide-bulk-quick-image-uploads-e-commerce-sites/)

[Visit Filestack](https://www.filestack.com)
