class FilestackTransformations {
    constructor() {
        this.baseUrl = 'https://cdn.filestackcontent.com';
        this.currentHandle = '';

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
        this.transformationUrl = document.getElementById('transformationUrl');
        this.handleInput = document.getElementById('handleInput');
        this.setHandleBtn = document.getElementById('setHandleBtn');
        this.transformationsList = document.getElementById('transformationsList');
    }

    renderTransformOptions() {
        this.transformationsList.innerHTML = '';
        for (const [name, config] of Object.entries(this.transformations)) {
            const container = document.createElement('div');
            container.className = 'transform-option';

            let html = `<label>${name}</label>`;

            if (config.type === 'range') {
                html += `
          <input type="checkbox" data-name="${name}" />
          <div style="display:flex; align-items:center; gap:8px;">
            <input type="range" min="${config.min}" max="${config.max}" value="${config.value}" data-name="${name}" />
            <span class="slider-value" data-value="${name}">${config.value}</span>
          </div>
        `;
            } else if (config.type === 'dimensions') {
                html += `
          <input type="checkbox" data-name="${name}" />
          <div style="display:flex; gap:6px; align-items:center;">
            W: <input type="number" value="${config.width}" min="50" max="1000" data-dim="width" data-name="${name}" style="width:70px;" />
            H: <input type="number" value="${config.height}" min="50" max="1000" data-dim="height" data-name="${name}" style="width:70px;" />
          </div>
        `;
            } else {
                html += `<input type="checkbox" data-name="${name}" />`;
            }

            container.innerHTML = html;
            this.transformationsList.appendChild(container);
        }

        // Live slider value updates
        this.transformationsList.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const name = e.target.dataset.name;
                const valueDisplay = this.transformationsList.querySelector(`.slider-value[data-value="${name}"]`);
                if (valueDisplay) valueDisplay.textContent = e.target.value;
                this.loadImage(); // auto-update
            });
        });

        // Live dimension updates
        this.transformationsList.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', () => this.loadImage());
        });

        // Checkbox updates
        this.transformationsList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', () => this.loadImage());
        });
    }

    initializeEventListeners() {
        this.setHandleBtn.addEventListener('click', () => {
            const handle = this.handleInput.value.trim();
            if (handle) {
                this.currentHandle = handle;
                this.loadImage(); // show original immediately
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

    getCurrentTransformationUrl() {
        if (!this.currentHandle) {
            return '';
        }
        const selected = this.getSelectedTransformations();
        if (selected.length === 0) {
            return `${this.baseUrl}/${this.currentHandle}`;
        }
        const chain = selected.join('/');
        return `${this.baseUrl}/${chain}/${this.currentHandle}`;
    }

    loadImage() {
        const url = this.getCurrentTransformationUrl();
        if (!url) return;

        this.mainImage.src = url;
        this.transformationUrl.textContent = url;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.filestackApp = new FilestackTransformations();
});
