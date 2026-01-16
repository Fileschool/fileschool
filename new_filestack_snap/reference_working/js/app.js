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

        // Toggle Drawer
        document.getElementById('view-code-btn').addEventListener('click', () => {
            document.getElementById('code-drawer').classList.add('open');
        });

        document.getElementById('close-drawer').addEventListener('click', () => {
            document.getElementById('code-drawer').classList.remove('open');
        });

        // Toggle CSS Drawer
        document.getElementById('view-css-btn').addEventListener('click', () => {
            const cssDrawer = document.getElementById('css-drawer');
            cssDrawer.classList.add('open');
            // Update CSS output when opening
            if (window.stylingPlayground) {
                window.stylingPlayground.updateCSSDrawer();
            }
        });

        document.getElementById('close-css-drawer').addEventListener('click', () => {
            document.getElementById('css-drawer').classList.remove('open');
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
    }
}

// Start app
const app = new App();
