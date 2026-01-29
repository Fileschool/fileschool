export let client = null;
let pickerInstance = null;
let debounceTimer;

export function updatePreview(state) {
    const statusEl = document.getElementById('status-indicator');
    const openBtn = document.getElementById('open-picker-btn');
    const inlineContainer = document.getElementById('inline-container');

    // Update basic UI state
    if (state.apiKey && state.apiKey.length > 5) {
        statusEl.textContent = "Ready";
        statusEl.className = "status-badge success";
        openBtn.disabled = false;
    } else {
        statusEl.textContent = "No API Key";
        statusEl.className = "status-badge error";
        openBtn.disabled = false; // Allow click to show alert
    }

    if (state.picker.displayMode === 'overlay') {
        openBtn.style.display = 'inline-flex';
        inlineContainer.style.display = 'none';

        openBtn.onclick = () => {
            if (!state.apiKey) {
                alert("API Key configuration error. Please contact support.");
                return;
            }
            launchPicker(state);
        };
    } else {
        openBtn.style.display = 'none';
        inlineContainer.style.display = 'flex';
        // For inline, we auto-launch
        if (state.apiKey && state.apiKey.length > 5) {
            // Clear any placeholder message
            inlineContainer.innerHTML = '';
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => launchPicker(state), 500);
        } else {
            inlineContainer.innerHTML = '<p style="color:#666">API Key configuration error</p>';
        }
    }
}

function launchPicker(state) {
    if (typeof filestack === 'undefined') {
        console.error("Filestack SDK not loaded");
        return;
    }

    try {
        client = filestack.init(state.apiKey);

        const options = {
            fromSources: state.picker.sources,
            accept: state.picker.accept.length > 0 ? state.picker.accept : undefined,
            minFiles: state.picker.minFiles,
            maxFiles: state.picker.maxFiles,
            maxSize: state.picker.maxSize * 1024 * 1024, // Convert MB to bytes
            displayMode: state.picker.displayMode,
            container: state.picker.displayMode !== 'overlay' ? state.picker.container : undefined,
            onUploadDone: (result) => {
                console.log('Upload complete:', result);
                if (result.filesUploaded && result.filesUploaded.length > 0) {
                    // Get the first uploaded file
                    const uploadedFile = result.filesUploaded[0];

                    // Import and call setUploadedImage
                    import('./transformations.js').then(module => {
                        if (module.setUploadedImage) {
                            module.setUploadedImage(uploadedFile);
                        }
                    }).catch(err => {
                        console.error('Error loading transformations module:', err);
                    });
                }
            }
        };

        // Close previous if exists
        if (pickerInstance) {
            pickerInstance.close();
        }

        pickerInstance = client.picker(options);
        pickerInstance.open();

    } catch (e) {
        console.error("Error launching picker:", e);
    }
}
