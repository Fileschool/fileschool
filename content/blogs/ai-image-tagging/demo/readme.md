# Image Upload and Tagging Example

This repository contains a simple example of how to implement image upload and tagging using the Filestack API. The application allows users to upload an image, fetch AI-generated tags, and display them on the webpage.

---

## **Features**
- Upload images using the Filestack File Picker.
- Fetch auto-generated tags for uploaded images using Filestack's AI tagging feature.
- Display the fetched tags in a user-friendly interface.

---

## **Demo**
The application provides the following functionalities:
1. Upload an image using the **Upload Image** button.
2. Automatically fetch relevant tags for the uploaded image.
3. Display the tags on the screen in real-time.

---

## **How to Run**

### **1. Clone the Repository**

`git clone <repository-url>`

`cd <repository-folder>`

### **2. Configure the API Keys**

Replace the placeholder values YOUR_API_KEY, YOUR_POLICY, and YOUR_SIGNATURE in the JavaScript code with your Filestack API Key, Policy, and Signature.

### **3. Run the Application**

Open the index.html file directly in your browser, or serve it via a local web server (recommended). You can use Python or Node.js for a local server:

**- Python:**

`python -m http.server`

**- Node.js (http-server):**

`npx http-server`

## **Code Explanation**

### **HTML**

The `index.html` file contains the structure of the application:

- **Button:** For uploading images.
  
- **Tag Display Area:** To show the fetched tags.

### **CSS**

Styling is included in the `<style>` tag to create a clean and responsive design:

- Centered layout with shadow and rounded corners.
  
- Styled buttons with hover effects.

### **JavaScript**

**- Filestack Integration:**

- Initializes the Filestack client using your API key.
  
- Opens the Filestack File Picker on button click.
  
**- Fetch Tags:**

- Sends a request to the Filestack tagging endpoint.
  
- Displays auto-generated tags in real-time.

## **Technologies Used**

- **HTML:** Structure of the application.
  
- **CSS:** Styling and layout.
  
- **JavaScript:** Fetching and displaying image tags.

- **Filestack API:** For image uploading and tagging.

## **Resources**

[Filestack Documentation](https://www.filestack.com/docs/)

[Filestack API Key Setup](https://www.filestack.com/signup-start/)

Read our article [How AI Improves Image Tagging Accuracy and Efficiency](https://blog.filestack.com/ai-improves-image-tagging-accuracy-efficiency/)

