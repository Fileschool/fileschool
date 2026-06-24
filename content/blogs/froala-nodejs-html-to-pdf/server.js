const express = require("express");
const path = require("path");
const { generatePdfFromEditorHtml } = require("./pdf/generatePdfFromHtml");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies (Froala HTML can be large)
app.use(express.json({ limit: "3mb" }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Load Froala editor test page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "editor.html"));
});

/**
 * POST /convert-html-to-pdf
 * Body: { "html": "<p>...</p>" }  (Froala editor HTML)
 * Returns: binary PDF download
 */
app.post("/convert-html-to-pdf", async (req, res) => {
  try {
    const { html } = req.body;

    if (typeof html !== "string" || html.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Request body must include a non-empty 'html' string." });
    }

    const pdfOutput = await generatePdfFromEditorHtml(html);

    // ✅ Force output to be a real Buffer (prevents Express from JSON-encoding)
    const pdfBuffer = Buffer.isBuffer(pdfOutput)
      ? pdfOutput
      : Buffer.from(pdfOutput);

    // Optional debug
    console.log("PDF bytes:", pdfBuffer.length);
    console.log("PDF header:", pdfBuffer.slice(0, 5).toString()); // should be %PDF-

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="document.pdf"',
      "Content-Length": pdfBuffer.length,
      "Cache-Control": "no-store"
    });

    // ✅ Send binary (not JSON)
    return res.end(pdfBuffer);
  } catch (err) {
    console.error("PDF generation failed:", err);
    return res.status(500).json({ error: "PDF generation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
});
