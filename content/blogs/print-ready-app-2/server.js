const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// CONFIG
// ===============================
const FILESTACK_API_KEY = "YOUR_API_KEY"; // Replace with your Filestack API key
const FILESTACK_APP_SECRET = "YOUR_FILESTACK_APP_SECRET"; // Replace with your Filestack App Secret
const WORKFLOW_ID = "YOUR_WORKFLOW_ID"; // Replace with your Filestack Workflow ID
const PORT = 3001;

// ===============================
// POLICY + SIGNATURE
// ===============================
function createPolicy() {
  const policyObj = {
    expiry: Math.floor(Date.now() / 1000) + 300, // 5 min
    call: [
      "runWorkflow",
      "pick",
      "read",
      "store",
      "convert"
    ]
  };

  const policy = Buffer.from(JSON.stringify(policyObj)).toString("base64");

  const signature = crypto
    .createHmac("sha256", FILESTACK_APP_SECRET)
    .update(policy)
    .digest("hex");

  return { policy, signature };
}

// ===============================
// RUN WORKFLOW
// ===============================
app.post("/run-workflow", async (req, res) => {
  const { fileHandle } = req.body;

  if (!fileHandle) {
    return res.status(400).json({ error: "Missing file handle" });
  }

  const { policy, signature } = createPolicy();

  const url = `https://cdn.filestackcontent.com/security=p:${policy},s:${signature}/run_workflow=id:${WORKFLOW_ID}/${fileHandle}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    if (!response.ok) {
      console.error("Filestack error:", text);
      return res.status(500).json({ error: text });
    }

    const data = JSON.parse(text);

    res.json({ jobId: data.jobid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start workflow" });
  }
});

// ===============================
// WORKFLOW STATUS
// ===============================
app.get("/workflow-status/:jobId", async (req, res) => {
  const { jobId } = req.params;
  const { policy, signature } = createPolicy();

  const url = `https://cdn.filestackcontent.com/${FILESTACK_API_KEY}/security=p:${policy},s:${signature}/workflow_status=job_id:${jobId}`;
  

  try {
    const response = await fetch(url);
    const text = await response.text();

    if (!response.ok) {
      console.error("Status error:", text);
      return res.status(500).json({ error: text });
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch workflow status" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
