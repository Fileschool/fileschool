# 🛍️ Filestack Image Compression – E-commerce Demo

A simple demo web app that shows how startups and developers can use **Filestack’s JavaScript SDK** and **Image Optimization API** to compress, resize, and deliver product images efficiently — helping reduce bandwidth costs and improve website speed.

---

## 🚀 Features

- 🖼️ Upload product images using the Filestack File Picker  
- ⚙️ Automatically generate optimized images via CDN transformations  
- 💨 Resize, compress, and convert images to WebP in real-time  
- 🌐 Display optimized previews instantly  
- 💾 Example transformation URLs included  

---

## 🧩 How It Works

1. **Upload an image**
   - Click **“Upload product image”** to open the Filestack File Picker.  
   - The uploaded image is securely stored on Filestack’s cloud.  

2. **Optimize automatically**
   - Each image is automatically resized, compressed, and converted to a modern format (`WebP`) using Filestack’s transformation API.

3. **View optimized results**
   - The optimized image preview, file handle, and transformation URL are displayed in the browser.

---

## 🛠️ Setup Instructions

### 1️⃣ Clone this repository
```
git clone https://github.com/fileschool/filestack-snippets.git
cd filestack-snippets/content/blogs/e-commerce-image-compression-demo
```

### 2️⃣ Open the project

You can run the HTML file locally:

	- Simply double-click index.html, or
	- Use a local dev server (e.g., VS Code’s Live Server extension).

### 3️⃣ Add your Filestack API key

In the script section of `index.html`, replace the placeholder with your real API key:

`const client = filestack.init('YOUR_API_KEY');`

You can get your API key from the Filestack Developer Dashboard after [signing up](https://www.filestack.com/signup-start/) for a free Filestack account.

## 🧠 Example Transformation

The optimized image URLs use Filestack’s transformation syntax:

`https://cdn.filestackcontent.com/resize=width:600,fit:max/compress/output=format:webp,quality:80/FILE_HANDLE`

  - resize=width:600 → Resizes the image to 600px wide
    
	- compress → Reduces file size efficiently
    
	- output=format:webp,quality:80 → Converts to WebP format with 80% quality

## 📸 Demo Preview

Once you upload an image, you’ll see:

- The optimized product preview

- The file handle

- The optimized CDN URL

- A sample <img> snippet you can embed in your website

## ⚡ Benefits for Startups

- Cut CDN and hosting costs by up to 40–70%

- Improve page load speeds and SEO performance

- Deliver consistent, high-quality visuals on all devices

## 🧑‍💻 Tech Stack

- HTML5 + CSS3

- JavaScript (Vanilla)

- Filestack JavaScript SDK

- Filestack CDN & Image Optimization API

## 📄 License

This project is open-source and available under the [MIT License](https://github.com/fileschool/filestack-snippets/blob/main/content/blogs/e-commerce-image-compression-demo/LICENSE).

## 🔗 Learn More

- [Filestack Documentation](https://www.filestack.com/docs/)
  
- [Image Optimization API Reference](https://www.filestack.com/docs/api/processing/)￼
  
- [Filestack JavaScript SDK](https://www.filestack.com/sdks/javascript/)

- [Image Compression for Startup Bandwidth Costs](https://blog.filestack.com/image-compression-for-startup-bandwidth-costs/)

## 💡 Credits

Created as part of the article:
Image Compression for Startup Bandwidth Costs

Brought to life using [Filestack](https://www.filestack.com/).

Created by [Shamal Jayawardhana](https://www.linkedin.com/in/shamal-jayawardhana/)
