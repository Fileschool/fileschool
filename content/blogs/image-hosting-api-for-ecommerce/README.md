# Custom Shirt Design Demo

This project demonstrates how to use **Filestack** for uploading custom shirt designs and selecting customization options such as color, size, and quantity. Users can upload an image, preview it, and submit their order details.

## Features

- **Image Upload:** Users can upload their custom design using the **Filestack file picker**.
- **Live Preview:** The uploaded design is displayed instantly.
- **Shirt Customization:** Users can select the **color, size, and quantity** of their shirt.
- **Order Submission:** The final selection is displayed as a confirmation message.
- **Reset Option:** Users can reset and start over if needed.

## Technologies Used

- **HTML** – Structure the webpage
- **CSS** – Style and enhance the UI
- **JavaScript** – Add interactivity and handle logic
- **Filestack API** – Upload images and retrieve file URLs

## Getting Started

### 1. Clone the Repository and Navigate to the Correct Directory

`git clone https://github.com/Fileschool/filestack-snippets.git`

`cd filestack-snippets/content/blogs/image-hosting-api-for-ecommerce`

### 2. Open the HTML File and Run a Test

Simply open the `index.html` file in your browser.

Alternatively, use a local server to avoid CORS issues:

#### Python 3
`python -m http.server 8000`

#### Node.js
`npx http-server`

Then, open your browser and visit `http://localhost:8000` or the address displayed in your terminal.

### 3. Replace the Filestack API Key

Inside index.html, locate:

`const client = filestack.init('YOUR_API_KEY');`

Replace `'YOUR_API_KEY'` with your valid [Filestack API Key](https://www.filestack.com/signup-free/).

## How It Works

1. Click the **Upload Your Design** button to select an image.
2. The uploaded design is **previewed** on the screen.
3. Choose the **shirt color, size, and quantity**.
4. Click **Submit** to confirm the order.
5. A confirmation message will be displayed.
6. Click **Reset** to start over.

## License
This project is open-source and available under the **MIT License**.

## Resources

[Filestack documentation](https://www.filestack.com/docs/)

Also read our article [The Benefits of a Fast Image Hosting API for E-Commerce](https://blog.filestack.com/the-benefits-of-fast-image-hosting-apis-for-e-commerce/).

Visit [Filestack](https://www.filestack.com/).

