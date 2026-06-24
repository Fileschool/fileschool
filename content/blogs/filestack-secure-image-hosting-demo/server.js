require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const path = require("path");

const app = express();

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

const FILESTACK_API_KEY = process.env.FILESTACK_API_KEY;
const FILESTACK_APP_SECRET = process.env.FILESTACK_APP_SECRET;

// Simple health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Generate Filestack policy + signature
app.get("/api/filestack-security", (req, res) => {
  if (!FILESTACK_API_KEY || !FILESTACK_APP_SECRET) {
    return res.status(500).json({
      error: "Missing Filestack API key or app secret in environment variables."
    });
  }

  // Short-lived policy: valid for 1 hour
  const expiry = Math.floor(Date.now() / 1000) + 60 * 60;

  const policyObj = {
    expiry,
    call: ["pick", "read", "store", "convert"]
  };

  const policy = Buffer.from(JSON.stringify(policyObj))
    .toString("base64")
    .replace(/\n/g, "");

  const signature = crypto
    .createHmac("sha256", FILESTACK_APP_SECRET)
    .update(policy)
    .digest("hex");

  res.json({
    apiKey: FILESTACK_API_KEY,
    policy,
    signature
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
