# 🎨 Avatar Creator with Filestack

This is a simple web-based **Avatar Creator** built with HTML, JavaScript, and [Filestack](https://www.filestack.com/). It allows users to upload and crop an image to create a circular avatar, ideal for profile pictures, gaming platforms, or user dashboards.

---

## 🚀 Features

- Upload images directly from local files or other sources via Filestack Picker  
- Crop to a perfect square with a 1:1 aspect ratio  
- Preview the avatar with a **circular mask**  
- Client-side validation and error handling  
- Fully responsive and mobile-friendly  

---

## 🛠️ Tech Stack

- HTML5 + CSS3  
- Vanilla JavaScript  
- [Filestack JavaScript SDK](https://www.filestack.com/sdks/javascript/)

---

## 🔧 Setup Instructions

1. **Clone the repository**

`git clone https://github.com/shamalja/filestack-snippets.git`

`cd filestack-snippets/content/blogs/avatar-creator`

2. **Get a Filestack API key**
   
- Sign up at Filestack
- Copy your API key from the dashboard
  
3. **Open index.html**
   
- Replace 'YOUR_API_KEY' in the <script> section with your actual Filestack API key
- Save the file and open it in a browser

## 💡 Usage

Click the “Upload & Crop Image” button to select your image. After cropping, the circular avatar will appear below as a live preview.

## 📁 File Structure

```
avatar-creator/
│
├── index.html            # Main HTML file
├── LICENSE               # MIT License
└── README.md             # This file
```

## 🧩 Customize

- Change avatar size by modifying .avatar-preview dimensions
- Add filters or transformations using Filestack’s transformation options
- Secure uploads by configuring Filestack policies and security signatures

---

## 📚 Learn More

- [Filestack JS SDK Documentation](https://www.filestack.com/docs/)
  
- [Filestack Transformations](https://www.filestack.com/docs/transformations/overview/)

---

## 📝 License

This project is licensed under the [MIT](https://github.com/shamalja/filestack-snippets/blob/main/content/blogs/avatar-creator/LICENSE) License.
Feel free to fork and build on it!

---

## 🙌 Acknowledgments

Thanks to [Filestack](https://www.filestack.com/) for providing a powerful file upload and image transformation service.
