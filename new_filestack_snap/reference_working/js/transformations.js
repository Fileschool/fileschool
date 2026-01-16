import { state } from './config.js';
import { updateCode } from './codegen.js';

// Transformation definitions with their configuration
const TRANSFORMATIONS = {
    // Image Size & Positioning
    resize: {
        label: 'Resize',
        template: (w, h) => `resize=width:${w},height:${h},fit:crop`,
        type: 'dimensions',
        stateKeys: ['resizeWidth', 'resizeHeight']
    },
    crop: {
        label: 'Crop',
        template: (x, y, w, h) => `crop=dim:[${x},${y},${w},${h}]`,
        type: 'dimensions4',
        stateKeys: ['cropX', 'cropY', 'cropWidth', 'cropHeight']
    },
    rotate: {
        label: 'Rotate',
        template: (v) => `rotate=deg:${v}`,
        type: 'range',
        min: 0,
        max: 359,
        stateKey: 'rotate'
    },
    flip: {
        label: 'Flip (Vertical)',
        template: () => `flip`,
        type: 'checkbox'
    },
    flop: {
        label: 'Flop (Horizontal)',
        template: () => `flop`,
        type: 'checkbox'
    },

    // Image Filters
    blur: {
        label: 'Blur',
        template: (v) => `blur=amount:${v}`,
        type: 'range',
        min: 0,
        max: 20,
        stateKey: 'blur'
    },
    sharpen: {
        label: 'Sharpen',
        template: (v) => `sharpen=amount:${v}`,
        type: 'range',
        min: 0,
        max: 20,
        stateKey: 'sharpen'
    },
    monochrome: {
        label: 'Monochrome',
        template: () => `monochrome`,
        type: 'checkbox'
    },
    blackwhite: {
        label: 'Black & White',
        template: (v) => `blackwhite=threshold:${v}`,
        type: 'range',
        min: 0,
        max: 100,
        stateKey: 'blackwhite'
    },
    sepia: {
        label: 'Sepia',
        template: (v) => `sepia=tone:${v}`,
        type: 'range',
        min: 0,
        max: 100,
        stateKey: 'sepia'
    },
    pixelate: {
        label: 'Pixelate',
        template: (v) => `pixelate=amount:${v}`,
        type: 'range',
        min: 2,
        max: 100,
        stateKey: 'pixelate'
    },
    oilpaint: {
        label: 'Oil Paint',
        template: (v) => `oil_paint=amount:${v}`,
        type: 'range',
        min: 2,
        max: 100,
        stateKey: 'oilpaint'
    },
    negative: {
        label: 'Negative',
        template: () => `negative`,
        type: 'checkbox'
    },
    modulate: {
        label: 'Modulate (Hue)',
        template: (v) => `modulate=hue:${v}`,
        type: 'range',
        min: 0,
        max: 359,
        stateKey: 'modulate'
    },

    // Image Borders & Effects
    roundedCorners: {
        label: 'Rounded Corners',
        template: (v) => `rounded_corners=radius:${v}`,
        type: 'range',
        min: 1,
        max: 200,
        stateKey: 'roundedCorners'
    },
    vignette: {
        label: 'Vignette',
        template: (v) => `vignette=amount:${v}`,
        type: 'range',
        min: 0,
        max: 100,
        stateKey: 'vignette'
    },
    polaroid: {
        label: 'Polaroid',
        template: () => `polaroid`,
        type: 'checkbox'
    },
    tornEdges: {
        label: 'Torn Edges',
        template: () => `torn_edges`,
        type: 'checkbox'
    },
    shadow: {
        label: 'Shadow',
        template: (v) => `shadow=opacity:${v}`,
        type: 'range',
        min: 0,
        max: 100,
        stateKey: 'shadow'
    },
    circle: {
        label: 'Circle',
        template: () => `circle`,
        type: 'checkbox'
    },
    border: {
        label: 'Border',
        template: (v) => `border=width:${v}`,
        type: 'range',
        min: 1,
        max: 100,
        stateKey: 'border'
    },

    // Facial Detection
    detectFaces: {
        label: 'Detect Faces',
        template: () => `detect_faces=minsize:0.25,maxsize:0.55,color:red`,
        type: 'checkbox'
    },
    pixelateFaces: {
        label: 'Pixelate Faces',
        template: () => `pixelate_faces=faces:all,amount:10`,
        type: 'checkbox'
    },
    blurFaces: {
        label: 'Blur Faces',
        template: () => `blur_faces=faces:all,amount:10`,
        type: 'checkbox'
    },

    // Image Quality & Compression
    quality: {
        label: 'Quality',
        template: (v) => `quality=value:${v}`,
        type: 'range',
        min: 1,
        max: 100,
        stateKey: 'quality'
    },
    compress: {
        label: 'Compress',
        template: () => `compress`,
        type: 'checkbox'
    },
    pjpg: {
        label: 'Progressive JPEG',
        template: () => `pjpg`,
        type: 'checkbox'
    },
    autoImage: {
        label: 'Auto Image (WebP)',
        template: () => `auto_image`,
        type: 'checkbox'
    },

    // Image Enhancements
    upscale: {
        label: 'Upscale',
        template: () => `upscale`,
        type: 'checkbox'
    },
    redeye: {
        label: 'Red Eye Removal',
        template: () => `redeye`,
        type: 'checkbox'
    },

    // Other
    ascii: {
        label: 'ASCII Art',
        template: () => `ascii`,
        type: 'checkbox'
    },

    // Intelligence Features
    tags: {
        label: 'Tags (AI Auto-tagging)',
        template: () => `tags`,
        type: 'checkbox',
        requiresSecurity: true
    },
    sfw: {
        label: 'SFW Check (Safe for Work)',
        template: () => `sfw`,
        type: 'checkbox',
        requiresSecurity: true
    },
    ocr: {
        label: 'OCR (Text Recognition)',
        template: () => `ocr`,
        type: 'checkbox',
        requiresSecurity: true
    }
};

