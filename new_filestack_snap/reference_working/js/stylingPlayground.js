// Styling Playground Module
// Provides advanced visual styling capabilities for the Filestack picker

export class StylingPlayground {
    constructor() {
        this.appliedStyles = {};
        this.currentElement = null;
        this.styleTag = null;
        this.currentPickerView = 'empty'; // 'empty' or 'files'

        // Element categories and selectors
        this.elements = {
            'Header': [
                { id: 'header', label: 'Top Header Bar', selector: '.fsp-header', desc: 'Bar at the very top' },
            ],
            'Sidebar': [
                { id: 'source-list', label: 'Left Sidebar', selector: '.fsp-source-list', desc: 'List of sources (Computer, URL, etc)' },
                { id: 'source-item', label: 'Source Items', selector: '.fsp-source-list__item', desc: 'Computer, URL, Instagram items' },
                { id: 'source-item-active', label: 'Active Source Item', selector: '.fsp-source-list__item--active', desc: 'The selected source' },
            ],
            'Drop Area': [
                { id: 'drop-pane-container', label: 'Drop Pane Container', selector: '.fsp-drop-pane__container', desc: 'Main drop pane wrapper' },
                { id: 'drop-area-container', label: 'Whole Upload Area', selector: '.fsp-drop-area-container', desc: 'Full background area' },
                { id: 'drop-area', label: 'Drop Zone Box', selector: '.fsp-drop-area', desc: 'Dashed box "Drag and drop..."' },
                { id: 'drop-area-title', label: 'Drop Title Text', selector: '.fsp-drop-area__title', desc: '"Drag and drop..." text' },
                { id: 'drop-area-subtitle', label: 'Drop Subtitle', selector: '.fsp-drop-area__subtitle', desc: '"or click to browse" text' },
                { id: 'drop-area-button', label: 'Browse Button', selector: '.fsp-drop-area__button', desc: '"Choose Files" button' },
            ],
            'Buttons': [
                { id: 'button-primary', label: 'Upload Button', selector: '.fsp-button--upload', desc: 'Main action button', needsFiles: true },
                { id: 'button-cancel', label: 'Cancel Button', selector: '.fsp-button--cancel', desc: 'Cancel/back button', needsFiles: true },
            ],
            'File Grid': [
                { id: 'grid', label: 'File Grid', selector: '.fsp-grid', desc: 'Grid of files/folders' },
                { id: 'grid-cell', label: 'File/Folder Items', selector: '.fsp-grid__cell', desc: 'Individual file boxes' },
                { id: 'grid-cell-selected', label: 'Selected Files', selector: '.fsp-grid__cell--selected', desc: 'Checked files' },
            ],
            'Footer': [
                { id: 'footer', label: 'Bottom Footer', selector: '.fsp-footer', desc: 'Bar at the bottom', needsFiles: true },
                { id: 'footer-badge', label: 'File Count Badge', selector: '.fsp-badge', desc: 'Number badge on upload button', needsFiles: true },
            ],
            'Summary View': [
                { id: 'content', label: 'Main Content Area', selector: '.fsp-content', desc: 'Main content container for file list', needsFiles: true },
                { id: 'summary-title', label: 'Selected Files Title', selector: '.fsp-summary .filestack-text-center', desc: '"Selected Files" heading text', needsFiles: true },
                { id: 'summary-body', label: 'Summary Container', selector: '.fsp-summary__body', desc: 'Container for file list', needsFiles: true },
                { id: 'summary-item', label: 'File Item Row', selector: '.fsp-summary__item', desc: 'Each file in the list', needsFiles: true },
                { id: 'summary-item-name', label: 'File Name', selector: '.fsp-summary__item-name', desc: 'File name text', needsFiles: true },
                { id: 'summary-thumbnail', label: 'File Thumbnail', selector: '.fsp-summary__thumbnail-container', desc: 'File icon container', needsFiles: true },
                { id: 'summary-size', label: 'File Size', selector: '.fsp-summary__size', desc: 'File size text', needsFiles: true },
                { id: 'summary-remove', label: 'Delete Button', selector: '.fsp-summary__action--remove', desc: 'Remove file button', needsFiles: true },
                { id: 'summary-actions', label: 'Actions Container', selector: '.fsp-summary__actions-container', desc: 'File action buttons area', needsFiles: true },
            ],
        };

        // Style properties for the visual editor
        this.styleProperties = {
            colors: [
                { id: 'background', label: 'Background', type: 'color', cssProperty: 'background-color' },
                { id: 'text-color', label: 'Text Color', type: 'color', cssProperty: 'color' },
                { id: 'border-color', label: 'Border Color', type: 'color', cssProperty: 'border-color' },
            ],
            layout: [
                { id: 'padding', label: 'Padding', type: 'text', cssProperty: 'padding', unit: 'px', placeholder: '10px' },
                { id: 'margin', label: 'Margin', type: 'text', cssProperty: 'margin', unit: 'px', placeholder: '0' },
                { id: 'border-radius', label: 'Border Radius', type: 'text', cssProperty: 'border-radius', unit: 'px', placeholder: '8px' },
            ],
            border: [
                { id: 'border-width', label: 'Border Width', type: 'text', cssProperty: 'border-width', unit: 'px', placeholder: '1px' },
                { id: 'border-style', label: 'Border Style', type: 'select', cssProperty: 'border-style', options: ['none', 'solid', 'dashed', 'dotted'] },
            ],
            typography: [
                { id: 'font-size', label: 'Font Size', type: 'text', cssProperty: 'font-size', unit: 'px', placeholder: '14px' },
                { id: 'font-weight', label: 'Font Weight', type: 'select', cssProperty: 'font-weight', options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'] },
                { id: 'text-align', label: 'Text Align', type: 'select', cssProperty: 'text-align', options: ['left', 'center', 'right'] },
            ],
            effects: [
                { id: 'opacity', label: 'Opacity', type: 'range', cssProperty: 'opacity', min: 0, max: 1, step: 0.1 },
                { id: 'box-shadow', label: 'Box Shadow', type: 'text', cssProperty: 'box-shadow', placeholder: '0 4px 6px rgba(0,0,0,0.1)' },
            ]
        };

        // Preset themes
        this.presets = {
            dark: { name: 'Dark Theme', desc: 'Modern dark color scheme', color: '#1e293b' },
            minimal: { name: 'Minimalist', desc: 'Clean and simple design', color: '#f8fafc' },
            vibrant: { name: 'Vibrant', desc: 'Colorful amber/orange theme', color: '#fef3c7' },
            ocean: { name: 'Ocean', desc: 'Calm blue water vibes', color: '#e0f2fe' },
            forest: { name: 'Forest', desc: 'Fresh green nature theme', color: '#dcfce7' },
            sunset: { name: 'Sunset', desc: 'Warm sunset gradient', color: '#fecaca' },
            neon: { name: 'Neon', desc: 'Glowing neon dark theme', color: '#18181b' },
            nature: { name: 'Nature', desc: 'Bright natural greens', color: '#f0fdf4' },
            midnight: { name: 'Midnight', desc: 'Deep midnight blue', color: '#0c1445' },
            candy: { name: 'Candy', desc: 'Sweet candy pink gradients', color: '#fae8ff' },
            autumn: { name: 'Autumn', desc: 'Warm autumn colors', color: '#fef2f2' },
            arctic: { name: 'Arctic', desc: 'Cool arctic ice theme', color: '#f0f9ff' },
            retro: { name: 'Retro', desc: 'Vintage retro style', color: '#fffbeb' },
        };

        this.presetStyles = this.getPresetStyles();
    }

    init() {
        console.log('StylingPlayground: Initializing...');

        // Create dynamic style tag
        this.styleTag = document.createElement('style');
        this.styleTag.id = 'picker-dynamic-styles';
        document.head.appendChild(this.styleTag);

        // Initialize UI
        this.initTabs();
        this.renderElementList();
        this.renderPresets();
        this.initEventListeners();
        this.addViewToggle();

        console.log('StylingPlayground: Initialization complete');
    }

    initTabs() {
        const tabButtons = document.querySelectorAll('.styling-tab-btn');
        console.log('initTabs: Found', tabButtons.length, 'tab buttons');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.stylingTab;
                console.log('Tab clicked:', tab);
                this.switchTab(tab);
            });
        });
    }

    switchTab(tab) {
        console.log('switchTab called with:', tab);

        // Update button states
        document.querySelectorAll('.styling-tab-btn').forEach(btn => {
            if (btn.dataset.stylingTab === tab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update content visibility
        document.querySelectorAll('.styling-tab-content').forEach(content => {
            content.classList.remove('active');
            content.classList.add('hidden');
        });

        const activeContent = document.getElementById(`${tab}-styling-tab`);
        console.log('Active content element:', activeContent);

        if (activeContent) {
            activeContent.classList.add('active');
            activeContent.classList.remove('hidden');
        } else {
            console.error('Could not find content for tab:', tab);
        }

        // Update CSS output if code tab
        if (tab === 'code') {
            this.updateCSSOutput();
        }
    }

    initEventListeners() {
        // Back button
        const backBtn = document.getElementById('styling-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.backToElementList());
        }

        // Copy CSS button
        const copyBtn = document.getElementById('copy-generated-css-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyCSS());
        }

        // Copy CSS from drawer button
        const copyCssDrawerBtn = document.getElementById('copy-css-drawer-btn');
        if (copyCssDrawerBtn) {
            copyCssDrawerBtn.addEventListener('click', () => this.copyCSS());
        }

        // Reset all styles button
        const resetBtn = document.getElementById('reset-all-styles-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetAllStyles());
        }
    }

    renderElementList() {
        const container = document.getElementById('styling-element-list');
        const navContainer = document.getElementById('styling-category-nav');

        console.log('renderElementList: container =', container);
        console.log('renderElementList: navContainer =', navContainer);

        if (!container || !navContainer) {
            console.error('StylingPlayground: Could not find element list or nav container!');
            return;
        }

        container.innerHTML = '';
        navContainer.innerHTML = '';

        // Render category navigation
        Object.keys(this.elements).forEach(category => {
            const chip = document.createElement('div');
            chip.className = 'category-nav-chip';
            chip.textContent = category;
            chip.dataset.category = category;
            chip.addEventListener('click', () => this.scrollToCategory(category));
            navContainer.appendChild(chip);
        });

        // Render element list
        Object.entries(this.elements).forEach(([category, items]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'element-category';
            categoryDiv.id = `styling-category-${category.replace(/\s+/g, '-').toLowerCase()}`;

            const categoryLabel = document.createElement('div');
            categoryLabel.className = 'element-category-label';
            categoryLabel.textContent = category;
            categoryDiv.appendChild(categoryLabel);

            items.forEach(element => {
                const item = document.createElement('div');
                item.className = 'element-item';
                item.dataset.elementId = element.id;

                const hasStyles = this.appliedStyles[element.id] && Object.keys(this.appliedStyles[element.id]).length > 0;

                item.innerHTML = `
                    <div class="element-item-header">
                        <span class="element-item-label">${element.label}</span>
                        ${hasStyles ? '<span class="element-item-badge">Styled</span>' : ''}
                    </div>
                    <div class="element-item-desc">${element.desc || ''}</div>
                `;

                item.addEventListener('click', () => this.selectElement(element.id));
                categoryDiv.appendChild(item);
            });

            container.appendChild(categoryDiv);
        });
    }

    scrollToCategory(category) {
        const categoryId = `styling-category-${category.replace(/\s+/g, '-').toLowerCase()}`;
        const categoryElement = document.getElementById(categoryId);

        if (categoryElement) {
            // Update active state
            document.querySelectorAll('.category-nav-chip').forEach(chip => {
                if (chip.dataset.category === category) {
                    chip.classList.add('active');
                } else {
                    chip.classList.remove('active');
                }
            });

            // Scroll to category
            categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    selectElement(elementId) {
        this.currentElement = elementId;

        // Find which category this element belongs to and check if it needs files
        let elementCategory = null;
        let elementNeedsFiles = false;
        for (const [category, items] of Object.entries(this.elements)) {
            const foundItem = items.find(item => item.id === elementId);
            if (foundItem) {
                elementCategory = category;
                elementNeedsFiles = foundItem.needsFiles || false;
                break;
            }
        }

        // Auto-switch to Files View if the element needs files but we're in empty view
        if (elementNeedsFiles && this.currentPickerView === 'empty') {
            this.switchPickerView('files');

            // Update view toggle buttons if they exist
            const viewToggleButtons = document.querySelectorAll('.view-toggle-btn');
            viewToggleButtons.forEach(btn => {
                if (btn.dataset.view === 'files') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // Auto-switch to Empty/Main View if the element doesn't need files but we're in files view
        if (!elementNeedsFiles && this.currentPickerView === 'files') {
            this.switchPickerView('empty');

            // Update view toggle buttons if they exist
            const viewToggleButtons = document.querySelectorAll('.view-toggle-btn');
            viewToggleButtons.forEach(btn => {
                if (btn.dataset.view === 'empty') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // Auto-scroll to the correct category if found
        if (elementCategory) {
            this.scrollToCategory(elementCategory);
        }

        // Update UI states
        document.querySelectorAll('.element-item').forEach(el => el.classList.remove('active'));
        const clickedElement = document.querySelector(`[data-element-id="${elementId}"]`);
        clickedElement?.classList.add('active');

        // Show modal backdrop
        const backdrop = document.getElementById('styling-modal-backdrop');
        if (backdrop) {
            backdrop.classList.add('visible');
            backdrop.onclick = () => this.closeStyleEditor();
        }

        // Show floating modal near the clicked element
        const modal = document.getElementById('styling-style-editor-modal');
        if (modal && clickedElement) {
            modal.classList.remove('hidden');

            // Position modal near clicked element
            const rect = clickedElement.getBoundingClientRect();
            const modalWidth = 320;
            const modalMaxHeight = 500;

            // Try to position to the right of the element first
            let left = rect.right + 10;
            let top = rect.top;

            // If modal would go off screen right, position to the left
            if (left + modalWidth > window.innerWidth) {
                left = rect.left - modalWidth - 10;
            }

            // If still off screen, center it
            if (left < 0) {
                left = Math.max(10, (window.innerWidth - modalWidth) / 2);
            }

            // Ensure modal doesn't go off bottom
            if (top + modalMaxHeight > window.innerHeight) {
                top = Math.max(10, window.innerHeight - modalMaxHeight - 10);
            }

            modal.style.left = `${left}px`;
            modal.style.top = `${top}px`;
        }

        // Highlight element in picker
        this.highlightElementInPicker(elementId);

        // Render style properties
        this.renderStyleProperties();
    }

    closeStyleEditor() {
        this.currentElement = null;

        // Hide modal and backdrop
        document.getElementById('styling-style-editor-modal')?.classList.add('hidden');
        document.getElementById('styling-modal-backdrop')?.classList.remove('visible');

        // Remove highlights
        this.removeHighlights();

        // Clear active state
        document.querySelectorAll('.element-item').forEach(el => el.classList.remove('active'));
    }

    backToElementList() {
        // Just close the modal
        this.closeStyleEditor();
    }

    highlightElementInPicker(elementId) {
        // Remove previous highlights
        this.removeHighlights();

        // Find element info
        let elementInfo = null;
        Object.values(this.elements).forEach(category => {
            const found = category.find(el => el.id === elementId);
            if (found) elementInfo = found;
        });

        if (!elementInfo) return;

        // Add highlight to matching elements
        setTimeout(() => {
            const pickerElements = document.querySelectorAll(`.fsp-picker ${elementInfo.selector}`);
            pickerElements.forEach(el => {
                el.classList.add('picker-highlight');
            });
        }, 100);
    }

    removeHighlights() {
        document.querySelectorAll('.picker-highlight').forEach(el => {
            el.classList.remove('picker-highlight');
        });
    }

    renderStyleProperties() {
        const container = document.getElementById('styling-style-properties');
        if (!container) return;

        container.innerHTML = '';

        // Get element info
        let elementLabel = '';
        let elementDesc = '';
        Object.values(this.elements).forEach(category => {
            const found = category.find(el => el.id === this.currentElement);
            if (found) {
                elementLabel = found.label;
                elementDesc = found.desc;
            }
        });

        // Add header with close button
        const headerDiv = document.createElement('div');
        headerDiv.className = 'style-property-header';
        headerDiv.innerHTML = `
            <div class="style-property-header-content">
                <h3>${elementLabel}</h3>
                <p>${elementDesc}</p>
                <div class="style-instructions">
                    <i class="fa-solid fa-lightbulb"></i>
                    <span>Change values below. Styles apply instantly! Click outside to close.</span>
                </div>
            </div>
            <button class="style-property-header-close" onclick="window.stylingPlayground?.closeStyleEditor()">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        container.appendChild(headerDiv);

        const currentStyles = this.appliedStyles[this.currentElement] || {};

        // Render property groups
        Object.entries(this.styleProperties).forEach(([group, properties]) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'style-property-group';

            const groupLabel = document.createElement('div');
            groupLabel.className = 'style-property-group-label';
            groupLabel.textContent = group.charAt(0).toUpperCase() + group.slice(1);
            groupDiv.appendChild(groupLabel);

            properties.forEach(prop => {
                const row = document.createElement('div');
                row.className = 'style-property-row';

                const label = document.createElement('div');
                label.className = 'style-property-label';
                label.textContent = prop.label;

                const inputContainer = document.createElement('div');
                inputContainer.className = 'style-property-input';

                let input;
                if (prop.type === 'color') {
                    input = document.createElement('input');
                    input.type = 'color';
                    input.value = currentStyles[prop.cssProperty] || '#ffffff';
                } else if (prop.type === 'select') {
                    input = document.createElement('select');
                    prop.options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt;
                        option.textContent = opt;
                        input.appendChild(option);
                    });
                    input.value = currentStyles[prop.cssProperty] || prop.options[0];
                } else if (prop.type === 'range') {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'range-wrapper';

                    input = document.createElement('input');
                    input.type = 'range';
                    input.min = prop.min;
                    input.max = prop.max;
                    input.step = prop.step;
                    input.value = currentStyles[prop.cssProperty] || prop.max;

                    const valueDisplay = document.createElement('span');
                    valueDisplay.className = 'range-value';
                    valueDisplay.textContent = input.value;

                    input.addEventListener('input', () => {
                        valueDisplay.textContent = input.value;
                    });

                    wrapper.appendChild(input);
                    wrapper.appendChild(valueDisplay);
                    inputContainer.appendChild(wrapper);

                    row.appendChild(label);
                    row.appendChild(inputContainer);
                    groupDiv.appendChild(row);

                    input.addEventListener('change', () => this.applyStyle(prop.cssProperty, input.value));
                    return;
                } else {
                    input = document.createElement('input');
                    input.type = 'text';
                    input.value = currentStyles[prop.cssProperty] || '';
                    input.placeholder = prop.placeholder || '';
                }

                input.addEventListener('change', () => {
                    this.applyStyle(prop.cssProperty, input.value);
                });

                inputContainer.appendChild(input);
                row.appendChild(label);
                row.appendChild(inputContainer);
                groupDiv.appendChild(row);
            });

            container.appendChild(groupDiv);
        });

        // Add footer with action buttons
        const footerDiv = document.createElement('div');
        footerDiv.className = 'style-property-footer';
        footerDiv.innerHTML = `
            <button class="btn-style-reset" id="reset-element-styles">
                <i class="fa-solid fa-rotate-left"></i> Reset Element
            </button>
            <button class="btn-style-save" id="save-element-styles">
                <i class="fa-solid fa-check"></i> Save & Close
            </button>
        `;
        container.appendChild(footerDiv);

        // Add event listeners for footer buttons
        const resetElementBtn = document.getElementById('reset-element-styles');
        const saveElementBtn = document.getElementById('save-element-styles');

        if (resetElementBtn) {
            resetElementBtn.addEventListener('click', () => this.resetElementStyles());
        }

        if (saveElementBtn) {
            saveElementBtn.addEventListener('click', () => {
                this.showToast('✓ Styles saved!', 'success');
                this.closeStyleEditor();
            });
        }
    }

    resetElementStyles() {
        if (!this.currentElement) return;

        if (confirm('Reset all styles for this element?')) {
            delete this.appliedStyles[this.currentElement];
            this.updateStyles();
            this.renderStyleProperties();
            this.showToast('Element styles reset', 'info');
        }
    }

    applyStyle(cssProperty, value) {
        if (!this.currentElement) return;

        // Initialize styles object for element if needed
        if (!this.appliedStyles[this.currentElement]) {
            this.appliedStyles[this.currentElement] = {};
        }

        // Update styles
        if (value) {
            this.appliedStyles[this.currentElement][cssProperty] = value;
        } else {
            delete this.appliedStyles[this.currentElement][cssProperty];
        }

        // Update DOM
        this.updateStyles();
    }

    updateStyles() {
        let css = '';

        // Get element selector
        let selector = '';
        Object.values(this.elements).forEach(category => {
            const found = category.find(el => el.id === this.currentElement);
            if (found) selector = found.selector;
        });

        if (selector && this.appliedStyles[this.currentElement]) {
            const styles = this.appliedStyles[this.currentElement];
            const styleString = Object.entries(styles)
                .map(([prop, val]) => `  ${prop}: ${val};`)
                .join('\n');

            if (styleString) {
                css += `.fsp-picker ${selector} {\n${styleString}\n}\n\n`;
            }
        }

        // Apply all styles
        let allCSS = '';
        Object.entries(this.appliedStyles).forEach(([elementId, styles]) => {
            let elementSelector = '';
            Object.values(this.elements).forEach(category => {
                const found = category.find(el => el.id === elementId);
                if (found) elementSelector = found.selector;
            });

            if (elementSelector && Object.keys(styles).length > 0) {
                const styleString = Object.entries(styles)
                    .map(([prop, val]) => `  ${prop}: ${val};`)
                    .join('\n');
                allCSS += `.fsp-picker ${elementSelector} {\n${styleString}\n}\n\n`;
            }
        });

        if (this.styleTag) {
            this.styleTag.textContent = allCSS;
        }

        // Refresh element list to update badges
        this.renderElementList();
    }

    renderPresets() {
        const container = document.getElementById('styling-presets-grid');

        console.log('renderPresets: container =', container);

        if (!container) {
            console.error('StylingPlayground: Could not find presets grid container!');
            return;
        }

        container.innerHTML = '';

        Object.entries(this.presets).forEach(([key, preset]) => {
            const item = document.createElement('div');
            item.className = 'preset-item';
            item.innerHTML = `
                <div class="preset-item-name">
                    <div class="preset-item-color-badge" style="background-color: ${preset.color}"></div>
                    <span>${preset.name}</span>
                </div>
                <div class="preset-item-desc">${preset.desc}</div>
            `;
            item.addEventListener('click', () => this.applyPreset(key));
            container.appendChild(item);
        });
    }

    applyPreset(presetName) {
        const presetData = this.presetStyles[presetName];
        if (!presetData) return;

        // Clear current styles
        this.appliedStyles = {};

        // Apply preset styles
        this.appliedStyles = JSON.parse(JSON.stringify(presetData));

        // Update DOM
        this.updateStyles();

        // Show toast notification
        this.showToast(`✨ Applied "${this.presets[presetName].name}" preset!`, 'success');
    }

    resetAllStyles() {
        if (confirm('Are you sure you want to reset all styles?')) {
            this.appliedStyles = {};
            this.updateStyles();
            this.backToElementList();
            this.showToast('🔄 All styles have been reset', 'info');
        }
    }

    showToast(message, type = 'success') {
        // Remove any existing toasts
        const existingToast = document.querySelector('.styling-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast
        const toast = document.createElement('div');
        toast.className = `styling-toast ${type}`;
        toast.innerHTML = `
            <span class="styling-toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        // Remove after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    updateCSSOutput() {
        const container = document.getElementById('styling-css-output');
        if (!container) return;

        let css = '';
        Object.entries(this.appliedStyles).forEach(([elementId, styles]) => {
            let elementSelector = '';
            Object.values(this.elements).forEach(category => {
                const found = category.find(el => el.id === elementId);
                if (found) elementSelector = found.selector;
            });

            if (elementSelector && Object.keys(styles).length > 0) {
                const styleString = Object.entries(styles)
                    .map(([prop, val]) => `  ${prop}: ${val};`)
                    .join('\n');
                css += `.fsp-picker ${elementSelector} {\n${styleString}\n}\n\n`;
            }
        });

        if (css) {
            container.innerHTML = `<pre><code>${this.escapeHtml(css)}</code></pre>`;
        } else {
            container.innerHTML = '<div class="css-code-empty">No styles applied yet</div>';
        }
    }

    updateCSSDrawer() {
        const container = document.getElementById('css-drawer-output');
        if (!container) return;

        let css = '';
        Object.entries(this.appliedStyles).forEach(([elementId, styles]) => {
            let elementSelector = '';
            Object.values(this.elements).forEach(category => {
                const found = category.find(el => el.id === elementId);
                if (found) elementSelector = found.selector;
            });

            if (elementSelector && Object.keys(styles).length > 0) {
                const styleString = Object.entries(styles)
                    .map(([prop, val]) => `  ${prop}: ${val};`)
                    .join('\n');
                css += `.fsp-picker ${elementSelector} {\n${styleString}\n}\n\n`;
            }
        });

        if (css) {
            container.innerHTML = `<pre><code>${this.escapeHtml(css)}</code></pre>`;
        } else {
            container.innerHTML = '<div class="css-code-empty">No styles applied yet</div>';
        }
    }

    copyCSS() {
        let css = '';
        Object.entries(this.appliedStyles).forEach(([elementId, styles]) => {
            let elementSelector = '';
            Object.values(this.elements).forEach(category => {
                const found = category.find(el => el.id === elementId);
                if (found) elementSelector = found.selector;
            });

            if (elementSelector && Object.keys(styles).length > 0) {
                const styleString = Object.entries(styles)
                    .map(([prop, val]) => `  ${prop}: ${val};`)
                    .join('\n');
                css += `.fsp-picker ${elementSelector} {\n${styleString}\n}\n\n`;
            }
        });

        if (css) {
            navigator.clipboard.writeText(css).then(() => {
                this.showToast('📋 CSS copied to clipboard!', 'success');
            });
        } else {
            this.showToast('⚠️ No styles to copy!', 'info');
        }
    }

    addViewToggle() {
        // Add view toggle controls to Visual Editor tab
        const visualTab = document.getElementById('visual-styling-tab');
        if (!visualTab) return;

        // Find the instructions box
        const instructionsBox = document.getElementById('styling-instructions-box');
        if (!instructionsBox) return;

        // Create view toggle controls
        const viewToggle = document.createElement('div');
        viewToggle.className = 'view-toggle-controls';
        viewToggle.innerHTML = `
            <h4>Picker View Mode:</h4>
            <div class="view-toggle-buttons">
                <button class="view-toggle-btn active" data-view="empty">
                    <i class="fa-solid fa-upload"></i> Drop Zone View
                </button>
                <button class="view-toggle-btn" data-view="files">
                    <i class="fa-solid fa-folder"></i> Files View
                </button>
            </div>
        `;

        // Insert after instructions box
        instructionsBox.after(viewToggle);

        // Add event listeners
        viewToggle.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchPickerView(view);

                // Update button states
                viewToggle.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchPickerView(view) {
        this.currentPickerView = view;

        if (view === 'files') {
            // Load dummy files to show the files/folder view
            this.loadDummyFiles();
        } else {
            // Clear files and return to drop zone view
            this.clearFilesAndReturnToDropZone();
        }
    }

    clearFilesAndReturnToDropZone() {
        // Try to clear the files by finding and clicking the "Deselect All" button
        setTimeout(() => {
            const deselectBtn = document.querySelector('.fsp-picker .fsp-button--deselect-all, .fsp-picker button[class*="deselect"]');

            if (deselectBtn) {
                deselectBtn.click();
                this.showToast('Returned to Drop Zone view', 'info');
            } else {
                // Alternative: try to find and click individual remove buttons
                const removeButtons = document.querySelectorAll('.fsp-picker .fsp-summary__action--remove');
                if (removeButtons.length > 0) {
                    removeButtons.forEach(btn => btn.click());
                    this.showToast('Files cleared', 'info');
                } else {
                    // If we can't find controls, show a message
                    this.showToast('💡 Click "Deselect All" to return to Drop Zone view', 'info');
                }
            }
        }, 100);
    }

    loadDummyFiles() {
        // Try to programmatically add dummy files to the picker
        setTimeout(() => {
            try {
                // Look for the file input in the picker
                const fileInput = document.querySelector('.fsp-picker input[type="file"]');

                if (fileInput) {
                    // Create dummy files
                    const dummyFiles = [
                        new File([''], 'document.pdf', { type: 'application/pdf' }),
                        new File([''], 'image.jpg', { type: 'image/jpeg' }),
                        new File([''], 'spreadsheet.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
                    ];

                    // Create a new DataTransfer object
                    const dataTransfer = new DataTransfer();
                    dummyFiles.forEach(file => dataTransfer.items.add(file));

                    // Set the files
                    fileInput.files = dataTransfer.files;

                    // Trigger change event
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);

                    this.showToast('📁 Dummy files loaded!', 'success');
                } else {
                    this.showToast('⚠️ Could not find file input. Try manually uploading files.', 'info');
                }
            } catch (e) {
                console.error('Error loading dummy files:', e);
                this.showToast('⚠️ Please manually upload files to see Files View', 'info');
            }
        }, 100);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getPresetStyles() {
        // Full preset theme definitions
        return {
            dark: {
                'modal': { 'background-color': '#1e293b', 'color': '#e2e8f0' },
                'header': { 'background-color': '#0f172a', 'color': '#e2e8f0', 'border-bottom': '1px solid #334155' },
                'source-list': { 'background-color': '#0f172a', 'border-right': '1px solid #334155' },
                'source-item': { 'color': '#94a3b8' },
                'source-item-active': { 'background-color': '#3b82f6', 'color': '#ffffff' },
                'drop-area-container': { 'background-color': '#1e293b' },
                'drop-area': { 'background-color': '#334155', 'border': '2px dashed #64748b', 'border-radius': '8px' },
                'button-primary': { 'background-color': '#3b82f6', 'color': '#ffffff', 'border-radius': '6px' },
                'button-cancel': { 'background-color': '#475569', 'color': '#e2e8f0', 'border-radius': '6px' },
                'footer': { 'background-color': '#0f172a', 'border-top': '1px solid #334155' },
                'content': { 'background-color': '#1e293b' },
                'summary-body': { 'background-color': '#1e293b' },
                'summary-item': { 'background-color': '#334155', 'color': '#e2e8f0', 'border-radius': '6px', 'padding': '12px' },
                'summary-item-name': { 'color': '#e2e8f0' },
                'summary-size': { 'color': '#94a3b8' },
                'summary-remove': { 'color': '#ef4444' },
            },
            minimal: {
                'modal': { 'background-color': '#ffffff', 'border-radius': '0px' },
                'header': { 'background-color': '#ffffff', 'border-bottom': '1px solid #e5e7eb' },
                'source-list': { 'background-color': '#fafafa', 'border-right': '1px solid #e5e7eb' },
                'source-item-active': { 'background-color': '#000000', 'color': '#ffffff' },
                'drop-area-container': { 'background-color': '#ffffff' },
                'drop-area': { 'border': '1px solid #d1d5db', 'border-radius': '0px', 'background-color': '#f9fafb' },
                'button-primary': { 'background-color': '#000000', 'color': '#ffffff', 'border-radius': '0px' },
                'button-cancel': { 'background-color': '#ffffff', 'color': '#000000', 'border': '1px solid #000000', 'border-radius': '0px' },
                'content': { 'background-color': '#ffffff' },
                'summary-body': { 'background-color': '#ffffff' },
                'summary-item': { 'background-color': '#fafafa', 'color': '#000000', 'border': '1px solid #e5e7eb', 'border-radius': '0px', 'padding': '12px' },
                'summary-item-name': { 'color': '#000000' },
                'summary-size': { 'color': '#6b7280' },
                'summary-remove': { 'color': '#000000' },
            },
            vibrant: {
                'modal': { 'background-color': '#fef3c7', 'color': '#78350f' },
                'header': { 'background-color': '#f59e0b', 'color': '#ffffff' },
                'source-list': { 'background-color': '#fef3c7' },
                'source-item-active': { 'background-color': '#f59e0b', 'color': '#ffffff' },
                'drop-area-container': { 'background-color': '#fef3c7' },
                'drop-area': { 'background-color': '#fef3c7', 'border': '2px dashed #f59e0b', 'border-radius': '12px' },
                'button-primary': { 'background-color': '#f59e0b', 'color': '#ffffff', 'border-radius': '20px' },
                'button-cancel': { 'background-color': '#fef3c7', 'color': '#78350f', 'border': '2px solid #f59e0b', 'border-radius': '20px' },
                'content': { 'background-color': '#fef3c7' },
                'summary-body': { 'background-color': '#fef3c7' },
                'summary-item': { 'background-color': '#fed7aa', 'color': '#78350f', 'border-radius': '12px', 'padding': '12px' },
                'summary-item-name': { 'color': '#78350f', 'font-weight': '600' },
                'summary-size': { 'color': '#92400e' },
                'summary-remove': { 'color': '#dc2626' },
            },
            ocean: {
                'modal': { 'background-color': '#e0f2fe', 'color': '#164e63' },
                'header': { 'background-color': '#0ea5e9', 'color': '#ffffff' },
                'source-list': { 'background-color': '#bae6fd', 'border-right': '1px solid #7dd3fc' },
                'source-item': { 'color': '#0c4a6e' },
                'source-item-active': { 'background-color': '#0284c7', 'color': '#ffffff' },
                'drop-area-container': { 'background-color': '#e0f2fe' },
                'drop-area': { 'background-color': '#bae6fd', 'border': '2px dashed #0ea5e9', 'border-radius': '10px' },
                'button-primary': { 'background-color': '#0ea5e9', 'color': '#ffffff', 'border-radius': '8px' },
                'button-cancel': { 'background-color': '#e0f2fe', 'color': '#0c4a6e', 'border': '2px solid #0ea5e9', 'border-radius': '8px' },
                'footer': { 'background-color': '#bae6fd', 'border-top': '1px solid #7dd3fc' },
                'content': { 'background-color': '#e0f2fe' },
                'summary-body': { 'background-color': '#e0f2fe' },
                'summary-item': { 'background-color': '#bae6fd', 'color': '#164e63', 'border-radius': '10px', 'padding': '12px' },
                'summary-item-name': { 'color': '#0c4a6e', 'font-weight': '500' },
                'summary-size': { 'color': '#0369a1' },
                'summary-remove': { 'color': '#0ea5e9' },
            },
            forest: {
                'modal': { 'background-color': '#dcfce7', 'color': '#14532d' },
                'header': { 'background-color': '#22c55e', 'color': '#ffffff' },
                'source-list': { 'background-color': '#bbf7d0', 'border-right': '1px solid #86efac' },
                'source-item': { 'color': '#166534' },
                'source-item-active': { 'background-color': '#16a34a', 'color': '#ffffff' },
                'drop-area-container': { 'background-color': '#dcfce7' },
                'drop-area': { 'background-color': '#bbf7d0', 'border': '2px dashed #22c55e', 'border-radius': '12px' },
                'button-primary': { 'background-color': '#22c55e', 'color': '#ffffff', 'border-radius': '8px' },
                'button-cancel': { 'background-color': '#dcfce7', 'color': '#166534', 'border': '2px solid #22c55e', 'border-radius': '8px' },
                'footer': { 'background-color': '#bbf7d0', 'border-top': '1px solid #86efac' },
                'content': { 'background-color': '#dcfce7' },
                'summary-body': { 'background-color': '#dcfce7' },
                'summary-item': { 'background-color': '#bbf7d0', 'color': '#14532d', 'border-radius': '12px', 'padding': '12px' },
                'summary-item-name': { 'color': '#166534', 'font-weight': '600' },
                'summary-size': { 'color': '#15803d' },
                'summary-remove': { 'color': '#dc2626' },
            },
            sunset: {
                'modal': { 'background': 'linear-gradient(135deg, #fecaca 0%, #fde68a 50%, #fbcfe8 100%)', 'color': '#7c2d12' },
                'header': { 'background-color': '#f97316', 'color': '#ffffff' },
                'source-list': { 'background': 'rgba(254, 202, 202, 0.7)' },
                'source-item': { 'color': '#7c2d12' },
                'source-item-active': { 'background-color': '#ea580c', 'color': '#ffffff' },
                'drop-area-container': { 'background': 'rgba(254, 202, 202, 0.5)' },
                'drop-area': { 'background': 'rgba(254, 202, 202, 0.8)', 'border': '2px dashed #f97316', 'border-radius': '15px' },
                'button-primary': { 'background': 'linear-gradient(90deg, #f97316, #ef4444)', 'color': '#ffffff', 'border-radius': '25px' },
                'button-cancel': { 'background': 'transparent', 'color': '#7c2d12', 'border': '2px solid #f97316', 'border-radius': '25px' },
                'footer': { 'background': 'rgba(254, 202, 202, 0.7)', 'border-top': '1px solid #f97316' },
                'content': { 'background': 'rgba(254, 202, 202, 0.5)' },
                'summary-body': { 'background': 'rgba(254, 202, 202, 0.5)' },
                'summary-item': { 'background': 'rgba(254, 202, 202, 0.8)', 'color': '#7c2d12', 'border-radius': '15px', 'padding': '12px' },
                'summary-item-name': { 'color': '#7c2d12', 'font-weight': '600' },
                'summary-size': { 'color': '#9a3412' },
                'summary-remove': { 'color': '#ef4444' },
            },
            neon: {
                'modal': { 'background-color': '#18181b', 'color': '#fafafa' },
                'header': { 'background-color': '#09090b', 'color': '#a78bfa', 'border-bottom': '2px solid #a78bfa' },
                'source-list': { 'background-color': '#27272a', 'border-right': '2px solid #6366f1' },
                'source-item': { 'color': '#d4d4d8' },
                'source-item-active': { 'background-color': '#6366f1', 'color': '#ffffff', 'box-shadow': '0 0 20px rgba(99, 102, 241, 0.5)' },
                'drop-area-container': { 'background-color': '#18181b' },
                'drop-area': { 'background-color': '#27272a', 'border': '2px solid #a78bfa', 'border-radius': '8px', 'box-shadow': '0 0 30px rgba(167, 139, 250, 0.3)' },
                'button-primary': { 'background-color': '#a78bfa', 'color': '#18181b', 'border-radius': '6px', 'box-shadow': '0 0 15px rgba(167, 139, 250, 0.5)' },
                'button-cancel': { 'background-color': '#27272a', 'color': '#a78bfa', 'border': '2px solid #a78bfa', 'border-radius': '6px' },
                'footer': { 'background-color': '#09090b', 'border-top': '2px solid #6366f1' },
                'content': { 'background-color': '#18181b' },
                'summary-body': { 'background-color': '#18181b' },
                'summary-item': { 'background-color': '#27272a', 'color': '#fafafa', 'border': '2px solid #a78bfa', 'border-radius': '8px', 'padding': '12px' },
                'summary-item-name': { 'color': '#a78bfa', 'font-weight': '600' },
                'summary-size': { 'color': '#d4d4d8' },
                'summary-remove': { 'color': '#ef4444', 'box-shadow': '0 0 10px rgba(239, 68, 68, 0.5)' },
            },
            nature: {
                'modal': { 'background-color': '#f0fdf4', 'color': '#14532d' },
                'header': { 'background': 'linear-gradient(135deg, #84cc16, #059669)', 'color': '#ffffff' },
                'source-list': { 'background-color': '#ecfccb', 'border-right': '1px solid #bef264' },
                'source-item': { 'color': '#365314' },
                'source-item-active': { 'background-color': '#65a30d', 'color': '#ffffff' },
                'drop-area-container': { 'background-color': '#f0fdf4' },
                'drop-area': { 'background-color': '#dcfce7', 'border': '2px dashed #16a34a', 'border-radius': '20px' },
                'button-primary': { 'background': 'linear-gradient(90deg, #84cc16, #22c55e)', 'color': '#ffffff', 'border-radius': '30px' },
                'button-cancel': { 'background-color': '#ecfccb', 'color': '#365314', 'border': '2px solid #84cc16', 'border-radius': '30px' },
                'footer': { 'background-color': '#ecfccb', 'border-top': '1px solid #bef264' },
                'content': { 'background-color': '#f0fdf4' },
                'summary-body': { 'background-color': '#f0fdf4' },
                'summary-item': { 'background-color': '#dcfce7', 'color': '#14532d', 'border-radius': '20px', 'padding': '12px' },
                'summary-item-name': { 'color': '#166534', 'font-weight': '600' },
                'summary-size': { 'color': '#15803d' },
                'summary-remove': { 'color': '#dc2626' },
            },
            midnight: {
                'modal': { 'background-color': '#0c1445', 'color': '#e0e7ff' },
                'header': { 'background-color': '#1e1b4b', 'color': '#c7d2fe', 'border-bottom': '1px solid #312e81' },
                'source-list': { 'background-color': '#1e1b4b', 'border-right': '1px solid #312e81' },
                'source-item': { 'color': '#a5b4fc' },
                'source-item-active': { 'background-color': '#4338ca', 'color': '#e0e7ff' },
                'drop-area-container': { 'background-color': '#0c1445' },
                'drop-area': { 'background-color': '#1e1b4b', 'border': '2px dashed #6366f1', 'border-radius': '10px' },
                'button-primary': { 'background-color': '#4f46e5', 'color': '#ffffff', 'border-radius': '8px' },
                'button-cancel': { 'background-color': '#1e1b4b', 'color': '#c7d2fe', 'border': '2px solid #4338ca', 'border-radius': '8px' },
                'footer': { 'background-color': '#1e1b4b', 'border-top': '1px solid #312e81' },
                'content': { 'background-color': '#0c1445' },
                'summary-body': { 'background-color': '#0c1445' },
                'summary-item': { 'background-color': '#1e1b4b', 'color': '#e0e7ff', 'border-radius': '10px', 'padding': '12px' },
                'summary-item-name': { 'color': '#c7d2fe', 'font-weight': '600' },
                'summary-size': { 'color': '#a5b4fc' },
                'summary-remove': { 'color': '#f87171' },
            },
            candy: {
                'modal': { 'background': 'linear-gradient(135deg, #fae8ff 0%, #fce7f3 50%, #fbcfe8 100%)', 'color': '#831843' },
                'header': { 'background': 'linear-gradient(90deg, #ec4899, #f472b6)', 'color': '#ffffff' },
                'source-list': { 'background-color': '#fdf4ff' },
                'source-item': { 'color': '#9f1239' },
                'source-item-active': { 'background': 'linear-gradient(90deg, #ec4899, #f472b6)', 'color': '#ffffff' },
                'drop-area-container': { 'background': 'linear-gradient(135deg, #fae8ff, #fce7f3)' },
                'drop-area': { 'background-color': '#fdf4ff', 'border': '3px dashed #ec4899', 'border-radius': '24px' },
                'button-primary': { 'background': 'linear-gradient(90deg, #ec4899, #f472b6, #a855f7)', 'color': '#ffffff', 'border-radius': '30px' },
                'button-cancel': { 'background-color': '#fdf4ff', 'color': '#9f1239', 'border': '2px solid #ec4899', 'border-radius': '30px' },
                'footer': { 'background-color': '#fdf4ff', 'border-top': '2px solid #f9a8d4' },
                'content': { 'background': 'linear-gradient(135deg, #fae8ff, #fce7f3)' },
                'summary-body': { 'background': 'linear-gradient(135deg, #fae8ff, #fce7f3)' },
                'summary-item': { 'background-color': '#fdf4ff', 'color': '#831843', 'border-radius': '24px', 'padding': '12px' },
                'summary-item-name': { 'color': '#9f1239', 'font-weight': '600' },
                'summary-size': { 'color': '#be123c' },
                'summary-remove': { 'color': '#ec4899' },
            },
            autumn: {
                'modal': { 'background-color': '#fef2f2', 'color': '#7c2d12' },
                'header': { 'background': 'linear-gradient(90deg, #dc2626, #ea580c)', 'color': '#ffffff' },
                'source-list': { 'background-color': '#fed7aa', 'border-right': '1px solid #fdba74' },
                'source-item': { 'color': '#9a3412' },
                'source-item-active': { 'background-color': '#ea580c', 'color': '#ffffff' },
                'drop-area-container': { 'background-color': '#fef2f2' },
                'drop-area': { 'background-color': '#fed7aa', 'border': '2px dashed #dc2626', 'border-radius': '12px' },
                'button-primary': { 'background': 'linear-gradient(90deg, #dc2626, #ea580c, #f97316)', 'color': '#ffffff', 'border-radius': '10px' },
                'button-cancel': { 'background-color': '#fed7aa', 'color': '#9a3412', 'border': '2px solid #ea580c', 'border-radius': '10px' },
                'footer': { 'background-color': '#fed7aa', 'border-top': '1px solid #fdba74' },
                'content': { 'background-color': '#fef2f2' },
                'summary-body': { 'background-color': '#fef2f2' },
                'summary-item': { 'background-color': '#fed7aa', 'color': '#7c2d12', 'border-radius': '12px', 'padding': '12px' },
                'summary-item-name': { 'color': '#9a3412', 'font-weight': '600' },
                'summary-size': { 'color': '#c2410c' },
                'summary-remove': { 'color': '#dc2626' },
            },
            arctic: {
                'modal': { 'background-color': '#f0f9ff', 'color': '#0c4a6e' },
                'header': { 'background-color': '#7dd3fc', 'color': '#0c4a6e' },
                'source-list': { 'background-color': '#e0f2fe', 'border-right': '1px solid #bae6fd' },
                'source-item': { 'color': '#075985' },
                'source-item-active': { 'background-color': '#0ea5e9', 'color': '#ffffff' },
                'drop-area-container': { 'background-color': '#f0f9ff' },
                'drop-area': { 'background-color': '#e0f2fe', 'border': '2px dashed #38bdf8', 'border-radius': '8px' },
                'button-primary': { 'background-color': '#0ea5e9', 'color': '#ffffff', 'border-radius': '6px' },
                'button-cancel': { 'background-color': '#e0f2fe', 'color': '#075985', 'border': '2px solid #0ea5e9', 'border-radius': '6px' },
                'footer': { 'background-color': '#e0f2fe', 'border-top': '1px solid #bae6fd' },
                'content': { 'background-color': '#f0f9ff' },
                'summary-body': { 'background-color': '#f0f9ff' },
                'summary-item': { 'background-color': '#e0f2fe', 'color': '#0c4a6e', 'border-radius': '8px', 'padding': '12px' },
                'summary-item-name': { 'color': '#075985', 'font-weight': '600' },
                'summary-size': { 'color': '#0369a1' },
                'summary-remove': { 'color': '#0ea5e9' },
            },
            retro: {
                'modal': { 'background-color': '#fffbeb', 'color': '#78350f' },
                'header': { 'background-color': '#fbbf24', 'color': '#78350f', 'border-bottom': '3px solid #78350f' },
                'source-list': { 'background-color': '#fef3c7', 'border-right': '3px solid #78350f' },
                'source-item': { 'color': '#92400e' },
                'source-item-active': { 'background-color': '#78350f', 'color': '#fbbf24' },
                'drop-area-container': { 'background-color': '#fffbeb' },
                'drop-area': { 'background-color': '#fef3c7', 'border': '3px solid #78350f', 'border-radius': '0px' },
                'button-primary': { 'background-color': '#78350f', 'color': '#fbbf24', 'border-radius': '0px', 'border': '3px solid #78350f' },
                'button-cancel': { 'background-color': '#fffbeb', 'color': '#78350f', 'border': '3px solid #78350f', 'border-radius': '0px' },
                'footer': { 'background-color': '#fef3c7', 'border-top': '3px solid #78350f' },
                'content': { 'background-color': '#fffbeb' },
                'summary-body': { 'background-color': '#fffbeb' },
                'summary-item': { 'background-color': '#fef3c7', 'color': '#78350f', 'border': '3px solid #78350f', 'border-radius': '0px', 'padding': '12px' },
                'summary-item-name': { 'color': '#78350f', 'font-weight': '700' },
                'summary-size': { 'color': '#92400e' },
                'summary-remove': { 'color': '#dc2626' },
            },
        };
    }

    // Get current CSS for export
    getCurrentCSS() {
        let css = '';
        Object.entries(this.appliedStyles).forEach(([elementId, styles]) => {
            let elementSelector = '';
            Object.values(this.elements).forEach(category => {
                const found = category.find(el => el.id === elementId);
                if (found) elementSelector = found.selector;
            });

            if (elementSelector && Object.keys(styles).length > 0) {
                const styleString = Object.entries(styles)
                    .map(([prop, val]) => `  ${prop}: ${val};`)
                    .join('\n');
                css += `.fsp-picker ${elementSelector} {\n${styleString}\n}\n\n`;
            }
        });

        return css;
    }
}
