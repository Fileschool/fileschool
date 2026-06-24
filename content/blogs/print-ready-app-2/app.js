// Initialize Filestack client
const client = filestack.init("YOUR_API_KEY"); // Replace this with your Filestack API key

const uploadBtn = document.getElementById("uploadBtn");
const originalImage = document.getElementById("originalImage");
const processedImage = document.getElementById("processedImage");
const statusBox = document.getElementById("status");

const RUN_WORKFLOW_URL = "http://localhost:3001/run-workflow";
const STATUS_URL = "http://localhost:3001/workflow-status";

uploadBtn.addEventListener("click", () => {
  client
    .picker({
      maxFiles: 1,
      onUploadDone: async (res) => {
        const file = res.filesUploaded[0];

        // Show original image
        originalImage.src = file.url;
        processedImage.src = "";

        statusBox.style.display = "block";
        statusBox.style.background = "#e0f2fe";
        statusBox.innerHTML = "Starting workflow…";

        try {
          // Start workflow
          const startRes = await fetch(RUN_WORKFLOW_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileHandle: file.handle })
          });

          const startData = await startRes.json();

          if (!startRes.ok || !startData.jobId) {
            throw new Error(startData.error || "Workflow failed to start");
          }

          // Poll workflow status
          pollWorkflow(startData.jobId);
        } catch (err) {
          statusBox.innerHTML = `❌ ${err.message}`;
          statusBox.style.background = "#fee2e2";
        }
      }
    })
    .open();
});

// ===============================
// POLL WORKFLOW STATUS
// ===============================
function pollWorkflow(jobId) {
  const interval = setInterval(async () => {
    try {
      const res = await fetch(`${STATUS_URL}/${jobId}`);
      const data = await res.json();

      // Filestack uses lowercase status values
      if (data.status === "Finished") {
        clearInterval(interval);

        /**
         * IMPORTANT:
         * The output comes from the STORE task name
         * In our Workflow, the STORE task name is store_1766662754939
         */

        const output =
              data.results &&
              data.results.store_1766662754939 &&
              data.results.store_1766662754939.data
          ? data.results.store_1766662754939.data.url
        : null;
        

        if (!output) {
          throw new Error("Workflow finished but no output file found");
        }
        
        processedImage.src = output; 
        statusBox.innerHTML = "✅ Done! Your print-ready image is ready.";
        statusBox.style.background = "#dcfce7";
      }

      if (data.status === "failed") {
        clearInterval(interval);
        statusBox.innerHTML = "❌ Workflow failed";
        statusBox.style.background = "#fee2e2";
      }
    } catch (err) {
      clearInterval(interval);
      statusBox.innerHTML = "❌ Error checking workflow status";
      statusBox.style.background = "#fee2e2";
    }
  }, 1500);
}
