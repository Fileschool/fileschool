// Node.js server-side upload example
// Run after: npm install filestack-js

const filestack = require("filestack-js");

const API_KEY = "YOUR_API_KEY"; // Replace with your Filestack API key

const client = filestack.init(API_KEY);

async function upload() {
  const result = await client.upload(
    Buffer.from("hello world"),
    {},
    {
      filename: "hello.txt",
      mimetype: "text/plain",
    }
  );
  console.log("Handle:", result.handle);
  console.log("URL:", result.url);
}

upload().catch(console.error);
