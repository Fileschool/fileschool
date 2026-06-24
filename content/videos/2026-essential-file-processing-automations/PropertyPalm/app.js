let activeListingId = null;
let listings = [];

function hideAllScreens() {
    document.querySelectorAll('main section').forEach(s => s.classList.add('d-none'));
}

function showScreen(id) {
    hideAllScreens();
    document.getElementById(id).classList.remove('d-none');
}

showScreen('welcomeScreen');
renderListingList();

function renderListingList() {
    const renderListEl = document.getElementById('listingList');

    // Clear existing list
    renderListEl.innerHTML = '';

    fetch('php/loadListings.php')
    .then(res => {
        if(!res.ok) {
            throw new Error('Failed to load listings');
        }
        return res.json();
    })
    .then(data => {
        data.forEach(listing => {
            const li = document.createElement('li');
            li.textContent = listing.listing_name;
            li.onclick = () => loadListing(listing.listing_id);
            renderListEl.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error loading listings:', error);
    });
}

function showAddListing() {
    showScreen('addListingScreen');
}

function cancelAddListing() {
    showScreen('welcomeScreen');
}

function saveListing() {
    const name = listingNameInput.value.trim();
    const address = addressInput.value.trim();
    const type = propertyTypeInput.value.trim();

    if(!name || !address || !type) {
        alert('Please fill in all fields');
        return;
    }

    fetch('php/saveListing.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            address: address,
            type: type
        })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) throw new Error();

        renderListingList();
        loadListing(data.listing_id);
    })
    .catch(() => alert('Failed to save listing.'));
}

function loadListing(id) {
    activeListingId = id;

    fetch(`php/loadListingDetails.php?id=${id}`)
    .then(res => res.json())
    .then(listing => {
        listingName.textContent = listing.listing_name;
        listingAddress.textContent = listing.address;
        listingType.textContent = listing.property_type;

        loadListingMedia(id);
        showScreen('listingViewScreen');
    })
    .catch(err => console.error(err));
}

const filestackClient = filestack.init(window.APP_CONFIG.FILESTACK_KEY);
let selectedFile = null;

const CONFIG = {
    key: window.APP_CONFIG.FILESTACK_KEY,
    workflowId: 'yourWorkflowID'
}

const pickerOptions = {
    cleanupImageExif: true,
    maxFiles: 5,
    uploadInBackground: false,
    accept: ['image/*', 'video/*'],
    fromSources: ['local_file_system'],

    onUploadDone: (res) => {
        res.filesUploaded.forEach(file => {
            const tempId = crypto.randomUUID();
            addProcessingPlaceholder(tempId);
            startWorkflow(file.handle, tempId);
        });
    }
};


document.getElementById('uploadBtn').addEventListener('click', () => {
    filestackClient.picker(pickerOptions).open();
});

function startWorkflow(originalHandle, tempId) {
    fetch('php/runWorkflow.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: originalHandle })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.jobid) throw new Error('No job ID');
        pollWorkflowResult(data.jobid, tempId);
    })
    .catch(console.error);
}

function pollWorkflowResult(jobId, tempId) {
    fetch(`php/getWorkflowResult.php?job=${jobId}`)
        .then(res => res.json())
        .then(data => {
            if(data.status === 'Finished') {
                removeProcessingPlaceholder(tempId);
                saveMediaToListing(data.handle, data.mimetype);
            }
            else {
                setTimeout(() => pollWorkflowResult(jobId, tempId), 3000);
            }
        })
        .catch(console.error);
}

function saveMediaToListing(handle, mimetype) {
    if (!activeListingId) {
        console.error('No active listing');
        return;
    }

    fetch('php/saveListingMedia.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            listing_id: activeListingId,
            file_handle: handle,
            mimetype: mimetype
        })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) throw new Error();
        loadListingMedia(activeListingId);
    })
    .catch(err => {
        console.error('Failed to save media:', err);
    });
}

function loadListingMedia(listingId) {
    fetch(`php/loadListingMedia.php?listing_id=${listingId}`)
    .then(res => res.json())
    .then(media => {
        renderMedia(media);
    })
    .catch(err => console.error(err));
}

function renderMedia(mediaItems) {
    const container = document.getElementById('mediaList');
    container.innerHTML = '';

    mediaItems.forEach(item => {
        const url = `https://cdn.filestackcontent.com/${item.file_handle}`;
        const card = document.createElement('div');
        card.className = 'media-card';

        if (item.media_type === 'video') {
            card.innerHTML = `<video src="${url}" muted playsinline></video>`;
        }
        else {
            card.innerHTML = `<img src="${url}" />`;
        }

        card.onclick = () => showPreview(item.file_handle, item.media_type);
        container.appendChild(card);
    });
}

// Fullscreen preview
function showPreview(handle, type = 'image') {
    const overlay = document.createElement('div');
    overlay.style = `
        position:fixed; inset:0;
        background:rgba(0,0,0,.85);
        display:flex; align-items:center; justify-content:center;
        z-index:9999;
    `;

    const url = `https://cdn.filestackcontent.com/${handle}`;

    overlay.innerHTML = type === 'video'
        ? `<video src="${url}" controls autoplay style="max-width:90%"></video>`
        : `<img src="${url}" style="max-width:90%">`;

    overlay.onclick = () => overlay.remove();
    document.body.appendChild(overlay);
}

function addProcessingPlaceholder(tempId) {
    const container = document.getElementById('mediaList');

    const card = document.createElement('div');
    card.className = 'media-card processing';
    card.dataset.tempId = tempId;
    card.innerText = 'Processing…';

    container.prepend(card);
}

function removeProcessingPlaceholder(tempId) {
    const el = document.querySelector(
        `.media-card.processing[data-temp-id="${tempId}"]`
    );
    if (el) el.remove();
}