// Add default values for transformations
const defaults = {
    rotate: 180,
    blur: 8,
    sharpen: 2,
    blackwhite: 50,
    sepia: 80,
    pixelate: 10,
    oilpaint: 4,
    modulate: 155,
    roundedCorners: 100,
    vignette: 20,
    shadow: 60,
    border: 5,
    quality: 85,
    resizeWidth: 400,
    resizeHeight: 400,
    cropX: 0,
    cropY: 0,
    cropWidth: 200,
    cropHeight: 200
};

for (const [key, value] of Object.entries(defaults)) {
    if (!state.transformations.values[key]) {
        state.transformations.values[key] = value;
    }
}

export function initTransformations() {
    renderTransformationOptions();
    initTransformationEventListeners();
}

function renderTransformationOptions() {
    const container = document.getElementById('transformations-list');
    const intelligenceContainer = document.getElementById('intelligence-transformations-list');
    if (!container) return;

    container.innerHTML = '';
    if (intelligenceContainer) intelligenceContainer.innerHTML = '';

    for (const [key, config] of Object.entries(TRANSFORMATIONS)) {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'transform-option';
        optionDiv.dataset.key = key;

        // Check if this transformation requires security
        const needsSecurity = config.requiresSecurity && (!state.transformations.policy || !state.transformations.signature);
        const securityWarning = needsSecurity ? '<span class="security-required" title="Requires Policy & Signature">🔒</span>' : '';

        let html = `
            <label>
                <input type="checkbox" data-key="${key}" ${state.transformations.active.includes(key) ? 'checked' : ''} ${needsSecurity ? 'disabled' : ''} />
                ${config.label} ${securityWarning}
            </label>
        `;

        if (config.type === 'range') {
            const value = state.transformations.values[config.stateKey];
            html += `
                <div style="display:flex; align-items:center; gap:8px; margin-top: 8px;">
                    <input type="range"
                           min="${config.min}"
                           max="${config.max}"
                           value="${value}"
                           data-key="${key}"
                           data-state-key="${config.stateKey}"
                           ${!state.transformations.active.includes(key) ? 'disabled' : ''} />
                    <span class="slider-value" data-key="${key}">${value}</span>
                </div>
            `;
        } else if (config.type === 'dimensions') {
            const width = state.transformations.values[config.stateKeys[0]];
            const height = state.transformations.values[config.stateKeys[1]];
            html += `
                <div style="display:flex; gap:6px; align-items:center; margin-top: 8px;">
                    W: <input type="number"
                              value="${width}"
                              min="50"
                              max="2000"
                              data-key="${key}"
                              data-state-key="${config.stateKeys[0]}"
                              style="width:80px;"
                              ${!state.transformations.active.includes(key) ? 'disabled' : ''} />
                    H: <input type="number"
                              value="${height}"
                              min="50"
                              max="2000"
                              data-key="${key}"
                              data-state-key="${config.stateKeys[1]}"
                              style="width:80px;"
                              ${!state.transformations.active.includes(key) ? 'disabled' : ''} />
                </div>
            `;
        } else if (config.type === 'dimensions4') {
            const x = state.transformations.values[config.stateKeys[0]];
            const y = state.transformations.values[config.stateKeys[1]];
            const w = state.transformations.values[config.stateKeys[2]];
            const h = state.transformations.values[config.stateKeys[3]];
            html += `
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-top: 8px;">
                    <div>X: <input type="number" value="${x}" min="0" max="2000"
                              data-key="${key}" data-state-key="${config.stateKeys[0]}"
                              style="width:70px;" ${!state.transformations.active.includes(key) ? 'disabled' : ''} /></div>
                    <div>Y: <input type="number" value="${y}" min="0" max="2000"
                              data-key="${key}" data-state-key="${config.stateKeys[1]}"
                              style="width:70px;" ${!state.transformations.active.includes(key) ? 'disabled' : ''} /></div>
                    <div>W: <input type="number" value="${w}" min="1" max="2000"
                              data-key="${key}" data-state-key="${config.stateKeys[2]}"
                              style="width:70px;" ${!state.transformations.active.includes(key) ? 'disabled' : ''} /></div>
                    <div>H: <input type="number" value="${h}" min="1" max="2000"
                              data-key="${key}" data-state-key="${config.stateKeys[3]}"
                              style="width:70px;" ${!state.transformations.active.includes(key) ? 'disabled' : ''} /></div>
                </div>
            `;
        }

        optionDiv.innerHTML = html;
        if (state.transformations.active.includes(key)) {
            optionDiv.classList.add('active');
        }

        // Append to appropriate container
        if (config.requiresSecurity && intelligenceContainer) {
            intelligenceContainer.appendChild(optionDiv);
        } else {
            container.appendChild(optionDiv);
        }
    }

    attachTransformationListeners();
}

