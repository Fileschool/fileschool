import { updateCode } from './codegen.js';

// CSS Presets
const cssPresets = {
    rounded: `.fsp-picker .fsp-picker__container {
  border-radius: 16px !important;
  overflow: hidden !important;
}

.fsp-picker button {
  border-radius: 8px !important;
}`,

    minimal: `.fsp-picker .fsp-picker__container {
  border: none !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
}

.fsp-picker .fsp-header {
  border-bottom: 1px solid #f0f0f0 !important;
}`,

    colorful: `.fsp-picker .fsp-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.fsp-picker .fsp-picker__container {
  border: 2px solid #667eea !important;
}`,

    dark: `.fsp-picker .fsp-picker__container {
  background: #1a1a1a !important;
  color: #ffffff !important;
}

.fsp-picker .fsp-header {
  background: #0a0a0a !important;
  color: #ffffff !important;
}

.fsp-picker button {
  background: #2a2a2a !important;
  color: #ffffff !important;
}`
};

let customCSSStyleTag = null;

export function initStyling(state) {
    const cssInput = document.getElementById('custom-css-input');
    const resetBtn = document.getElementById('reset-css-btn');
    const copyBtn = document.getElementById('copy-css-btn');
    const presetBtns = document.querySelectorAll('.preset-btn');

    // Apply CSS live as user types
    cssInput.addEventListener('input', () => {
        state.customCSS = cssInput.value;
        applyCSSToPreview(cssInput.value);
        updateCode(state);
    });

    // Reset CSS
    resetBtn.addEventListener('click', () => {
        cssInput.value = '';
        state.customCSS = '';
        applyCSSToPreview('');
        updateCode(state);
    });

    // Copy CSS
    copyBtn.addEventListener('click', () => {
        const css = cssInput.value;
        if (!css) {
            alert('No CSS to copy!');
            return;
        }

        navigator.clipboard.writeText(css).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            copyBtn.style.background = '#16a34a';
            copyBtn.style.color = 'white';

            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
                copyBtn.style.color = '';
            }, 2000);
        });
    });

    // Preset buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            if (cssPresets[preset]) {
                cssInput.value = cssPresets[preset];
                state.customCSS = cssPresets[preset];
                applyCSSToPreview(cssPresets[preset]);
                updateCode(state);
            }
        });
    });
}

function applyCSSToPreview(css) {
    // Remove existing style tag if it exists
    if (customCSSStyleTag) {
        customCSSStyleTag.remove();
    }

    // Create and inject new style tag
    if (css && css.trim()) {
        customCSSStyleTag = document.createElement('style');
        customCSSStyleTag.id = 'custom-picker-styles';
        customCSSStyleTag.textContent = css;
        document.head.appendChild(customCSSStyleTag);
    }
}

export function getCustomCSS(state) {
    return state.customCSS || '';
}
