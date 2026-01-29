import { initConfig, state } from './config.js';
import { initStyling } from './styling.js';
import { StylingPlayground } from './stylingPlayground.js';
import { initTransformations } from './transformations.js';

export class App {
    constructor() {
        console.log("Snap Filestack Initialized");
        this.stylingPlaygroundInitialized = false;
        this.transformationsInitialized = false;
        this.initEventListeners();
        initConfig();
        initStyling(state);

        // Hide transformation sidebar initially (Picker tab is active by default)
        const transformationSidebar = document.getElementById('transformation-preview-panel');
        if (transformationSidebar) {
            transformationSidebar.classList.add('collapsed');
        }
    }

    initStylingPlayground() {
        // Wait for the styling config section to be visible before initializing
        const checkAndInit = () => {
            const stylingConfig = document.getElementById('styling-config');
            if (stylingConfig) {
                console.log('Initializing StylingPlayground...');
                this.stylingPlayground = new StylingPlayground();
                this.stylingPlayground.init();
                // Make it globally accessible for close button
                window.stylingPlayground = this.stylingPlayground;
            } else {
                console.warn('styling-config not found, retrying...');
                setTimeout(checkAndInit, 100);
            }
        };

        // Start checking after a brief delay
        setTimeout(checkAndInit, 50);
    }

