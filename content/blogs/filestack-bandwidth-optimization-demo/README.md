# Filestack Bandwidth Optimization Demo

This project is a simple demo showing how Filestack helps reduce CDN bandwidth usage through:

- Automatic image compression

- On-the-fly transformations

- Responsive delivery

- Upload restriction controls

- Signed URLs (hotlink protection)

- CDN-based optimized delivery

- Intelligent caching

The demo includes a file uploader and displays three versions of the uploaded file:

1. Original file (full CDN URL)

2. Optimized version (compressed, resized, WebP)

3. Signed URL version (protected delivery)

This example is designed for use in the article:
**[CDN Bandwidth Optimization for Bootstrapped Startups](https://blog.filestack.com/cdn-bandwidth-optimization-bootstrapped-startups/)**

---

## Features Demonstrated
### ✅ 1. File Uploads

Uses Filestack’s JavaScript picker for fast, secure file uploads.

### ✅ 2. Upload Restrictions

   - Max 1 file

   - Max 5MB

   - Accepts only images & MP4 videos

   - Prevents overly large uploads that waste bandwidth

### ✅ 3. Automatic Image Optimization

Uses a transformation pipeline to resize, compress, and convert images to WebP:

`https://cdn.filestackcontent.com/resize=width:600,fit:max/compress/output=format:webp,quality:80/<HANDLE>`

### ✅ 4. On-the-Fly Transformations

No duplicate files — all optimized variants are generated with URL parameters.

### ✅ 5. Signed Delivery / Hotlink Protection

Demonstrates how to secure files using Filestack’s security policy + signature:

`https://cdn.filestackcontent.com/security=policy:<POLICY>,signature:<SIGNATURE>/<HANDLE>`

### ✅ 6. CDN Delivery & Caching

All files are served through Filestack’s global CDN layer.

---

## Project Structure

```
filestack-bandwidth-optimization-demo/
│
├── index.html      # UI + Filestack JS script
├── styles.css      # Simple styling for demo
├── main.js         # Upload logic + transformations
└── README.md       # This file
└── LICENSE         # MIT License
```

## Setup Instructions

### 1. Clone the repo

```
git clone https://github.com/fileschool/filestack-snippets.git
cd filestack-snippets/content/blogs/filestack-bandwidth-optimization-demo
```

### 2. Add your Filestack API Key

Open `main.js` and replace:

`const client = filestack.init("YOUR_API_KEY");`

with your actual Filestack API key.

### 3. (Optional) Add Security Policy + Signature

To test signed URLs, replace:

```
policy: YOUR_POLICY
signature: YOUR_SIGNATURE
```

You can generate these in your Filestack Dashboard under **Security**.

### 4. Open the project

No backend required — simply open `index.html` in your browser.

---

## How to Test the Demo

1. Click Upload File.

2. Select an image or MP4 video (under 5MB).

3. The app will show:

   - The original file

   - The optimized version (lower bandwidth)

   - The signed version (secure delivery)

Inspect Loaded Images → Observe the reduced file size and CDN URLs.

---

## How This Reduces CDN Bandwidth

Filestack automatically reduces bandwidth usage by:

- Compressing large images

- Resizing oversized uploads

- Converting images to WebP

- Preventing delivery of huge unoptimized files

- Serving cached files from the CDN's nearest edge

- Blocking hotlinking & unauthorized access

This gives bootstrapped startups predictable, efficient, low-cost media delivery.

---

## Related Documentation

- Filestack Transformations: https://www.filestack.com/docs/api/processing/

- Filestack Delivery CDN: https://www.filestack.com/docs/delivery/cdn/

- Filestack File Picker: https://www.filestack.com/docs/api/pickers/javascript/

- Security Policies & Signatures: https://www.filestack.com/docs/security/

---

## License

[MIT License](https://github.com/fileschool/filestack-snippets/blob/main/content/blogs/filestack-bandwidth-optimization-demo/LICENSE) — free to use, modify, and extend.
