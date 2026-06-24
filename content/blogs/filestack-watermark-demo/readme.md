# 📸 Filestack Watermark Demo

This project demonstrates how to use the **Filestack JavaScript API** to upload a target image and a logo, then dynamically **apply a watermark** (logo overlay) to the image using Filestack's real-time transformation URL.

> 💡 No image editing software needed — all transformations happen in real time using Filestack’s CDN!

---

## 🚀 Live Demo

Upload a target image and a logo, and preview a watermarked version instantly in the browser.

---

## 🔧 How It Works

1. **Upload Target Image**  
   A Filestack picker allows users to upload any image to be watermarked.

2. **Upload Logo Image**  
   A second picker uploads the logo that will act as the watermark.

3. **Apply Watermark**  
   When both uploads are complete, the logo is overlaid on the target image using the following transformation URL:
   `https://cdn.filestackcontent.com/watermark=file:your_logo_handle,size:250,position:[middle, center]/your_file_handle`

4. **Display Results**  
The original and watermarked images are displayed side by side.

---

## 🛠️ Tech Stack

- HTML + JavaScript  
- [Filestack JS SDK](https://www.filestack.com/sdks/javascript/)  
- [Filestack Transformation API](https://www.filestack.com/docs/api/processing/)

---

## 📝 Setup

1. **Clone this repo** or download the `index.html` file.
2. **Replace** the placeholder `YOUR_API_KEY` in the script with your actual [Filestack API key](https://www.filestack.com/).
3. **Open `index.html`** in any browser.
4. Upload a target image and logo to generate the watermarked image instantly.

---

## 📦 Dependencies

CDN Script:

`<script src="https://static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"></script>`

## 📄 License

MIT License

---

## 🙌 Credits

Created by Shamal Jayawardhana

Powered by Filestack