function attachTransformationListeners() {
    const container = document.getElementById('transformations-list');
    const intelligenceContainer = document.getElementById('intelligence-transformations-list');
    if (!container) return;

    // Combine containers for listeners
    const allContainers = [container];
    if (intelligenceContainer) allContainers.push(intelligenceContainer);

    // Checkbox listeners
    allContainers.forEach(cont => {
        cont.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const key = e.target.dataset.key;
            const optionDiv = e.target.closest('.transform-option');
            const config = TRANSFORMATIONS[key];

            if (e.target.checked) {
                if (!state.transformations.active.includes(key)) {
                    state.transformations.active.push(key);
                }
                optionDiv.classList.add('active');

                // Enable related inputs
                if (config.type === 'range') {
                    const slider = optionDiv.querySelector('input[type="range"]');
                    if (slider) slider.disabled = false;
                } else if (config.type === 'dimensions' || config.type === 'dimensions4') {
                    const inputs = optionDiv.querySelectorAll('input[type="number"]');
                    inputs.forEach(input => input.disabled = false);
                }
            } else {
                state.transformations.active = state.transformations.active.filter(k => k !== key);
                optionDiv.classList.remove('active');

                // Disable related inputs
                if (config.type === 'range') {
                    const slider = optionDiv.querySelector('input[type="range"]');
                    if (slider) slider.disabled = true;
                } else if (config.type === 'dimensions' || config.type === 'dimensions4') {
                    const inputs = optionDiv.querySelectorAll('input[type="number"]');
                    inputs.forEach(input => input.disabled = true);
                }
            }

            updateTransformedImage();
            updateCode(state);
        });
        });
    });

    // Range slider listeners
    allContainers.forEach(cont => {
        cont.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const key = e.target.dataset.key;
                const stateKey = e.target.dataset.stateKey;
                const valueDisplay = cont.querySelector(`.slider-value[data-key="${key}"]`);

                if (valueDisplay) valueDisplay.textContent = e.target.value;
                state.transformations.values[stateKey] = parseInt(e.target.value);

                updateTransformedImage();
                updateCode(state);
            });
        });
    });

    // Number input listeners
    allContainers.forEach(cont => {
        cont.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', (e) => {
                const stateKey = e.target.dataset.stateKey;
                state.transformations.values[stateKey] = parseInt(e.target.value) || 0;

                updateTransformedImage();
                updateCode(state);
            });
        });
    });
}

