import { updatePreview } from './preview.js';
import { updateCode } from './codegen.js';

export const state = {
    apiKey: '',
    customCSS: '',
    picker: {
        sources: [
            'local_file_system', 'url', 'webcam', 'facebook', 'instagram', 'googledrive', 'dropbox'
        ],
        accept: [], // Empty = all
        maxFiles: 5,
        maxSize: 10, // MB
        displayMode: 'inline', // overlay, inline, dropPane
        container: '#inline-container',
        policy: '', // Optional security policy for picker
        signature: '' // Optional security signature for picker
    },
    transformations: {
        handle: '',
        policy: '',
        signature: '',
        active: [],
        values: {
            rotate: 180,
            blur: 8,
            oilpaint: 4,
            sepia: 80,
            rounded: 100,
            resizeWidth: 400,
            resizeHeight: 400
        }
    },
    intelligence: {
        enabled: false,
        tags: true,
        sfw: false,
        caption: false
    },
    security: {
        secret: '',
        expiry: '',
        permissions: ['pick', 'read', 'store', 'write']
    }
};

const SOURCE_OPTIONS = [
    'local_file_system', 'url', 'imagesearch', 'facebook', 'instagram', 'googledrive', 'dropbox', 'box', 'onedrive', 'webcam', 'audio', 'video'
];

const ACCEPT_OPTIONS = [
    'image/*', 'video/*', 'audio/*', 'application/pdf', '.docx'
];

const PERMISSION_OPTIONS = [
    'pick', 'read', 'stat', 'write', 'store', 'convert', 'remove', 'exif'
];

export function initConfig() {
    // 1. Render Dynamic Lists
    renderCheckboxes('sources-list', SOURCE_OPTIONS, state.picker.sources, (item, checked) => {
        if (checked) {
            if (!state.picker.sources.includes(item)) state.picker.sources.push(item);
        } else {
            state.picker.sources = state.picker.sources.filter(s => s !== item);
        }
        triggerUpdate();
    });

    renderCheckboxes('accept-list', ACCEPT_OPTIONS, state.picker.accept, (item, checked) => {
        if (checked) {
            if (!state.picker.accept.includes(item)) state.picker.accept.push(item);
        } else {
            state.picker.accept = state.picker.accept.filter(s => s !== item);
        }
        triggerUpdate();
    });

    renderCheckboxes('permissions-list', PERMISSION_OPTIONS, state.security.permissions, (item, checked) => {
        if (checked) {
            if (!state.security.permissions.includes(item)) state.security.permissions.push(item);
        } else {
            state.security.permissions = state.security.permissions.filter(p => p !== item);
        }
        // Policy regen handled separately or strictly via code gen
        triggerUpdate();
    });

    // 2. Bind Static Inputs
    bindInput('api-key-input', (val) => { state.apiKey = val; triggerUpdate(); });
    bindInput('constraint-maxfiles', (val) => { state.picker.maxFiles = parseInt(val); triggerUpdate(); });
    bindInput('constraint-maxsize', (val) => { state.picker.maxSize = parseInt(val); triggerUpdate(); });
    bindInput('display-mode-select', (val) => {
        state.picker.displayMode = val;
        const containerInput = document.getElementById('container-selector');
        if (containerInput) {
            containerInput.disabled = (val === 'overlay');
        }
        triggerUpdate();
    });

    bindInput('security-secret', (val) => { state.security.secret = val; }); // Don't auto trigger picker reload on secret change
    bindInput('security-expiry', (val) => { state.security.expiry = val; });

    // Picker security (optional)
    bindInput('picker-policy', (val) => { state.picker.policy = val; triggerUpdate(); });
    bindInput('picker-signature', (val) => { state.picker.signature = val; triggerUpdate(); });

    // Accordion Logic
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            content.classList.toggle('open');
            const icon = header.querySelector('i');
            if (content.classList.contains('open')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });

    triggerUpdate();
}

function bindInput(id, callback) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', (e) => callback(e.target.value));
}

function renderCheckboxes(containerId, options, selected, onChange) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    options.forEach(opt => {
        const label = document.createElement('label');
        label.className = 'toggle-item';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = opt;
        input.checked = selected.includes(opt);
        input.onchange = (e) => onChange(opt, e.target.checked);

        label.appendChild(input);
        label.appendChild(document.createTextNode(opt));
        container.appendChild(label);
    });
}

function triggerUpdate() {
    updateCode(state);
    updatePreview(state);
}
