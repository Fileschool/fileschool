class FilestackTransformations {
    constructor() {
        this.baseUrl = 'https://cdn.filestackcontent.com';
        this.currentHandle = '';
        this.policy = '';
        this.signature = '';

        // Transformations with config
        this.transformations = {
            Rotate: { template: (v) => `rotate=deg:${v}`, type: 'range', min: 0, max: 360, value: 180 },
            Blur: { template: (v) => `blur=amount:${v}`, type: 'range', min: 1, max: 20, value: 8 },
            'Oil Paint': { template: (v) => `oil_paint=amount:${v}`, type: 'range', min: 1, max: 10, value: 4 },
            Sepia: { template: (v) => `sepia=tone:${v}`, type: 'range', min: 0, max: 100, value: 80 },
            Rounded: { template: (v) => `rounded_corners=radius:${v}`, type: 'range', min: 0, max: 200, value: 100 },
            Resize: {
                template: (w, h) => `resize=width:${w},height:${h},fit:crop`,
                type: 'dimensions',
                width: 400, height: 400
            },
            'Detect Faces': { template: () => `detect_faces=minsize:0.25,maxsize:0.55,color:red`, type: 'checkbox' },
            Polaroid: { template: () => `polaroid`, type: 'checkbox' },
            Monochrome: { template: () => `monochrome`, type: 'checkbox' }
        };

        this.initializeElements();
        this.renderTransformOptions();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.mainImage = document.getElementById('mainImage');
        this.originalImage = document.getElementById('originalImage');
        this.transformationUrl = document.getElementById('transformationUrl');
        this.originalUrl = document.getElementById('originalUrl');
        this.handleInput = document.getElementById('handleInput');
        this.policyInput = document.getElementById('policyInput');
        this.signatureInput = document.getElementById('signatureInput');
        this.setHandleBtn = document.getElementById('setHandleBtn');
        this.transformationsList = document.getElementById('transformationsList');
        this.originalLoader = document.getElementById('originalLoader');
        this.transformedLoader = document.getElementById('transformedLoader');
    }

    renderTransformOptions() {
        this.transformationsList.innerHTML = '';
        for (const [name, config] of Object.entries(this.transformations)) {
            const container = document.createElement('div');
            container.className = 'transform-option';
            container.dataset.name = name;

            let html = `<label><input type="checkbox" data-name="${name}" /> ${name}</label>`;

            if (config.type === 'range') {
                html += `
          <div style="display:flex; align-items:center; gap:8px; margin-top: 8px;">
            <input type="range" min="${config.min}" max="${config.max}" value="${config.value}" data-name="${name}" disabled />
            <span class="slider-value" data-value="${name}">${config.value}</span>
          </div>
        `;
            } else if (config.type === 'dimensions') {
                html += `
          <div style="display:flex; gap:6px; align-items:center; margin-top: 8px;">
            W: <input type="number" value="${config.width}" min="50" max="1000" data-dim="width" data-name="${name}" style="width:70px;" disabled />
            H: <input type="number" value="${config.height}" min="50" max="1000" data-dim="height" data-name="${name}" style="width:70px;" disabled />
          </div>
        `;
            }

            container.innerHTML = html;
            this.transformationsList.appendChild(container);
        }

        // Checkbox change events
        this.transformationsList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const name = e.target.dataset.name;
                const container = e.target.closest('.transform-option');
                const config = this.transformations[name];

                // Enable/disable related inputs
                if (config.type === 'range') {
                    const slider = container.querySelector(`input[type="range"][data-name="${name}"]`);
                    slider.disabled = !e.target.checked;
                } else if (config.type === 'dimensions') {
                    const inputs = container.querySelectorAll(`input[type="number"][data-name="${name}"]`);
                    inputs.forEach(input => input.disabled = !e.target.checked);
                }

                // Toggle active class
                if (e.target.checked) {
                    container.classList.add('active');
                } else {
                    container.classList.remove('active');
                }

                this.loadTransformedImage();
            });
        });

        // Live slider value updates
        this.transformationsList.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const name = e.target.dataset.name;
                const valueDisplay = this.transformationsList.querySelector(`.slider-value[data-value="${name}"]`);
                if (valueDisplay) valueDisplay.textContent = e.target.value;
                this.loadTransformedImage();
            });
        });

        // Live dimension updates
        this.transformationsList.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', () => this.loadTransformedImage());
        });
    }

    initializeEventListeners() {
        this.setHandleBtn.addEventListener('click', () => {
            const handle = this.handleInput.value.trim();
            if (handle) {
                this.currentHandle = handle;
                this.policy = this.policyInput.value.trim();
                this.signature = this.signatureInput.value.trim();
                this.loadOriginalImage();
                this.loadTransformedImage();
            }
        });

        // Allow Enter key to load image
        this.handleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.setHandleBtn.click();
            }
        });

        // Update policy and signature on input change
        this.policyInput.addEventListener('input', () => {
            if (this.currentHandle) {
                this.policy = this.policyInput.value.trim();
                this.loadOriginalImage();
                this.loadTransformedImage();
            }
        });

        this.signatureInput.addEventListener('input', () => {
            if (this.currentHandle) {
                this.signature = this.signatureInput.value.trim();
                this.loadOriginalImage();
                this.loadTransformedImage();
            }
        });
    }

    getSelectedTransformations() {
        const selected = [];
        const checkboxes = this.transformationsList.querySelectorAll('input[type="checkbox"]:checked');

        checkboxes.forEach((cb) => {
            const name = cb.dataset.name;
            const config = this.transformations[name];

            if (config.type === 'range') {
                const slider = this.transformationsList.querySelector(`input[type="range"][data-name="${name}"]`);
                selected.push(config.template(slider.value));
            } else if (config.type === 'dimensions') {
                const widthInput = this.transformationsList.querySelector(`input[data-dim="width"][data-name="${name}"]`);
                const heightInput = this.transformationsList.querySelector(`input[data-dim="height"][data-name="${name}"]`);
                selected.push(config.template(widthInput.value, heightInput.value));
            } else {
                selected.push(config.template());
            }
        });

        return selected;
    }

    getOriginalUrl() {
        if (!this.currentHandle) {
            return '';
        }

        let url = this.baseUrl;

        // Add security parameters if both are present
        if (this.policy && this.signature) {
            url += `/security=policy:${this.policy},signature:${this.signature}`;
        }

        url += `/${this.currentHandle}`;
        return url;
    }

    getCurrentTransformationUrl() {
        if (!this.currentHandle) {
            return '';
        }

        // Build the URL with security parameters if available
        let url = this.baseUrl;

        // Add security parameters (policy and signature) if both are present
        if (this.policy && this.signature) {
            url += `/security=policy:${this.policy},signature:${this.signature}`;
        }

        // Add transformations
        const selected = this.getSelectedTransformations();
        if (selected.length > 0) {
            const chain = selected.join('/');
            url += `/${chain}`;
        }

        // Add the handle
        url += `/${this.currentHandle}`;

        return url;
    }

    showLoader(loaderElement, imageElement) {
        loaderElement.classList.add('active');
        imageElement.classList.add('loading');
    }

    hideLoader(loaderElement, imageElement) {
        loaderElement.classList.remove('active');
        imageElement.classList.remove('loading');
    }

    loadOriginalImage() {
        const url = this.getOriginalUrl();
        if (!url) return;

        this.showLoader(this.originalLoader, this.originalImage);
        this.setHandleBtn.disabled = true;

        const img = new Image();
        img.onload = () => {
            this.originalImage.src = url;
            this.originalUrl.textContent = url;
            this.hideLoader(this.originalLoader, this.originalImage);
            this.setHandleBtn.disabled = false;
        };

        img.onerror = () => {
            this.hideLoader(this.originalLoader, this.originalImage);
            this.originalUrl.textContent = 'Error loading image. Please check the handle and security credentials.';
            this.setHandleBtn.disabled = false;
        };

        img.src = url;
    }

    loadTransformedImage() {
        const url = this.getCurrentTransformationUrl();
        if (!url) return;

        const selected = this.getSelectedTransformations();

        // If no transformations are selected, show original
        if (selected.length === 0) {
            this.mainImage.src = this.originalImage.src;
            this.transformationUrl.textContent = 'No transformations applied';
            return;
        }

        this.showLoader(this.transformedLoader, this.mainImage);

        const img = new Image();
        img.onload = () => {
            this.mainImage.src = url;
            this.transformationUrl.textContent = url;
            this.hideLoader(this.transformedLoader, this.mainImage);
        };

        img.onerror = () => {
            this.hideLoader(this.transformedLoader, this.mainImage);
            this.transformationUrl.textContent = 'Error loading transformed image.';
        };

        img.src = url;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.filestackApp = new FilestackTransformations();
});