function initTransformationEventListeners() {
    // Manual handle input
    const manualHandleInput = document.getElementById('trans-manual-handle');
    const policyInput = document.getElementById('trans-policy-input');
    const signatureInput = document.getElementById('trans-signature-input');
    const loadManualBtn = document.getElementById('trans-load-manual-btn');

    if (loadManualBtn) {
        loadManualBtn.addEventListener('click', () => {
            const handle = manualHandleInput ? manualHandleInput.value.trim() : '';
            const policy = policyInput ? policyInput.value.trim() : '';
            const signature = signatureInput ? signatureInput.value.trim() : '';

            if (handle) {
                // Set the handle manually
                setUploadedImage({
                    handle: handle,
                    filename: 'manual-handle'
                });

                // Set policy and signature if provided
                if (policy) state.transformations.policy = policy;
                if (signature) state.transformations.signature = signature;

                // Reload images with security params
                loadOriginalImage();
                updateTransformedImage();
                updateCode(state);

                // Re-render transformations to update security-dependent features
                renderTransformationOptions();
            } else {
                alert('Please enter a valid Filestack handle');
            }
        });
    }

    // Allow Enter key to load handle
    if (manualHandleInput) {
        manualHandleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && loadManualBtn) {
                loadManualBtn.click();
            }
        });
    }

    // Preset buttons
    initPresetButtons();

    // Listen to policy/signature changes to re-render transformations
    if (policyInput) {
        policyInput.addEventListener('input', () => {
            state.transformations.policy = policyInput.value.trim();
            renderTransformationOptions();
            updateCode(state);
        });
    }
    if (signatureInput) {
        signatureInput.addEventListener('input', () => {
            state.transformations.signature = signatureInput.value.trim();
            renderTransformationOptions();
            updateCode(state);
        });
    }
}