    initEventListeners() {
        // Tab switching
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.tab;

                // Update buttons
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');

                // Update content
                document.querySelectorAll('.config-section').forEach(s => s.classList.remove('active'));
                document.getElementById(`${target}-config`).classList.add('active');

                // Show/hide transformation sidebar based on active tab
                const transformationSidebar = document.getElementById('transformation-preview-panel');
                if (target === 'transformations') {
                    transformationSidebar.classList.remove('collapsed');
                } else {
                    transformationSidebar.classList.add('collapsed');
                }

                // Initialize styling playground when styling tab is first opened
                if (target === 'styling' && !this.stylingPlaygroundInitialized) {
                    this.initStylingPlayground();
                    this.stylingPlaygroundInitialized = true;
                }

                // Initialize transformations when transformations tab is first opened
                if (target === 'transformations' && !this.transformationsInitialized) {
                    initTransformations();
                    this.transformationsInitialized = true;
                }
            });
        });

        // Manual transformation sidebar toggle
        const toggleBtn = document.getElementById('toggle-transformation-sidebar');
        const transformationSidebar = document.getElementById('transformation-preview-panel');
        if (toggleBtn && transformationSidebar) {
            toggleBtn.addEventListener('click', () => {
                transformationSidebar.classList.toggle('collapsed');
            });
        }

        // Code Viewer Modal Listeners
        const viewCodeBtn = document.getElementById('view-code-btn');
        const viewCssBtn = document.getElementById('view-css-btn');
        const closeModalBtn = document.getElementById('close-code-modal');
        const backdrop = document.getElementById('code-modal-backdrop');
        const copyJsBtn = document.getElementById('copy-js-btn');

        if (viewCodeBtn) {
            viewCodeBtn.addEventListener('click', () => this.openCodeModal('js'));
        }

        if (viewCssBtn) {
            viewCssBtn.addEventListener('click', () => this.openCodeModal('css'));
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeCodeModal());
        }

        if (backdrop) {
            backdrop.addEventListener('click', () => this.closeCodeModal());
        }

        if (copyJsBtn) {
            copyJsBtn.addEventListener('click', () => {
                const code = document.getElementById('generated-code').textContent;
                navigator.clipboard.writeText(code).then(() => {
                    if (window.stylingPlayground) {
                        window.stylingPlayground.showToast('📋 JS copied to clipboard!', 'success');
                    } else {
                        alert('JS copied to clipboard!');
                    }
                });
            });
        }

        // Modal Tab Switching
        document.querySelectorAll('.code-modal-tab').forEach(tabBtn => {
            tabBtn.addEventListener('click', () => {
                const tabName = tabBtn.dataset.tab;
                this.switchModalTab(tabName);
            });
        });

        // Intelligence -> Transformations redirect
        const gotoTransformationsBtn = document.getElementById('goto-transformations-btn');
        if (gotoTransformationsBtn) {
            gotoTransformationsBtn.addEventListener('click', () => {
                // Click the transformations tab
                const transformationsTab = document.querySelector('.nav-btn[data-tab="transformations"]');
                if (transformationsTab) {
                    transformationsTab.click();
                }
            });
        }

        // User Credentials Panel
        this.initCredentialsPanel();
    }

    initCredentialsPanel() {
        const toggleBtn = document.getElementById('toggle-credentials-btn');
        const panel = document.getElementById('user-credentials-panel');
        const applyBtn = document.getElementById('apply-credentials-btn');
        const resetBtn = document.getElementById('reset-credentials-btn');

        if (!toggleBtn || !panel) return;

        // Store default credentials for reset
        this.defaultCredentials = {
            apiKey: document.getElementById('api-key-input').value,
            policy: document.getElementById('trans-policy-input').value,
            signature: document.getElementById('trans-signature-input').value
        };

        toggleBtn.addEventListener('click', () => {
            const isHidden = panel.classList.contains('hidden');
            panel.classList.toggle('hidden');
            toggleBtn.innerHTML = isHidden
                ? '<i class="fa-solid fa-xmark"></i> Close'
                : '<i class="fa-solid fa-key"></i> Use Your Own API Key';
        });

        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                const userApiKey = document.getElementById('user-api-key-input').value.trim();
                const userPolicy = document.getElementById('user-policy-input').value.trim();
                const userSignature = document.getElementById('user-signature-input').value.trim();

                if (!userApiKey) {
                    if (window.stylingPlayground) {
                        window.stylingPlayground.showToast('Please enter an API Key', 'error');
                    } else {
                        alert('Please enter an API Key');
                    }
                    return;
                }

                // Update the hidden inputs (which drive state via config.js bindings)
                const apiKeyInput = document.getElementById('api-key-input');
                const policyInput = document.getElementById('trans-policy-input');
                const signatureInput = document.getElementById('trans-signature-input');

                apiKeyInput.value = userApiKey;
                apiKeyInput.dispatchEvent(new Event('input'));

                if (userPolicy) {
                    policyInput.value = userPolicy;
                    policyInput.dispatchEvent(new Event('input'));
                }
                if (userSignature) {
                    signatureInput.value = userSignature;
                    signatureInput.dispatchEvent(new Event('input'));
                }

                state.usingOwnCredentials = true;

                if (window.stylingPlayground) {
                    window.stylingPlayground.showToast('Credentials applied!', 'success');
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // Reset hidden inputs to defaults
                const apiKeyInput = document.getElementById('api-key-input');
                const policyInput = document.getElementById('trans-policy-input');
                const signatureInput = document.getElementById('trans-signature-input');

                apiKeyInput.value = this.defaultCredentials.apiKey;
                apiKeyInput.dispatchEvent(new Event('input'));
                policyInput.value = this.defaultCredentials.policy;
                policyInput.dispatchEvent(new Event('input'));
                signatureInput.value = this.defaultCredentials.signature;
                signatureInput.dispatchEvent(new Event('input'));

                // Clear user inputs
                document.getElementById('user-api-key-input').value = '';
                document.getElementById('user-policy-input').value = '';
                document.getElementById('user-signature-input').value = '';

                state.usingOwnCredentials = false;

                if (window.stylingPlayground) {
                    window.stylingPlayground.showToast('Reset to demo credentials', 'success');
                }
            });
        }
    }

    openCodeModal(initialTab = 'js') {
        const modal = document.getElementById('code-viewer-modal');
        const backdrop = document.getElementById('code-modal-backdrop');

        if (modal && backdrop) {
            modal.classList.remove('hidden');
            backdrop.classList.remove('hidden');
            this.switchModalTab(initialTab);
        }
    }

    closeCodeModal() {
        const modal = document.getElementById('code-viewer-modal');
        const backdrop = document.getElementById('code-modal-backdrop');

        if (modal && backdrop) {
            modal.classList.add('hidden');
            backdrop.classList.add('hidden');
        }
    }

    switchModalTab(tabName) {
        // Update tabs
        document.querySelectorAll('.code-modal-tab').forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update content
        document.querySelectorAll('.modal-tab-content').forEach(content => {
            content.classList.add('hidden'); // Hide all first
            content.classList.remove('active');
        });

        const activeContent = document.getElementById(`modal-tab-${tabName}`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
            activeContent.classList.add('active');
        }

        // Special handling for CSS tab
        if (tabName === 'css' && window.stylingPlayground) {
            window.stylingPlayground.updateCSSDrawer();
        }
    }
}

// Start app
const app = new App();
