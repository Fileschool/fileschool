# Secure Image Hosting API Demo with Filestack

This demo shows how to use the **Filestack File Picker** with:

- Secure image uploads (policy + signature)
- CDN image hosting
- Secure image transformations
- A simple front-end for previewing uploaded images

## Features

- Client-side image upload using Filestack Picker
- Secure policy + signature generated on the server
- CDN delivery URL and transformed URL displayed in the UI
- Example transformation (resize + quality)

## Prerequisites

- Node.js (v16+ recommended)
- A Filestack account
- Your Filestack **API Key** and **App Secret** 

## Setup

1. Clone this repository:

   ```
   git clone https://github.com/fileschool/filestack-snippets.git
   cd filestack-snippets/content/blogs/filestack-secure-image-hosting-demo 
   ```
   
2. Install dependencies:
   
   `npm install`
   
3.  Create a `.env` file based on `.env.example`:

    `cp .env.example .env`
   
    Then edit `.env` and replace the below placeholders with the actual values you copied from your Filestack dashboard:

    ```
    FILESTACK_API_KEY=YOUR_FILESTACK_API_KEY
    FILESTACK_APP_SECRET=YOUR_FILESTACK_APP_SECRET
    PORT=3000
    ```

4. Start the server:

   `npm start`

5. Open the app in your browser:

   `http://localhost:3000`

## Security Notes

- Never expose your Filestack App Secret in client-side code.

- Policy and signature are generated on the server in `server.js`.

- The client only receives the `policy` and `signature` values, not the secret.

## How It Works

1. The frontend calls `/api/filestack-security` to get a short-lived policy + signature.

2. The frontend initializes the Filestack client with:

   - API key

   - Security object { `policy, signature` }

3. The user clicks **Upload Secure Image**.

4. Filestack Picker opens and uploads the file directly to Filestack.

5. The app shows:

   - The Filestack CDN URL

   - A transformed, secure image (resized image)
  
## Resources
- [Filestack Docs](https://www.filestack.com/docs/)

- Filestack Article: [Secure Image Hosting API for Early-Stage Products](https://blog.filestack.com/secure-image-hosting-api-early-stage-products/)

---

## License

This project is open source under the [MIT License](https://github.com/fileschool/filestack-snippets/blob/main/content/blogs/filestack-secure-image-hosting-demo/LICENSE).

---

## Credits

Created as part of the article:
Secure Image Hosting API for Early-Stage Products

Brought to life using the Filestack File Picker and JS SDK.

Created by [Shamal Jayawardhana](https://www.linkedin.com/in/shamal-jayawardhana/)
