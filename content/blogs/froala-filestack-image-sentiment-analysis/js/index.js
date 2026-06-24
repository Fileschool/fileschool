// js/index.js
// ========================================
// Froala + Filestack Image Sentiment Demo
// ========================================

// 1) CONFIG: add your credentials (never expose secrets in production builds)
const FILESTACK_API_KEY = 'YOUR_FILESTACK_API_KEY';          // from Filestack dashboard
const FILESTACK_POLICY   = 'YOUR_GENERATED_POLICY_BASE64';   // server-signed policy (Base64URL)
const FILESTACK_SIGNATURE = 'YOUR_GENERATED_SIGNATURE_HEX';  // server-signed HMAC-SHA256 signature

// 2) Boot the editor once the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  // Defensive: ensure Froala is available
  if (typeof FroalaEditor === 'undefined') {
    console.error('FroalaEditor global not found. Check your <script> includes.');
    return;
  }

  // Initialize Froala Editor in the #froala-editor container
  new FroalaEditor('#froala-editor', {
    // --- Filestack integration options ---
    filestackOptions: {
      filestackAPI: FILESTACK_API_KEY,
      uploadToFilestackOnly: true,          // only allow direct upload to Filestack
      pickerOptions: {
        accept: ['image/*'],                 // only images for this demo
        fromSources: ['local_file_system']   // keep it simple: device uploads
        // You can add sources like: 'googledrive', 'dropbox', etc.
      }
    },

    // --- Toolbar customization (minimal demo set) ---
    toolbarButtons: {
      moreRich: {
        buttons: ['openFilePickerImageOnly', 'insertLink', 'insertTable', 'emoticons', 'specialCharacters', 'insertHR'],
        buttonsVisible: 3
      },
      moreText: {
        buttons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'clearFormatting']
      },
      moreParagraph: {
        buttons: ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
      },
      moreMisc: {
        buttons: ['undo', 'redo', 'fullscreen', 'selectAll', 'html', 'help'],
        align: 'right',
        buttonsVisible: 2
      }
    },

    // --- Editor sizing (optional) ---
    heightMin: 500,
    heightMax: 1000,

    // --- Event wiring ---
    events: {
      // Fired when a file successfully uploads to Filestack
      'filestack.uploadedToFilestack': function (response) {
        try {
          const uploaded = response?.filesUploaded?.[0];
          if (!uploaded?.handle) {
            console.warn('Upload response missing handle:', response);
            insertNotice(this, 'Upload succeeded, but no file handle was returned.');
            return;
          }
          // Kick off image sentiment detection
          performAnalysis(uploaded.handle, this);
        } catch (err) {
          console.error('Error handling upload success:', err);
          insertNotice(this, 'An error occurred after upload. See console for details.');
        }
      },

      // Fired when an upload fails
      'filestack.uploadFailedToFilestack': function (response) {
        console.error('Upload failed:', response);
        insertNotice(this, 'Upload failed. Please try again.');
      }
    }
  });
});

/**
 * Insert a simple notice paragraph into the editor.
 * @param {FroalaEditor} editorInstance
 * @param {string} message
 */
function insertNotice(editorInstance, message) {
  editorInstance.html.insert(`<p><em>${escapeHtml(message)}</em></p>`);
}

/**
 * Perform Image Sentiment analysis for a given Filestack handle.
 * Builds a secure URL using policy/signature and fetches results.
 * @param {string} fileHandle
 * @param {FroalaEditor} editorInstance
 */
async function performAnalysis(fileHandle, editorInstance) {
  if (!FILESTACK_POLICY || !FILESTACK_SIGNATURE) {
    console.warn('Policy/signature not configured. Sentiment call will fail.');
    insertNotice(editorInstance, 'Sentiment analysis is not configured (missing policy/signature).');
    return;
  }

  // Construct the Processing API URL
  const url =
    `https://cdn.filestackcontent.com/` +
    `security=p:${FILESTACK_POLICY},s:${FILESTACK_SIGNATURE}/` +
    `image_sentiment/${fileHandle}`;

  try {
    insertNotice(editorInstance, 'Analyzing image sentiment…');
    const result = await scanImage(url);

    // Expecting JSON with an `emotions` object; adjust if your API returns different keys
    const emotionsListHtml = formatEmotions(result?.emotions || {});
    editorInstance.html.insert(`<p><strong>Image Sentiment Analysis</strong></p><ul>${emotionsListHtml}</ul>`);
    console.log('Image sentiment result:', result);
  } catch (error) {
    console.error('Error during sentiment analysis:', error);
    insertNotice(editorInstance, 'Could not analyze image sentiment. Please try another image.');
  }
}

/**
 * Fetch helper for the Filestack Processing API call.
 * @param {string} url
 * @returns {Promise<object>}
 */
async function scanImage(url) {
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Sentiment API error (${res.status}): ${text || 'No body'}`);
  }
  return res.json();
}

/**
 * Convert an emotions object into an HTML list.
 * Example input:
 *   { HAPPY: 100.0, CONFUSED: 2.11, CALM: 12.3 }
 * @param {Record<string, number>} emotions
 * @returns {string} HTML string of <li> items
 */
function formatEmotions(emotions) {
  // If API returns nothing detectable, show a friendly message
  const entries = Object.entries(emotions || {});
  if (entries.length === 0) {
    return '<li>No sentiment detected.</li>';
  }

  return entries
    .map(([emotion, value]) => {
      const pct = Number.isFinite(value) ? value : 0;
      return `<li>${escapeHtml(emotion)}: ${pct.toFixed(2)}%</li>`;
    })
    .join('');
}

/**
 * Basic HTML escape to avoid injecting untrusted content into the editor.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