function initPresetButtons() {
    const presetButtons = document.querySelectorAll('.preset-btn');

    presetButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const transforms = this.dataset.transforms;
            const requiresSecurity = this.dataset.requiresSecurity === 'true';

            // Check if security is required but not provided
            if (requiresSecurity && (!state.transformations.policy || !state.transformations.signature)) {
                alert('⚠️ This preset requires Security Policy and Signature.\n\nPlease enter them in the "Image Source" section above.');
                return;
            }

            if (!state.transformations.handle) {
                alert('⚠️ Please upload an image or enter a handle first.');
                return;
            }

            // Parse and apply transformations
            applyPresetTransformations(transforms);

            // Visual feedback
            presetButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function applyPresetTransformations(transformChain) {
    // Clear current active transformations
    state.transformations.active = [];

    // Parse the transformation chain
    const transforms = transformChain.split('/');

    const INTELLIGENCE_FEATURES = ['tags', 'sfw', 'ocr'];
    let intelligenceFeatureFound = null;

    transforms.forEach(t => {
        const transformName = t.split('=')[0].trim();

        // Map transform names to our internal keys
        const keyMap = {
            'resize': 'resize',
            'circle': 'circle',
            'compress': 'compress',
            'quality': 'quality',
            'auto_image': 'autoImage',
            'rotate': 'rotate',
            'no_metadata': null, // not implemented yet
            'tags': 'tags',
            'sfw': 'sfw',
            'ocr': 'ocr'
        };

        const internalKey = keyMap[transformName];
        if (internalKey && TRANSFORMATIONS[internalKey]) {
            state.transformations.active.push(internalKey);

            // Track which intelligence feature was found
            if (INTELLIGENCE_FEATURES.includes(internalKey)) {
                intelligenceFeatureFound = internalKey;
            }

            // Parse parameters if needed
            const params = t.split('=')[1];
            if (params && TRANSFORMATIONS[internalKey].type === 'range') {
                // Extract value from params like "value:80"
                const valueMatch = params.match(/value:(\d+)/);
                if (valueMatch) {
                    state.transformations.values[TRANSFORMATIONS[internalKey].stateKey] = parseInt(valueMatch[1]);
                }
            } else if (params && TRANSFORMATIONS[internalKey].type === 'dimensions') {
                // Extract width and height
                const widthMatch = params.match(/width:(\d+)/);
                const heightMatch = params.match(/height:(\d+)/);
                if (widthMatch) {
                    state.transformations.values[TRANSFORMATIONS[internalKey].stateKeys[0]] = parseInt(widthMatch[1]);
                }
                if (heightMatch) {
                    state.transformations.values[TRANSFORMATIONS[internalKey].stateKeys[1]] = parseInt(heightMatch[1]);
                }
            }
        }
    });

    // Set the active intelligence tab to the specific feature found in this preset
    if (intelligenceFeatureFound) {
        state.transformations.activeIntelligenceTab = intelligenceFeatureFound;
    }

    // Re-render and update
    renderTransformationOptions();
    updateTransformedImage();
    updateCode(state);
}

export function setUploadedImage(fileObj) {
    if (!fileObj || !fileObj.handle) return;

    state.transformations.handle = fileObj.handle;
    state.transformations.filename = fileObj.filename || 'uploaded-image';

    // Update UI to show current image
    const uploadStatus = document.getElementById('trans-upload-status');
    const currentImageInfo = document.getElementById('trans-current-image');
    const handleDisplay = document.getElementById('trans-current-handle');
    const filenameDisplay = document.getElementById('trans-current-filename');

    if (uploadStatus) uploadStatus.style.display = 'none';
    if (currentImageInfo) currentImageInfo.style.display = 'block';
    if (handleDisplay) handleDisplay.textContent = fileObj.handle;
    if (filenameDisplay) filenameDisplay.textContent = fileObj.filename || 'unknown';

    // Load images
    loadOriginalImage();
    updateTransformedImage();
    updateCode(state);
}

function getOriginalUrl() {
    if (!state.transformations.handle) return '';

    let url = 'https://cdn.filestackcontent.com';

    if (state.transformations.policy && state.transformations.signature) {
        url += `/security=p:${state.transformations.policy},s:${state.transformations.signature}`;
    }

    url += `/${state.transformations.handle}`;
    return url;
}

export function getTransformationUrl() {
    if (!state.transformations.handle) return '';

    const INTELLIGENCE_FEATURES = ['tags', 'sfw', 'ocr'];

    let url = 'https://cdn.filestackcontent.com';

    if (state.transformations.policy && state.transformations.signature) {
        url += `/security=p:${state.transformations.policy},s:${state.transformations.signature}`;
    }

    const transformations = [];
    state.transformations.active.forEach(key => {
        const config = TRANSFORMATIONS[key];
        if (!config) return;

        // Skip intelligence features - they don't transform the image visually
        if (INTELLIGENCE_FEATURES.includes(key)) {
            return;
        }

        // Skip intelligence features that require security if not provided
        if (config.requiresSecurity && (!state.transformations.policy || !state.transformations.signature)) {
            return;
        }

        if (config.type === 'range') {
            const value = state.transformations.values[config.stateKey];
            transformations.push(config.template(value));
        } else if (config.type === 'dimensions') {
            const width = state.transformations.values[config.stateKeys[0]];
            const height = state.transformations.values[config.stateKeys[1]];
            transformations.push(config.template(width, height));
        } else if (config.type === 'dimensions4') {
            const x = state.transformations.values[config.stateKeys[0]];
            const y = state.transformations.values[config.stateKeys[1]];
            const w = state.transformations.values[config.stateKeys[2]];
            const h = state.transformations.values[config.stateKeys[3]];
            transformations.push(config.template(x, y, w, h));
        } else {
            transformations.push(config.template());
        }
    });

    if (transformations.length > 0) {
        url += `/${transformations.join('/')}`;
    }

    url += `/${state.transformations.handle}`;
    return url;
}

function loadOriginalImage() {
    const img = document.getElementById('trans-original-img');
    const urlDisplay = document.getElementById('original-url-display');
    const urlText = document.getElementById('original-url-text');
    if (!img) return;

    const url = getOriginalUrl();
    if (!url) {
        if (urlDisplay) urlDisplay.style.display = 'none';
        return;
    }

    img.src = url;

    // Show the handle
    if (urlDisplay && urlText && state.transformations.handle) {
        urlText.textContent = state.transformations.handle;
        urlDisplay.style.display = 'block';
    }
}

function updateTransformedImage() {
    const img = document.getElementById('trans-transformed-img');
    const urlOutput = document.getElementById('trans-url-output');
    const transformedUrlDisplay = document.getElementById('transformed-url-display');
    const transformedUrlText = document.getElementById('transformed-url-text');
    if (!img) return;

    const url = getTransformationUrl();
    if (!url || state.transformations.active.length === 0) {
        img.src = getOriginalUrl() || 'https://via.placeholder.com/200x150.png?text=Apply+Transforms';
        if (urlOutput) urlOutput.textContent = 'No transformations applied';
        if (transformedUrlDisplay) transformedUrlDisplay.style.display = 'none';
        hideIntelligencePreview();
        return;
    }

    img.src = url;
    if (urlOutput) urlOutput.textContent = url;

    // Show the transformed URL
    if (transformedUrlDisplay && transformedUrlText) {
        transformedUrlText.textContent = url;
        transformedUrlDisplay.style.display = 'block';
    }

    // Check if any intelligence features are active
    updateIntelligencePreview();
}

function updateIntelligencePreview() {
    const INTELLIGENCE_FEATURES = ['tags', 'sfw', 'ocr'];
    const activeIntelligence = state.transformations.active.filter(key => INTELLIGENCE_FEATURES.includes(key));

    const intelligenceSection = document.getElementById('intelligence-preview-section');
    const intelligencePlaceholder = document.getElementById('intelligence-placeholder');
    const intelligenceLoading = document.getElementById('intelligence-loading');
    const intelligenceOutput = document.getElementById('intelligence-data-output');
    const intelligenceTabs = document.getElementById('intelligence-tabs');

    if (!intelligenceSection) return;

    if (activeIntelligence.length === 0) {
        hideIntelligencePreview();
        return;
    }

    // Show intelligence section
    intelligenceSection.style.display = 'flex';

    if (!state.transformations.policy || !state.transformations.signature) {
        intelligencePlaceholder.textContent = 'Security Policy & Signature required';
        intelligencePlaceholder.style.display = 'block';
        intelligenceLoading.style.display = 'none';
        intelligenceOutput.style.display = 'none';
        intelligenceTabs.style.display = 'none';
        return;
    }

    // Show tabs if multiple intelligence features
    if (activeIntelligence.length > 1) {
        renderIntelligenceTabs(activeIntelligence);
        intelligenceTabs.style.display = 'flex';
    } else {
        intelligenceTabs.style.display = 'none';
    }

    // Fetch intelligence data for all active features
    intelligencePlaceholder.style.display = 'none';
    intelligenceLoading.style.display = 'flex';
    intelligenceOutput.style.display = 'none';

    // Store current active feature for tab switching
    if (!state.transformations.activeIntelligenceTab) {
        state.transformations.activeIntelligenceTab = activeIntelligence[0];
    }

    // Fetch data for the active tab
    fetchIntelligenceData(state.transformations.activeIntelligenceTab);
}

function renderIntelligenceTabs(features) {
    const intelligenceTabs = document.getElementById('intelligence-tabs');
    if (!intelligenceTabs) return;

    const featureLabels = {
        'tags': 'Tags',
        'sfw': 'SFW',
        'ocr': 'OCR'
    };

    intelligenceTabs.innerHTML = features.map(feature => `
        <button class="intelligence-tab ${state.transformations.activeIntelligenceTab === feature ? 'active' : ''}"
                data-feature="${feature}">
            ${featureLabels[feature] || feature}
        </button>
    `).join('');

    // Add click listeners
    intelligenceTabs.querySelectorAll('.intelligence-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            state.transformations.activeIntelligenceTab = btn.dataset.feature;
            renderIntelligenceTabs(features);
            fetchIntelligenceData(btn.dataset.feature);
        });
    });
}

