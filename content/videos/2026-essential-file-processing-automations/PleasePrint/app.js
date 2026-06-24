let activePrintId = null;
let prints = [];

/* ----------------------------
   SCREEN HELPERS
----------------------------- */

function hideAllScreens() {
  document.querySelectorAll('section').forEach(s =>
    s.classList.add('d-none')
  );
}

function showScreen(id) {
  hideAllScreens();
  document.getElementById(id).classList.remove('d-none');
}

showScreen('homeScreen');
renderPrintGrid();

/* ----------------------------
   HOME GRID
----------------------------- */

function renderPrintGrid() {
  const grid = document.getElementById('printGrid');

  grid.innerHTML = `
    <div class="col-md-3">
      <div class="print-card add-card" onclick="showAddPrint()">
        <div class="plus">+</div>
        <p>Add New Print</p>
      </div>
    </div>
  `;

  fetch('php/loadPrints.php')
    .then(res => res.json())
    .then(data => {
      prints = data;

      data.forEach(print => {
        grid.innerHTML += `
          <div class="col-md-3">
            <div class="print-card">
              <div class="print-thumb">
                <img
                    src="https://cdn.filestackcontent.com/resize=height:140/${print.original_handle}"
                    alt="${print.print_name}"
                />
              </div>
              <strong>${print.print_name}</strong>
            ${print.status === 'rejected'
            ? '<div class="badge rejected mt-2">Rejected</div>'
            : ''
            }

              <button class="btn gradient-btn btn-sm mt-2"
                onclick="loadPrint(${print.print_id})">
                Check-Out
              </button>

              <div class="remove-link mt-2"
                onclick="removePrint(${print.print_id})">
                Remove
              </div>
            </div>
          </div>
        `;
      });
    })
    .catch(console.error);
}

/* ----------------------------
   ADD PRINT
----------------------------- */

function showAddPrint() {
  showScreen('addPrintScreen');
}

function cancelAddPrint() {
  showScreen('homeScreen');
}

function savePrint() {
  const name = printNameInput.value.trim();
  const qty = quantityInput.value;

  if (!name || !qty || !processedFile) {
    alert('Please complete all fields and upload a file');
    return;
  }

  fetch('php/savePrint.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      print_name: name,
      quantity: qty,
      file_handle: processedFile.handle,
      original_handle: processedFile.original_handle,
      status: processedFile.status
    })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error();
      processedFile = null;
      pendingOriginalHandle = null;
      uploadStatus.innerHTML = '';
      showScreen('homeScreen');
      renderPrintGrid();
    })
    .catch(() => alert('Failed to save print'));
}

/* ----------------------------
   PRINT DETAILS
----------------------------- */

function loadPrint(id) {
  activePrintId = id;

  fetch(`php/loadPrintDetails.php?id=${id}`)
    .then(res => res.json())
    .then(print => {
      detailName.textContent = print.print_name;
      detailQty.textContent = print.quantity;
      detailDate.textContent = print.created_at.date;

      detailStatus.textContent = print.status;
      detailStatus.className =
        'badge ' + (print.status === 'ready' ? 'ready' : 'rejected');

      detailPreview.innerHTML = `
        <div class="print-preview">
            <iframe
                src="https://cdn.filestackcontent.com/${print.file_handle}"
                frameborder="0">
            </iframe>
        </div>
      `;

      showScreen('printDetailsScreen');
    })
    .catch(console.error);
}

function removePrint(id) {
    fetch('php/deletePrint.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ print_id: id })
    })
    .then(res => res.json())
    .then(() => renderPrintGrid())
    .catch(console.error);
}

/* ----------------------------
   FILESTACK + WORKFLOW
----------------------------- */

const filestackClient = filestack.init(window.APP_CONFIG.FILESTACK_KEY);
let processedFile = null;
let pendingOriginalHandle = null;

document.getElementById('uploadBtn').addEventListener('click', () => {
  filestackClient
    .picker({
      accept: ['image/*'],
      maxFiles: 1,
      uploadInBackground: false,
      onUploadDone: res => {
        const tempId = crypto.randomUUID();
        pendingOriginalHandle = res.filesUploaded[0].handle;
        showProcessing(tempId);
        startWorkflow(pendingOriginalHandle, tempId);
      }
    })
    .open();
});

function startWorkflow(handle, tempId) {
  fetch('php/runWorkflow.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.jobid) throw new Error();
      pollWorkflow(data.jobid, tempId);
    })
    .catch(console.error);
}

function pollWorkflow(jobId, tempId) {
  fetch(`php/getWorkflowResult.php?job=${jobId}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === 'Finished') {
        removeProcessing(tempId);

        processedFile = {
            handle: data.handle,
            original_handle: pendingOriginalHandle,
            status: data.print_status
        };

        uploadStatus.innerHTML = `
          <div class="alert alert-${
            processedFile.status === 'ready' ? 'success' : 'danger'
          }">
            ${processedFile.status === 'ready'
              ? 'Print ready ✓'
              : 'Rejected: Low DPI'}
          </div>
        `;
      } else {
        setTimeout(() => pollWorkflow(jobId, tempId), 3000);
      }
    })
    .catch(console.error);
}

function showProcessing(tempId) {
  uploadStatus.innerHTML = `
    <div id="${tempId}" class="alert alert-info">
      Processing file…
    </div>
  `;
}

function removeProcessing(tempId) {
  const el = document.getElementById(tempId);
  if (el) el.remove();
}

function goBackHome() {
  showScreen('homeScreen');
}
