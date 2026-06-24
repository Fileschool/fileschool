const puppeteer = require("puppeteer");

/**
 * Wrap editor HTML into a full HTML document.
 * Adds print-friendly styles and common WYSIWYG formatting fixes.
 */
function wrapHtmlDocument(editorHtml) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Export</title>

    <style>
      @page { size: A4; margin: 20mm 15mm; }

      body {
        font-family: Arial, sans-serif;
        font-size: 12pt;
        line-height: 1.45;
        color: #111;
      }

      img { max-width: 100%; height: auto; }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 12px 0;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        vertical-align: top;
      }
      th { background: #f5f5f5; text-align: left; }

      ul, ol { padding-left: 24px; }

      /* Page break helper */
      .page-break { page-break-before: always; break-before: page; }

      h1, h2, h3 { page-break-after: avoid; break-after: avoid; }
    </style>
  </head>
  <body>
    ${editorHtml}
  </body>
</html>`;
}

/**
 * Generate PDF Buffer from editor HTML using Puppeteer.
 * Always returns a Node.js Buffer (not Uint8Array).
 * @param {string} editorHtml
 * @returns {Promise<Buffer>}
 */
async function generatePdfFromEditorHtml(editorHtml) {
  if (typeof editorHtml !== "string" || editorHtml.trim().length === 0) {
    throw new Error("editorHtml must be a non-empty string.");
  }

  const fullHtml = wrapHtmlDocument(editorHtml);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const rawPdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
    });

    // ✅ Ensure Node Buffer (Preview-friendly + Express-safe)
    return Buffer.from(rawPdf);
  } finally {
    await browser.close();
  }
}

module.exports = { generatePdfFromEditorHtml };
