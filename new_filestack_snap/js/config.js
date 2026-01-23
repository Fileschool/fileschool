import { updatePreview } from './preview.js';
import { updateCode } from './codegen.js';

export const state = {
    apiKey: 'APlp4hNNuQAShEv9VSgB0z',
    customCSS: '',
    picker: {
        sources: [
            'local_file_system', 'url', 'webcam', 'facebook', 'instagram', 'googledrive', 'dropbox'
        ],
        accept: [], // Empty = all
        maxFiles: 5,
        maxSize: 10, // MB
        displayMode: 'inline', // overlay, inline, dropPane
        container: '#inline-container'
    },
    transformations: {
        handle: '',
        policy: 'eyJleHBpcnkiOjE3Nzc0ODM4MDAsImNhbGwiOlsicGljayIsInJlYWQiLCJzdGF0Iiwid3JpdGUiLCJ3cml0ZVVybCIsInN0b3JlIiwiY29udmVydCIsInJlbW92ZSIsImV4aWYiLCJydW5Xb3JrZmxvdyJdfQ==',
        signature: 'b81b5830ac77e3705ad482d8d1b216f4543b65960e1913ecefc104788f30d180',
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

    bindInput('container-selector', (val) => {
        state.picker.container = val;
        triggerUpdate();
    });

    // Security Inputs - Global Binding
    bindInput('trans-policy-input', (val) => {
        console.log('Security Policy Input Changed:', val);
        state.transformations.policy = val;
        triggerUpdate();
    });
    bindInput('trans-signature-input', (val) => {
        console.log('Security Signature Input Changed:', val);
        state.transformations.signature = val;
        triggerUpdate();
    });

    bindInput('security-secret', (val) => { state.security.secret = val; }); // Don't auto trigger picker reload on secret change
    bindInput('security-expiry', (val) => { state.security.expiry = val; });

    // Accordion Logic (old style)
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

    // New Transformations Section Collapsible Logic
    document.querySelectorAll('.section-header').forEach(header => {
        // Initialize icon rotation based on initial state
        const content = header.nextElementSibling;
        const icon = header.querySelector('.section-toggle-btn i');
        if (content && icon) {
            if (content.classList.contains('collapsed')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        }

        header.addEventListener('click', (e) => {
            // Prevent toggling if clicking on interactive elements within the header
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') {
                return;
            }

            const sectionName = header.querySelector('.section-toggle-btn')?.dataset.section;
            if (!sectionName) return;

            const content = header.nextElementSibling;
            if (!content) return;

            content.classList.toggle('collapsed');

            const icon = header.querySelector('.section-toggle-btn i');
            if (icon) {
                if (content.classList.contains('collapsed')) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });

    triggerUpdate();
}

function bindInput(id, callback) {
    const el = document.getElementById(id);
    if (!el) return;

    // Bind listener
    el.addEventListener('input', (e) => callback(e.target.value));

    // Read initial value if present
    if (el.value) {
        callback(el.value);
    }
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
