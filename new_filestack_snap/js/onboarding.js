/**
 * Onboarding Tour System
 * Guides users through the main features of Snap Filestack
 */

class OnboardingTour {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.pickerObserver = null;
        this.removedElements = [];
        this.tourSteps = [
            {
                title: "Customize Picker Options",
                description: "Let's start by exploring the file picker configuration. Try toggling some sources or adjusting constraints.",
                icon: "fa-cloud-arrow-up",
                targetSelector: "#picker-config",
                action: () => {
                    // Switch to picker tab
                    document.querySelector('[data-tab="picker"]')?.click();
                    // Scroll to sources
                    const sourcesSection = document.querySelector('#sources-list');
                    if (sourcesSection) {
                        sourcesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                },
                tooltipPosition: "right"
            },
            {
                title: "Explore Styling Options",
                description: "Now let's customize the look! Check out the Visual Editor to style elements, or try the Presets tab for quick themes.",
                icon: "fa-palette",
                targetSelector: "#styling-config",
                action: () => {
                    // Switch to styling tab
                    document.querySelector('[data-tab="styling"]')?.click();
                    // Click on presets tab
                    setTimeout(() => {
                        const presetsTab = document.querySelector('[data-styling-tab="presets"]');
                        if (presetsTab) {
                            presetsTab.click();
                        }
                    }, 300);
                },
                tooltipPosition: "right"
            },
            {
                title: "Transform Images",
                description: "Finally, let's see image transformations in action! Upload an image and apply any transformation preset or effect.",
                icon: "fa-wand-magic-sparkles",
                targetSelector: "#transformations-config",
                action: () => {
                    // Switch to transformations tab
                    document.querySelector('[data-tab="transformations"]')?.click();
                    // Scroll to presets
                    setTimeout(() => {
                        const presetsSection = document.querySelector('.presets-section');
                        if (presetsSection) {
                            presetsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 300);
                },
                tooltipPosition: "right"
            }
        ];

        this.init();
    }

    init() {
        // Always show the rocket button — user clicks it to start onboarding
        this.addRestartButton();
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Welcome modal buttons
        document.getElementById('start-tour-btn')?.addEventListener('click', () => {
            this.hideWelcome();
            // Wait for welcome modal to fade out before starting tour
            setTimeout(() => {
                this.startTour();
            }, 350);
        });

        document.getElementById('skip-tour-btn')?.addEventListener('click', () => {
            const dontShowAgain = document.getElementById('dont-show-again')?.checked;
            if (dontShowAgain) {
                localStorage.setItem('snap-filestack-onboarding-completed', 'true');
            }
            this.hideWelcome();
            // Show restart button so they can still access the tour
            this.addRestartButton();
        });

        // Tour navigation buttons
        document.getElementById('onboarding-next-btn')?.addEventListener('click', () => {
            this.nextStep();
        });

        document.getElementById('onboarding-prev-btn')?.addEventListener('click', () => {
            this.prevStep();
        });

        document.getElementById('onboarding-skip-btn')?.addEventListener('click', () => {
            this.endTour();
        });

        // Restart tour button (added dynamically)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.restart-tour-btn')) {
                this.showWelcome();
            }
        });
    }

    showWelcome() {
        const welcomeModal = document.getElementById('onboarding-welcome');
        if (welcomeModal) {
            welcomeModal.classList.remove('hidden');
        }
    }

    hideWelcome() {
        const welcomeModal = document.getElementById('onboarding-welcome');
        if (welcomeModal) {
            welcomeModal.classList.add('hidden');
        }
    }

    startTour() {
        console.log('Starting tour...');
        this.isActive = true;
        this.currentStep = 0;

        // Reset removed elements in case of restart
        this.removedElements = [];

        // Add body class for CSS targeting
        document.body.classList.add('onboarding-active');

        // Close any open Filestack picker
        this.closeFilestackPicker();

        // Start observing for Filestack modals
        this.startPickerObserver();

        const overlay = document.getElementById('onboarding-overlay');
        console.log('Overlay element:', overlay);
        if (overlay) {
            overlay.classList.remove('hidden');
            overlay.classList.add('active');
            console.log('Overlay activated');
        }

        // Hide restart button during tour
        const restartBtn = document.querySelector('.restart-tour-btn');
        if (restartBtn) {
            restartBtn.style.display = 'none';
        }

        console.log('Calling showStep with step:', this.currentStep);
        this.showStep(this.currentStep);
    }

    closeFilestackPicker() {
        // Try to close any open Filestack picker by clicking the close button
        const closeButtons = document.querySelectorAll('[data-e2e="modal-close-button"], .fsp-modal__close-button, .fsp-close-button');
        closeButtons.forEach(btn => {
            if (btn && btn.offsetParent !== null) { // Check if visible
                btn.click();
            }
        });

        // Aggressively hide all Filestack modal elements
        this.hideFilestackModals();
    }

    hideFilestackModals() {
        // Only remove modal overlays, not inline pickers
        const selectors = [
            'div[style*="z-index: 999999"]', // Catch high z-index modals
            'div[style*="z-index: 9999"]',
            '[class*="fsp-modal"]',
            '[class*="fsp-picker__overlay"]'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Only remove if it's NOT an inline container and NOT already removed
                const isInlineContainer = el.id === 'inline-container' || el.closest('#inline-container');
                if (el && el.parentNode && !isInlineContainer && !this.removedElements.some(item => item.element === el)) {
                    // Check if it's actually a modal overlay (position fixed/absolute and high z-index)
                    const computedStyle = window.getComputedStyle(el);
                    const position = computedStyle.position;
                    const zIndex = parseInt(computedStyle.zIndex) || 0;

                    if ((position === 'fixed' || position === 'absolute') && zIndex > 1000) {
                        // Store the element and its parent for restoration
                        this.removedElements.push({
                            element: el,
                            parent: el.parentNode,
                            nextSibling: el.nextSibling
                        });
                        // Remove from DOM
                        el.parentNode.removeChild(el);
                    }
                }
            });
        });
    }

    startPickerObserver() {
        // Create a mutation observer to watch for new Filestack elements
        let debounceTimer = null;
        this.pickerObserver = new MutationObserver((mutations) => {
            if (this.isActive) {
                // Debounce to avoid excessive calls
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.hideFilestackModals();
                }, 50);
            }
        });

        // Start observing the document
        this.pickerObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false // Don't watch attributes to improve performance
        });

        // Also run periodically to catch any changes - less frequent since we're removing elements
        this.pickerInterval = setInterval(() => {
            if (this.isActive) {
                this.hideFilestackModals();
            }
        }, 250);
    }

    stopPickerObserver() {
        if (this.pickerObserver) {
            this.pickerObserver.disconnect();
            this.pickerObserver = null;
        }

        if (this.pickerInterval) {
            clearInterval(this.pickerInterval);
            this.pickerInterval = null;
        }
    }

    showStep(stepIndex) {
        console.log('showStep called with index:', stepIndex);
        const step = this.tourSteps[stepIndex];
        console.log('Step data:', step);
        if (!step) {
            console.error('No step found for index:', stepIndex);
            return;
        }

        // Execute step action
        if (step.action) {
            console.log('Executing step action');
            step.action();
        }

        // Wait for any animations
        setTimeout(() => {
            console.log('Updating tooltip and highlighting element');
            // Update tooltip content
            this.updateTooltip(step, stepIndex);

            // Highlight target element
            this.highlightElement(step.targetSelector);

            // Position tooltip
            this.positionTooltip(step.targetSelector, step.tooltipPosition);
        }, 400);
    }

    updateTooltip(step, stepIndex) {
        console.log('updateTooltip called');
        const tooltip = document.getElementById('onboarding-tooltip');
        const stepIndicator = document.getElementById('onboarding-step-indicator');
        const title = document.getElementById('onboarding-title');
        const description = document.getElementById('onboarding-description');
        const icon = tooltip?.querySelector('.onboarding-icon i');
        const nextBtn = document.getElementById('onboarding-next-btn');
        const prevBtn = document.getElementById('onboarding-prev-btn');

        console.log('Tooltip elements:', {tooltip, stepIndicator, title, description, icon, nextBtn, prevBtn});

        if (stepIndicator) {
            stepIndicator.textContent = `Step ${stepIndex + 1} of ${this.tourSteps.length}`;
        }

        if (title) {
            title.textContent = step.title;
        }

        if (description) {
            description.textContent = step.description;
        }

        if (icon) {
            icon.className = `fa-solid ${step.icon}`;
        }

        // Update button visibility
        if (prevBtn) {
            prevBtn.style.display = stepIndex > 0 ? 'flex' : 'none';
        }

        if (nextBtn) {
            const isLastStep = stepIndex === this.tourSteps.length - 1;
            nextBtn.innerHTML = isLastStep
                ? 'Finish <i class="fa-solid fa-check"></i>'
                : 'Next <i class="fa-solid fa-arrow-right"></i>';
        }
    }

    highlightElement(selector) {
        console.log('highlightElement called with selector:', selector);
        // Remove previous highlights
        document.querySelectorAll('.onboarding-highlight').forEach(el => {
            el.classList.remove('onboarding-highlight');
        });

        // Add highlight to target
        const target = document.querySelector(selector);
        console.log('Target element found:', target);
        if (target) {
            target.classList.add('onboarding-highlight');
            console.log('Highlight class added to target');

            // Position spotlight
            this.positionSpotlight(target);

            // Ensure sidebar is visible
            const sidebar = document.getElementById('config-panel');
            if (sidebar) {
                sidebar.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }
    }

    positionSpotlight(target) {
        const spotlight = document.querySelector('.onboarding-spotlight');
        if (!spotlight || !target) return;

        // Make spotlight visible
        spotlight.style.display = 'block';

        const rect = target.getBoundingClientRect();
        const padding = 10;

        // Position the spotlight to create a cutout around the target
        spotlight.style.top = `${rect.top - padding}px`;
        spotlight.style.left = `${rect.left - padding}px`;
        spotlight.style.width = `${rect.width + padding * 2}px`;
        spotlight.style.height = `${rect.height + padding * 2}px`;
    }

    positionTooltip(targetSelector, position = "right") {
        const tooltip = document.getElementById('onboarding-tooltip');
        const target = document.querySelector(targetSelector);

        console.log('positionTooltip - tooltip:', tooltip, 'target:', target, 'selector:', targetSelector);

        if (!tooltip || !target) {
            console.error('Missing tooltip or target!', {tooltip, target, targetSelector});
            return;
        }

        // Make tooltip visible now that we're positioning it
        tooltip.style.display = 'block';
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        console.log('Tooltip display set to block, opacity 1, visibility visible');

        const targetRect = target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const gap = 20;

        let top, left;

        switch (position) {
            case "right":
                left = targetRect.right + gap;
                top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
                break;
            case "left":
                left = targetRect.left - tooltipRect.width - gap;
                top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
                break;
            case "top":
                left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
                top = targetRect.top - tooltipRect.height - gap;
                break;
            case "bottom":
                left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
                top = targetRect.bottom + gap;
                break;
            default:
                left = targetRect.right + gap;
                top = targetRect.top;
        }

        // Keep tooltip within viewport
        const maxLeft = window.innerWidth - tooltipRect.width - 20;
        const maxTop = window.innerHeight - tooltipRect.height - 20;

        left = Math.max(20, Math.min(left, maxLeft));
        top = Math.max(20, Math.min(top, maxTop));

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    nextStep() {
        if (this.currentStep < this.tourSteps.length - 1) {
            this.currentStep++;
            this.showStep(this.currentStep);
        } else {
            this.endTour(true);
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }

    endTour(completed = false) {
        this.isActive = false;

        // Remove body class
        document.body.classList.remove('onboarding-active');

        // Stop observing for Filestack modals
        this.stopPickerObserver();

        // Remove highlights
        document.querySelectorAll('.onboarding-highlight').forEach(el => {
            el.classList.remove('onboarding-highlight');
        });

        // Restore Filestack picker if it was hidden
        this.restoreFilestackPicker();

        // Hide tooltip
        const tooltip = document.getElementById('onboarding-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }

        // Hide spotlight
        const spotlight = document.querySelector('.onboarding-spotlight');
        if (spotlight) {
            spotlight.style.display = 'none';
        }

        // Hide overlay
        const overlay = document.getElementById('onboarding-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 300);
        }

        if (completed) {
            localStorage.setItem('snap-filestack-onboarding-completed', 'true');
        }

        // Show restart button
        this.addRestartButton();
    }

    restoreFilestackPicker() {
        // Restore all removed elements back to DOM
        this.removedElements.forEach(item => {
            try {
                if (item.parent && item.element) {
                    if (item.nextSibling) {
                        item.parent.insertBefore(item.element, item.nextSibling);
                    } else {
                        item.parent.appendChild(item.element);
                    }
                }
            } catch (e) {
                console.warn('Could not restore element:', e);
            }
        });
        // Clear the array
        this.removedElements = [];
    }

    addRestartButton() {
        console.log('Adding restart button...');

        // Check if button already exists
        if (document.querySelector('.restart-tour-btn')) {
            const btn = document.querySelector('.restart-tour-btn');
            btn.style.display = 'flex';
            console.log('Restart button already exists, showing it');
            return;
        }

        const button = document.createElement('button');
        button.className = 'restart-tour-btn';
        button.innerHTML = '<i class="fa-solid fa-rocket"></i>';
        button.title = 'Restart Tour';
        button.setAttribute('aria-label', 'Restart onboarding tour');

        document.body.appendChild(button);
        console.log('Restart button added to DOM');
    }

    // Public method to restart tour (can be called from console or other scripts)
    restart() {
        localStorage.removeItem('snap-filestack-onboarding-completed');
        this.startTour();
    }
}

// Initialize onboarding when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.onboardingTour = new OnboardingTour();
    });
} else {
    window.onboardingTour = new OnboardingTour();
}

// Export for use in other modules
export default OnboardingTour;