function fetchIntelligenceData(feature) {
    const intelligenceLoading = document.getElementById('intelligence-loading');
    const intelligenceOutput = document.getElementById('intelligence-data-output');
    const intelligencePlaceholder = document.getElementById('intelligence-placeholder');
    const intelligenceUrlDisplay = document.getElementById('intelligence-url-display');
    const intelligenceUrlText = document.getElementById('intelligence-url-text');

    if (!state.transformations.handle) return;

    // Build URL for specific feature
    let url = 'https://cdn.filestackcontent.com';
    url += `/security=p:${state.transformations.policy},s:${state.transformations.signature}`;
    url += `/${feature}`;

    // Add any non-intelligence transformations to the URL
    const INTELLIGENCE_FEATURES = ['tags', 'sfw', 'ocr'];
    const nonIntelligenceTransforms = state.transformations.active.filter(key => !INTELLIGENCE_FEATURES.includes(key));

    if (nonIntelligenceTransforms.length > 0) {
        const transformChain = [];
        nonIntelligenceTransforms.forEach(key => {
            const config = TRANSFORMATIONS[key];
            if (!config) return;

            if (config.type === 'range') {
                const value = state.transformations.values[config.stateKey];
                transformChain.push(config.template(value));
            } else if (config.type === 'dimensions') {
                const width = state.transformations.values[config.stateKeys[0]];
                const height = state.transformations.values[config.stateKeys[1]];
                transformChain.push(config.template(width, height));
            } else if (config.type === 'dimensions4') {
                const x = state.transformations.values[config.stateKeys[0]];
                const y = state.transformations.values[config.stateKeys[1]];
                const w = state.transformations.values[config.stateKeys[2]];
                const h = state.transformations.values[config.stateKeys[3]];
                transformChain.push(config.template(x, y, w, h));
            } else {
                transformChain.push(config.template());
            }
        });

        if (transformChain.length > 0) {
            url += `/${transformChain.join('/')}`;
        }
    }

    url += `/${state.transformations.handle}`;

    console.log(`Fetching ${feature} intelligence data from:`, url);

    // Show the intelligence API URL
    if (intelligenceUrlDisplay && intelligenceUrlText) {
        intelligenceUrlText.textContent = url;
        intelligenceUrlDisplay.style.display = 'block';
    }

    intelligencePlaceholder.style.display = 'none';
    intelligenceLoading.style.display = 'flex';
    intelligenceOutput.style.display = 'none';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(`${feature} intelligence response:`, data);
            intelligenceLoading.style.display = 'none';
            intelligenceOutput.textContent = JSON.stringify(data, null, 2);
            intelligenceOutput.style.display = 'block';
        })
        .catch(error => {
            console.error(`${feature} intelligence error:`, error);
            intelligenceLoading.style.display = 'none';
            intelligencePlaceholder.textContent = `Error: ${error.message}`;
            intelligencePlaceholder.style.display = 'block';
        });
}

function hideIntelligencePreview() {
    const intelligenceSection = document.getElementById('intelligence-preview-section');
    const intelligenceTabs = document.getElementById('intelligence-tabs');
    if (intelligenceSection) {
        intelligenceSection.style.display = 'none';
    }
    if (intelligenceTabs) {
        intelligenceTabs.style.display = 'none';
    }
}

export function getTransformationChain() {
    const transformations = [];
    state.transformations.active.forEach(key => {
        const config = TRANSFORMATIONS[key];
        if (!config) return;

        if (config.type === 'range') {
            const value = state.transformations.values[config.stateKey];
            transformations.push(config.template(value));
        } else if (config.type === 'dimensions') {
            const width = state.transformations.values[config.stateKeys[0]];
            const height = state.transformations.values[config.stateKeys[1]];
            transformations.push(config.template(width, height));
        } else {
            transformations.push(config.template());
        }
    });

    return transformations.join('/');
}
