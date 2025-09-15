// Global variables
let currentSection = 'picker';
let filestackClient = null;
let currentPicker = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupTransformOptions();
    setupRangeSliders();
});

// Initialize the application
function initializeApp() {
    // Set default API key for demo purposes
    document.getElementById('globalApikey').value = 'YOUR_APIKEY';
    
    // Initialize Filestack client
    if (typeof filestack !== 'undefined') {
        filestackClient = filestack.init('YOUR_APIKEY');
    }
    
    // Show initial section
    showSection('picker');
    
    // Generate initial code
    generatePickerCode();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Code tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchCodeTab(tab);
        });
    });

    // Transform option toggles
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.id.startsWith('enable')) {
            checkbox.addEventListener('change', function() {
                toggleTransformInputs(this);
            });
        }
    });

    // Real-time code generation for all sections
    setupRealTimeCodeGeneration();
}

// Setup transform options
function setupTransformOptions() {
    // Add event listeners for transform option toggles
    const transformOptions = [
        'resize', 'crop', 'rotate', 'blur', 'sharpen', 'sepia', 
        'roundedCorners', 'vignette', 'shadow', 'border', 'watermark'
    ];

    transformOptions.forEach(option => {
        const checkbox = document.getElementById(`enable${option.charAt(0).toUpperCase() + option.slice(1)}`);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                const inputs = document.getElementById(`${option}Inputs`);
                if (inputs) {
                    inputs.style.display = this.checked ? 'grid' : 'none';
                }
            });
        }
    });
}

// Setup range sliders
function setupRangeSliders() {
    const qualitySlider = document.getElementById('outputQuality');
    const compressSlider = document.getElementById('outputCompress');
    
    if (qualitySlider) {
        qualitySlider.addEventListener('input', function() {
            document.getElementById('qualityValue').textContent = this.value + '%';
        });
    }
    
    if (compressSlider) {
        compressSlider.addEventListener('input', function() {
            document.getElementById('compressValue').textContent = this.value + '%';
        });
    }
}

// Setup real-time code generation for all sections
function setupRealTimeCodeGeneration() {
    // Picker section
    document.querySelectorAll('#picker input, #picker select, #picker input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', debounce(() => {
            if (currentSection === 'picker') generatePickerCode();
        }, 300));
    });

    // Transform section
    document.querySelectorAll('#transform input, #transform select, #transform input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', debounce(() => {
            if (currentSection === 'transform') generateTransformCode();
        }, 300));
    });

    // Upload section
    document.querySelectorAll('#upload input, #upload select, #upload input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', debounce(() => {
            if (currentSection === 'upload') generateUploadCode();
        }, 300));
    });

    // Download section
    document.querySelectorAll('#download input, #download select, #download input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', debounce(() => {
            if (currentSection === 'download') generateDownloadCode();
        }, 300));
    });

    // SFW section
    document.querySelectorAll('#sfw input, #sfw select, #sfw input[type="checkbox"], #sfw input[type="range"]').forEach(element => {
        element.addEventListener('change', debounce(() => {
            if (currentSection === 'sfw') generateSfwCode();
        }, 300));
        element.addEventListener('input', debounce(() => {
            if (currentSection === 'sfw') generateSfwCode();
        }, 300));
    });

    // Tagging section
    document.querySelectorAll('#tagging input, #tagging select, #tagging input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', debounce(() => {
            if (currentSection === 'tagging') generateTaggingCode();
        }, 300));
    });

    // OCR section
    document.querySelectorAll('#ocr input, #ocr select, #ocr input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', debounce(() => {
            if (currentSection === 'ocr') generateOcrCode();
        }, 300));
    });

    // Faces section
    document.querySelectorAll('#faces input, #faces select, #faces input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', debounce(() => {
            if (currentSection === 'faces') generateFacesCode();
        }, 300));
    });

    // Security section
    document.querySelectorAll('#security input, #security select, #security textarea, #security input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', debounce(() => {
            if (currentSection === 'security') generateSecurityCode();
        }, 300));
    });

    // Store section
    document.querySelectorAll('#store input, #store select, #store input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', debounce(() => {
            if (currentSection === 'store') generateStoreCode();
        }, 300));
    });

    // Metadata section
    document.querySelectorAll('#metadata input, #metadata select, #metadata input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', debounce(() => {
            if (currentSection === 'metadata') generateMetadataCode();
        }, 300));
    });

    // Global API key
    const globalApiKey = document.getElementById('globalApikey');
    if (globalApiKey) {
        globalApiKey.addEventListener('change', debounce(() => {
            // Regenerate code for current section
            if (currentSection === 'picker') generatePickerCode();
            else if (currentSection === 'transform') generateTransformCode();
            else if (currentSection === 'upload') generateUploadCode();
            else if (currentSection === 'download') generateDownloadCode();
            else if (currentSection === 'sfw') generateSfwCode();
            else if (currentSection === 'tagging') generateTaggingCode();
            else if (currentSection === 'ocr') generateOcrCode();
            else if (currentSection === 'faces') generateFacesCode();
            else if (currentSection === 'security') generateSecurityCode();
            else if (currentSection === 'store') generateStoreCode();
            else if (currentSection === 'metadata') generateMetadataCode();
        }, 300));
    }
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active class to nav item
    const navItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    currentSection = sectionName;
    
    // Reset code tabs to JavaScript and generate appropriate code
    switchCodeTab('javascript');
    
    // Generate appropriate code
    if (sectionName === 'picker') {
        generatePickerCode('javascript');
    } else if (sectionName === 'transform') {
        generateTransformCode('javascript');
    } else if (sectionName === 'upload') {
        generateUploadCode();
    } else if (sectionName === 'download') {
        generateDownloadCode();
    } else if (sectionName === 'sfw') {
        generateSfwCode();
    } else if (sectionName === 'tagging') {
        generateTaggingCode();
    } else if (sectionName === 'ocr') {
        generateOcrCode();
    } else if (sectionName === 'faces') {
        generateFacesCode();
    } else if (sectionName === 'security') {
        generateSecurityCode();
    } else if (sectionName === 'store') {
        generateStoreCode();
    } else if (sectionName === 'metadata') {
        generateMetadataCode();
    }
}

// Switch code tab
function switchCodeTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected tab
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update code based on current section and tab
    if (currentSection === 'picker') {
        generatePickerCode(tabName);
    } else if (currentSection === 'transform') {
        generateTransformCode(tabName);
    }
    
    // Update code display with correct language
    const codeElement = document.getElementById('generatedCode');
    if (codeElement) {
        // Set the language class for syntax highlighting
        codeElement.className = `language-${tabName === 'javascript' ? 'javascript' : tabName === 'react' ? 'jsx' : tabName === 'vue' ? 'vue' : 'javascript'}`;
    }
}

// Toggle transform inputs
function toggleTransformInputs(checkbox) {
    const optionName = checkbox.id.replace('enable', '').toLowerCase();
    const inputs = document.getElementById(`${optionName}Inputs`);
    
    if (inputs) {
        inputs.style.display = checkbox.checked ? 'grid' : 'none';
    }
}

// Generate picker code
function generatePickerCode(tab = 'javascript') {
    const options = collectPickerOptions();
    let code = '';
    
    switch (tab) {
        case 'javascript':
            code = generateJavaScriptPickerCode(options);
            break;
        case 'react':
            code = generateReactPickerCode(options);
            break;
        case 'vue':
            code = generateVuePickerCode(options);
            break;
        case 'url':
            code = generateURLPickerCode(options);
            break;
    }
    
    updateCodeDisplay(code, tab);
}

// Generate transform code
function generateTransformCode(tab = 'javascript') {
    const options = collectTransformOptions();
    let code = '';
    
    switch (tab) {
        case 'javascript':
            code = generateJavaScriptTransformCode(options);
            break;
        case 'react':
            code = generateReactTransformCode(options);
            break;
        case 'vue':
            code = generateVueTransformCode(options);
            break;
        case 'url':
            code = generateURLTransformCode(options);
            break;
    }
    
    updateCodeDisplay(code, tab);
}

// Collect picker options
function collectPickerOptions() {
    const options = {};
    
    // API Key
    const apiKey = document.getElementById('globalApikey').value;
    if (apiKey && apiKey !== 'YOUR_APIKEY') {
        options.apiKey = apiKey;
    }
    
    // Display mode
    const displayMode = document.querySelector('input[name="displayMode"]:checked').value;
    if (displayMode !== 'modal') {
        options.displayMode = displayMode;
    }
    
    // Language
    const language = document.getElementById('language').value;
    if (language !== 'en') {
        options.lang = language;
    }
    
    // Accept files
    const acceptFiles = [];
    document.querySelectorAll('#picker input[type="checkbox"][value]').forEach(checkbox => {
        if (checkbox.checked) {
            acceptFiles.push(checkbox.value);
        }
    });
    if (acceptFiles.length > 0) {
        options.accept = acceptFiles;
    }
    
    // Sources
    const sources = [];
    document.querySelectorAll('#picker .config-card:nth-child(3) input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            sources.push(checkbox.value);
        }
    });
    if (sources.length > 0) {
        options.fromSources = sources;
    }
    
    // File limits
    const maxFiles = document.getElementById('maxFiles').value;
    if (maxFiles) {
        options.maxFiles = parseInt(maxFiles);
    }
    
    const minFiles = document.getElementById('minFiles').value;
    if (minFiles) {
        options.minFiles = parseInt(minFiles);
    }
    
    const maxSize = document.getElementById('maxSize').value;
    if (maxSize) {
        options.maxSize = parseInt(maxSize) * 1024 * 1024; // Convert MB to bytes
    }
    
    const concurrency = document.getElementById('concurrency').value;
    if (concurrency) {
        options.concurrency = parseInt(concurrency);
    }
    
    // Image dimensions
    const imageWidth = document.getElementById('imageWidth').value;
    const imageHeight = document.getElementById('imageHeight').value;
    if (imageWidth || imageHeight) {
        options.imageDim = {};
        if (imageWidth) options.imageDim.width = parseInt(imageWidth);
        if (imageHeight) options.imageDim.height = parseInt(imageHeight);
    }
    
    const imageMaxWidth = document.getElementById('imageMaxWidth').value;
    const imageMaxHeight = document.getElementById('imageMaxHeight').value;
    if (imageMaxWidth || imageMaxHeight) {
        options.imageMax = {};
        if (imageMaxWidth) options.imageMax.width = parseInt(imageMaxWidth);
        if (imageMaxHeight) options.imageMax.height = parseInt(imageMaxHeight);
    }
    
    const imageMinWidth = document.getElementById('imageMinWidth').value;
    const imageMinHeight = document.getElementById('imageMinHeight').value;
    if (imageMinWidth || imageMinHeight) {
        options.imageMin = {};
        if (imageMinWidth) options.imageMin.width = parseInt(imageMinWidth);
        if (imageMinHeight) options.imageMin.height = parseInt(imageMinHeight);
    }
    
    // Advanced options
    if (document.getElementById('multipleFileUpload').checked) {
        options.multipleFileUpload = true;
    }
    
    if (document.getElementById('disableThumbnails').checked) {
        options.disableThumbnails = true;
    }
    
    if (document.getElementById('disableTransformer').checked) {
        options.disableTransformer = true;
    }
    
    if (document.getElementById('hideModalWhenUploading').checked) {
        options.hideModalWhenUploading = true;
    }
    
    if (document.getElementById('allowManualRetry').checked) {
        options.allowManualRetry = true;
    }
    
    if (document.getElementById('uploadInBackground').checked) {
        options.uploadInBackground = true;
    }
    
    return options;
}

// Collect transform options
function collectTransformOptions() {
    const options = {};
    
    // File handle
    const handle = document.getElementById('transformHandle').value;
    if (handle) {
        options.handle = handle;
    }
    
    // Basic transformations
    if (document.getElementById('enableResize').checked) {
        const width = document.getElementById('resizeWidth').value;
        const height = document.getElementById('resizeHeight').value;
        const fit = document.getElementById('resizeFit').value;
        
        options.resize = {};
        if (width) options.resize.width = parseInt(width);
        if (height) options.resize.height = parseInt(height);
        if (fit !== 'clip') options.resize.fit = fit;
    }
    
    if (document.getElementById('enableCrop').checked) {
        const x = document.getElementById('cropX').value;
        const y = document.getElementById('cropY').value;
        const width = document.getElementById('cropWidth').value;
        const height = document.getElementById('cropHeight').value;
        
        if (x && y && width && height) {
            options.crop = {
                dim: [parseInt(x), parseInt(y), parseInt(width), parseInt(height)]
            };
        }
    }
    
    if (document.getElementById('enableRotate').checked) {
        const degrees = document.getElementById('rotateDegrees').value;
        if (degrees) {
            options.rotate = parseInt(degrees);
        }
    }
    
    if (document.getElementById('enableFlip').checked) {
        options.flip = true;
    }
    
    if (document.getElementById('enableFlop').checked) {
        options.flop = true;
    }
    
    // Filters
    if (document.getElementById('enableBlur').checked) {
        const amount = document.getElementById('blurAmount').value;
        if (amount) {
            options.blur = parseInt(amount);
        }
    }
    
    if (document.getElementById('enableSharpen').checked) {
        const amount = document.getElementById('sharpenAmount').value;
        if (amount) {
            options.sharpen = parseInt(amount);
        }
    }
    
    if (document.getElementById('enableSepia').checked) {
        const amount = document.getElementById('sepiaAmount').value;
        if (amount) {
            options.sepia = parseInt(amount);
        }
    }
    
    if (document.getElementById('enableBlackWhite').checked) {
        options.blackwhite = true;
    }
    
    if (document.getElementById('enableNegative').checked) {
        options.negative = true;
    }
    
    if (document.getElementById('enableCircle').checked) {
        options.circle = true;
    }
    
    if (document.getElementById('enableRoundedCorners').checked) {
        const radius = document.getElementById('roundedCornersRadius').value;
        if (radius) {
            options.rounded_corners = parseInt(radius);
        }
    }
    
    // Advanced effects
    if (document.getElementById('enableVignette').checked) {
        const amount = document.getElementById('vignetteAmount').value;
        if (amount) {
            options.vignette = parseInt(amount);
        }
    }
    
    if (document.getElementById('enableShadow').checked) {
        const blur = document.getElementById('shadowBlur').value;
        const opacity = document.getElementById('shadowOpacity').value;
        const x = document.getElementById('shadowX').value;
        const y = document.getElementById('shadowY').value;
        
        options.shadow = {};
        if (blur) options.shadow.blur = parseInt(blur);
        if (opacity) options.shadow.opacity = parseInt(opacity);
        if (x) options.shadow.x = parseInt(x);
        if (y) options.shadow.y = parseInt(y);
    }
    
    if (document.getElementById('enableBorder').checked) {
        const width = document.getElementById('borderWidth').value;
        const color = document.getElementById('borderColor').value;
        
        options.border = {};
        if (width) options.border.width = parseInt(width);
        if (color) options.border.color = color;
    }
    
    if (document.getElementById('enableWatermark').checked) {
        const text = document.getElementById('watermarkText').value;
        const color = document.getElementById('watermarkColor').value;
        const size = document.getElementById('watermarkSize').value;
        
        if (text) {
            options.watermark = {};
            options.watermark.text = text;
            if (color) options.watermark.color = color;
            if (size) options.watermark.size = parseInt(size);
        }
    }
    
    // Output settings
    const format = document.getElementById('outputFormat').value;
    if (format !== 'auto') {
        options.output = { format: format };
    }
    
    const quality = document.getElementById('outputQuality').value;
    if (quality !== '80') {
        if (!options.output) options.output = {};
        options.output.quality = parseInt(quality);
    }
    
    const compress = document.getElementById('outputCompress').value;
    if (compress !== '80') {
        if (!options.output) options.output = {};
        options.output.compress = parseInt(compress);
    }
    
    return options;
}

// Generate JavaScript picker code
function generateJavaScriptPickerCode(options) {
    let code = `// Filestack Picker Configuration\n`;
    code += `const apikey = "${options.apiKey || 'YOUR_APIKEY'}";\n`;
    code += `const client = filestack.init(apikey);\n\n`;
    
    code += `const options = ${JSON.stringify(options, null, 2)};\n\n`;
    
    code += `const picker = client.picker(options);\n`;
    code += `picker.open();\n`;
    
    return code;
}

// Generate React picker code
function generateReactPickerCode(options) {
    let code = `// React Component with Filestack Picker\n`;
    code += `import React, { useEffect } from 'react';\n`;
    code += `import { filestack } from 'filestack-js';\n\n`;
    
    code += `const FilestackPicker = () => {\n`;
    code += `  useEffect(() => {\n`;
    code += `    const apikey = "${options.apiKey || 'YOUR_APIKEY'}";\n`;
    code += `    const client = filestack.init(apikey);\n\n`;
    
    code += `    const options = ${JSON.stringify(options, null, 4)};\n\n`;
    
    code += `    const picker = client.picker(options);\n`;
    code += `    picker.open();\n`;
    code += `  }, []);\n\n`;
    
    code += `  return (\n`;
    code += `    <div>\n`;
    code += `      <button onClick={() => picker.open()}>\n`;
    code += `        Open File Picker\n`;
    code += `      </button>\n`;
    code += `    </div>\n`;
    code += `  );\n`;
    code += `};\n\n`;
    
    code += `export default FilestackPicker;\n`;
    
    return code;
}

// Generate Vue picker code
function generateVuePickerCode(options) {
    let code = `<!-- Vue Component with Filestack Picker -->\n`;
    code += `<template>\n`;
    code += `  <div>\n`;
    code += `    <button @click="openPicker">Open File Picker</button>\n`;
    code += `  </div>\n`;
    code += `</template>\n\n`;
    
    code += `<script>\n`;
    code += `import { filestack } from 'filestack-js';\n\n`;
    code += `export default {\n`;
    code += `  name: 'FilestackPicker',\n`;
    code += `  data() {\n`;
    code += `    return {\n`;
    code += `      picker: null\n`;
    code += `    };\n`;
    code += `  },\n`;
    code += `  mounted() {\n`;
    code += `    const apikey = "${options.apiKey || 'YOUR_APIKEY'}";\n`;
    code += `    const client = filestack.init(apikey);\n\n`;
    
    code += `    const options = ${JSON.stringify(options, null, 4)};\n\n`;
    
    code += `    this.picker = client.picker(options);\n`;
    code += `  },\n`;
    code += `  methods: {\n`;
    code += `    openPicker() {\n`;
    code += `      this.picker.open();\n`;
    code += `    }\n`;
    code += `  }\n`;
    code += `};\n`;
    code += `</script>\n`;
    
    return code;
}

// Generate URL picker code
function generateURLPickerCode(options) {
    let code = `// Filestack Picker URL Configuration\n`;
    code += `const baseUrl = "https://www.filestackapi.com/api/file/";\n`;
    code += `const apikey = "${options.apiKey || 'YOUR_APIKEY'}";\n\n`;
    
    code += `// Picker options as URL parameters\n`;
    code += `const pickerUrl = \`\${baseUrl}\${apikey}/picker\`;\n`;
    code += `const options = ${JSON.stringify(options, null, 2)};\n\n`;
    
    code += `// Convert options to URL parameters\n`;
    code += `const params = new URLSearchParams();\n`;
    code += `Object.entries(options).forEach(([key, value]) => {\n`;
    code += `  params.append(key, JSON.stringify(value));\n`;
    code += `});\n\n`;
    
    code += `const fullUrl = \`\${pickerUrl}?\${params.toString()}\`;\n`;
    code += `console.log('Picker URL:', fullUrl);\n`;
    
    return code;
}

// Generate JavaScript transform code
function generateJavaScriptTransformCode(options) {
    let code = `// Filestack Image Transform\n`;
    code += `const apikey = "YOUR_APIKEY";\n`;
    code += `const client = filestack.init(apikey);\n\n`;
    
    if (options.handle) {
        code += `const handle = "${options.handle}";\n`;
    } else {
        code += `const handle = "YOUR_FILE_HANDLE";\n`;
    }
    
    code += `\nconst transformOptions = ${JSON.stringify(options, null, 2)};\n\n`;
    
    code += `// Method 1: Using transform method\n`;
    code += `const transformedUrl = client.transform(handle, transformOptions);\n`;
    code += `console.log('Transformed URL:', transformedUrl);\n\n`;
    
    code += `// Method 2: Using Filelink\n`;
    code += `const filelink = client.filelink(handle);\n`;
    code += `Object.entries(transformOptions).forEach(([key, value]) => {\n`;
    code += `  filelink[key](value);\n`;
    code += `});\n`;
    code += `const finalUrl = filelink.toString();\n`;
    code += `console.log('Final URL:', finalUrl);\n`;
    
    return code;
}

// Generate React transform code
function generateReactTransformCode(options) {
    let code = `// React Component with Filestack Transform\n`;
    code += `import React, { useState, useEffect } from 'react';\n`;
    code += `import { filestack } from 'filestack-js';\n\n`;
    
    code += `const FilestackTransform = () => {\n`;
    code += `  const [transformedUrl, setTransformedUrl] = useState('');\n\n`;
    
    code += `  useEffect(() => {\n`;
    code += `    const apikey = "YOUR_APIKEY";\n`;
    code += `    const client = filestack.init(apikey);\n`;
    
    if (options.handle) {
        code += `    const handle = "${options.handle}";\n`;
    } else {
        code += `    const handle = "YOUR_FILE_HANDLE";\n`;
    }
    
    code += `\n    const transformOptions = ${JSON.stringify(options, null, 4)};\n\n`;
    
    code += `    const url = client.transform(handle, transformOptions);\n`;
    code += `    setTransformedUrl(url);\n`;
    code += `  }, []);\n\n`;
    
    code += `  return (\n`;
    code += `    <div>\n`;
    code += `      {transformedUrl && (\n`;
    code += `        <img src={transformedUrl} alt="Transformed" />\n`;
    code += `      )}\n`;
    code += `    </div>\n`;
    code += `  );\n`;
    code += `};\n\n`;
    
    code += `export default FilestackTransform;\n`;
    
    return code;
}

// Generate Vue transform code
function generateVueTransformCode(options) {
    let code = `<!-- Vue Component with Filestack Transform -->\n`;
    code += `<template>\n`;
    code += `  <div>\n`;
    code += `    <img v-if="transformedUrl" :src="transformedUrl" alt="Transformed" />\n`;
    code += `  </div>\n`;
    code += `</template>\n\n`;
    
    code += `<script>\n`;
    code += `import { filestack } from 'filestack-js';\n\n`;
    code += `export default {\n`;
    code += `  name: 'FilestackTransform',\n`;
    code += `  data() {\n`;
    code += `    return {\n`;
    code += `      transformedUrl: ''\n`;
    code += `    };\n`;
    code += `  },\n`;
    code += `  mounted() {\n`;
    code += `    const apikey = "YOUR_APIKEY";\n`;
    code += `    const client = filestack.init(apikey);\n`;
    
    if (options.handle) {
        code += `    const handle = "${options.handle}";\n`;
    } else {
        code += `    const handle = "YOUR_FILE_HANDLE";\n`;
    }
    
    code += `\n    const transformOptions = ${JSON.stringify(options, null, 4)};\n\n`;
    
    code += `    const url = client.transform(handle, transformOptions);\n`;
    code += `    this.transformedUrl = url;\n`;
    code += `  }\n`;
    code += `};\n`;
    code += `</script>\n`;
    
    return code;
}

// Generate URL transform code
function generateURLTransformCode(options) {
    let code = `// Filestack Transform URL\n`;
    code += `const baseUrl = "https://cdn.filestackcontent.com/";\n`;
    
    if (options.handle) {
        code += `const handle = "${options.handle}";\n`;
    } else {
        code += `const handle = "YOUR_FILE_HANDLE";\n`;
    }
    
    code += `\nconst transformOptions = ${JSON.stringify(options, null, 2)};\n\n`;
    
    code += `// Build transform URL\n`;
    code += `let transformUrl = \`\${baseUrl}\${handle}\`;\n`;
    code += `\n// Add transformations\n`;
    code += `Object.entries(transformOptions).forEach(([key, value]) => {\n`;
    code += `  if (typeof value === 'object') {\n`;
    code += `    transformUrl += \`/\${key}/\${JSON.stringify(value)}\`;\n`;
    code += `  } else {\n`;
    code += `    transformUrl += \`/\${key}/\${value}\`;\n`;
    code += `  }\n`;
    code += `});\n\n`;
    
    code += `console.log('Transform URL:', transformUrl);\n`;
    
    return code;
}

// Update code display
function updateCodeDisplay(code, language) {
    const codeElement = document.getElementById('generatedCode');
    if (codeElement) {
        codeElement.textContent = code;
        
        // Set the language class for syntax highlighting
        const langClass = language === 'javascript' ? 'javascript' : 
                         language === 'react' ? 'jsx' : 
                         language === 'vue' ? 'vue' : 
                         language === 'url' ? 'javascript' : 'javascript';
        codeElement.className = `language-${langClass}`;
        
        // Re-highlight syntax
        if (typeof Prism !== 'undefined') {
            Prism.highlightElement(codeElement);
        }
    }
}

// Copy code to clipboard
function copyCode() {
    const codeElement = document.getElementById('generatedCode');
    if (codeElement) {
        const text = codeElement.textContent;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Code copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy code', 'error');
        });
    }
}

// Run code
function runCode() {
    if (currentSection === 'picker') {
        testPicker();
    } else if (currentSection === 'transform') {
        previewTransform();
    } else if (currentSection === 'upload') {
        testUpload();
    } else if (currentSection === 'download') {
        testDownload();
    } else if (currentSection === 'sfw') {
        testSfw();
    } else if (currentSection === 'tagging') {
        testTagging();
    } else if (currentSection === 'ocr') {
        testOcr();
    } else if (currentSection === 'faces') {
        testFaces();
    } else if (currentSection === 'security') {
        testSecurity();
    } else if (currentSection === 'store') {
        testStore();
    } else if (currentSection === 'metadata') {
        testMetadata();
    }
}

// Test picker
function testPicker() {
    const options = collectPickerOptions();
    
    if (!filestackClient) {
        showNotification('Filestack client not initialized. Please check your API key.', 'error');
        return;
    }
    
    try {
        if (currentPicker) {
            currentPicker.close();
        }
        
        currentPicker = filestackClient.picker(options);
        currentPicker.open();
        
        showNotification('Picker opened successfully!', 'success');
    } catch (error) {
        showNotification('Error opening picker: ' + error.message, 'error');
    }
}

// Preview transform
function previewTransform() {
    const options = collectTransformOptions();
    const handle = document.getElementById('transformHandle').value;
    
    if (!handle) {
        showNotification('Please enter a file handle or URL', 'error');
        return;
    }
    
    if (!filestackClient) {
        showNotification('Filestack client not initialized. Please check your API key.', 'error');
        return;
    }
    
    try {
        const transformedUrl = filestackClient.transform(handle, options);
        
        // Show preview modal
        const modal = document.getElementById('previewModal');
        const originalImage = document.getElementById('originalImage');
        const transformedImage = document.getElementById('transformedImage');
        
        if (modal && originalImage && transformedImage) {
            originalImage.src = handle.startsWith('http') ? handle : `https://cdn.filestackcontent.com/${handle}`;
            transformedImage.src = transformedUrl;
            modal.classList.add('active');
        }
        
        showNotification('Transform preview generated!', 'success');
    } catch (error) {
        showNotification('Error generating transform: ' + error.message, 'error');
    }
}

// Close preview modal
function closePreviewModal() {
    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Generate API key (demo function)
function generateApiKey() {
    const apiKeyInput = document.getElementById('globalApikey');
    const demoKey = 'demo_' + Math.random().toString(36).substr(2, 9);
    apiKeyInput.value = demoKey;
    showNotification('Demo API key generated!', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.background = '#28a745';
    } else if (type === 'error') {
        notification.style.background = '#dc3545';
    } else {
        notification.style.background = '#EF4A26';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('previewModal');
    if (modal && e.target === modal) {
        closePreviewModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePreviewModal();
    }
});

// ===== NEW SECTION FUNCTIONS =====

// Upload Functions
function generateUploadCode() {
    const options = collectUploadOptions();
    let code = '';
    
    switch (getCurrentTab()) {
        case 'javascript':
            code = generateJavaScriptUploadCode(options);
            break;
        case 'react':
            code = generateReactUploadCode(options);
            break;
        case 'vue':
            code = generateVueUploadCode(options);
            break;
        case 'url':
            code = generateURLUploadCode(options);
            break;
    }
    
    updateCodeDisplay(code, getCurrentTab());
}

function collectUploadOptions() {
    const options = {};
    
    const uploadPath = document.getElementById('uploadPath').value;
    if (uploadPath) {
        options.path = uploadPath;
    }
    
    const uploadAccess = document.getElementById('uploadAccess').value;
    if (uploadAccess !== 'public') {
        options.access = uploadAccess;
    }
    
    if (document.getElementById('uploadMetadata').checked) {
        options.metadata = true;
    }
    
    if (document.getElementById('uploadWorkflows').checked) {
        options.workflows = true;
    }
    
    if (document.getElementById('uploadIntelligence').checked) {
        options.intelligence = true;
    }
    
    return options;
}

function generateJavaScriptUploadCode(options) {
    return `// Upload file to Filestack
const file = document.getElementById('uploadFile').files[0];
if (!file) {
    console.error('Please select a file');
    return;
}

const client = filestack.init('YOUR_APIKEY');

client.upload(file, ${JSON.stringify(options, null, 2)})
    .then(response => {
        console.log('Upload successful:', response);
        // Handle successful upload
    })
    .catch(error => {
        console.error('Upload failed:', error);
        // Handle upload error
    });`;
}

function generateReactUploadCode(options) {
    return `import { filestack } from 'filestack-react';

const UploadComponent = () => {
    const client = filestack.init('YOUR_APIKEY');
    
    const handleUpload = async (file) => {
        try {
            const response = await client.upload(file, ${JSON.stringify(options, null, 2)});
            console.log('Upload successful:', response);
            // Handle successful upload
        } catch (error) {
            console.error('Upload failed:', error);
            // Handle upload error
        }
    };
    
    return (
        <input 
            type="file" 
            onChange={(e) => handleUpload(e.target.files[0])}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        />
    );
};`;
}

function generateVueUploadCode(options) {
    return `<template>
    <input 
        type="file" 
        @change="handleUpload"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
    />
</template>

<script>
import { filestack } from 'filestack-js';

export default {
    methods: {
        async handleUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const client = filestack.init('YOUR_APIKEY');
            
            try {
                const response = await client.upload(file, ${JSON.stringify(options, null, 2)});
                console.log('Upload successful:', response);
                // Handle successful upload
            } catch (error) {
                console.error('Upload failed:', error);
                // Handle upload error
            }
        }
    }
};
</script>`;
}

function generateURLUploadCode(options) {
    return `// Direct upload URL
const uploadUrl = 'https://www.filestackapi.com/api/store/S3?key=YOUR_APIKEY${Object.entries(options).map(([key, value]) => `&${key}=${encodeURIComponent(value)}`).join('')}';

// Use with fetch or XMLHttpRequest
fetch(uploadUrl, {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => console.log('Upload successful:', data))
.catch(error => console.error('Upload failed:', error));`;
}

function testUpload() {
    const fileInput = document.getElementById('uploadFile');
    if (!fileInput.files[0]) {
        showNotification('Please select a file to upload', 'error');
        return;
    }
    
    showNotification('Upload functionality would be tested here with a real API key', 'info');
}

// Download Functions
function generateDownloadCode() {
    const options = collectDownloadOptions();
    let code = '';
    
    switch (getCurrentTab()) {
        case 'javascript':
            code = generateJavaScriptDownloadCode(options);
            break;
        case 'react':
            code = generateReactDownloadCode(options);
            break;
        case 'vue':
            code = generateVueDownloadCode(options);
            break;
        case 'url':
            code = generateURLDownloadCode(options);
            break;
    }
    
    updateCodeDisplay(code, getCurrentTab());
}

function collectDownloadOptions() {
    const options = {};
    
    const handle = document.getElementById('downloadHandle').value;
    
    const filename = document.getElementById('downloadFilename').value;
    if (filename) {
        options.filename = filename;
    }
    
    const format = document.getElementById('downloadFormat').value;
    if (format !== 'original') {
        options.format = format;
    }
    
    if (document.getElementById('downloadTransform').checked) {
        options.transform = true;
    }
    
    if (document.getElementById('downloadMetadata').checked) {
        options.metadata = true;
    }
    
    if (document.getElementById('downloadSecure').checked) {
        options.secure = true;
    }
    
    return { ...options, handle: handle || 'YOUR_FILE_HANDLE' };
}

function generateJavaScriptDownloadCode(options) {
    const { handle, ...downloadOptions } = options;
    return `// Download file from Filestack
const client = filestack.init('YOUR_APIKEY');

client.download('${handle}', ${JSON.stringify(downloadOptions, null, 2)})
    .then(response => {
        console.log('Download successful:', response);
        // Handle successful download
    })
    .catch(error => {
        console.error('Download failed:', error);
        // Handle download error
    });`;
}

function generateReactDownloadCode(options) {
    const { handle, ...downloadOptions } = options;
    return `import { filestack } from 'filestack-react';

const DownloadComponent = () => {
    const client = filestack.init('YOUR_APIKEY');
    
    const handleDownload = async () => {
        try {
            const response = await client.download('${handle}', ${JSON.stringify(downloadOptions, null, 2)});
            console.log('Download successful:', response);
            // Handle successful download
        } catch (error) {
            console.error('Download failed:', error);
            // Handle download error
        }
    };
    
    return (
        <button onClick={handleDownload}>
            Download File
        </button>
    );
};`;
}

function generateVueDownloadCode(options) {
    const { handle, ...downloadOptions } = options;
    return `<template>
    <button @click="handleDownload">Download File</button>
</template>

<script>
import { filestack } from 'filestack-js';

export default {
    methods: {
        async handleDownload() {
            const client = filestack.init('YOUR_APIKEY');
            
            try {
                const response = await client.download('${handle}', ${JSON.stringify(downloadOptions, null, 2)});
                console.log('Download successful:', response);
                // Handle successful download
            } catch (error) {
                console.error('Download failed:', error);
                // Handle download error
            }
        }
    }
};
</script>`;
}

function generateURLDownloadCode(options) {
    const { handle, ...downloadOptions } = options;
    const params = Object.entries(downloadOptions).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    return `// Direct download URL
const downloadUrl = 'https://cdn.filestackcontent.com/${handle}${params ? '?' + params : ''}';

// Use with fetch or create download link
const link = document.createElement('a');
link.href = downloadUrl;
link.download = '${downloadOptions.filename || 'download'}';
link.click();`;
}

function testDownload() {
    const handle = document.getElementById('downloadHandle').value;
    if (!handle) {
        showNotification('Please enter a file handle or URL', 'error');
        return;
    }
    
    showNotification('Download functionality would be tested here with a real API key', 'info');
}

// Intelligence Functions
function generateSfwCode() {
    const options = collectSfwOptions();
    let code = '';
    
    switch (getCurrentTab()) {
        case 'javascript':
            code = generateJavaScriptSfwCode(options);
            break;
        case 'react':
            code = generateReactSfwCode(options);
            break;
        case 'vue':
            code = generateVueSfwCode(options);
            break;
        case 'url':
            code = generateURLSfwCode(options);
            break;
    }
    
    updateCodeDisplay(code, getCurrentTab());
}

function collectSfwOptions() {
    const options = {};
    
    const handle = document.getElementById('sfwHandle').value;
    
    const threshold = document.getElementById('sfwThreshold').value;
    if (threshold !== '50') {
        options.threshold = parseInt(threshold);
    }
    
    const detections = [];
    if (document.getElementById('sfwNudity').checked) detections.push('nudity');
    if (document.getElementById('sfwViolence').checked) detections.push('violence');
    if (document.getElementById('sfwDrugs').checked) detections.push('drugs');
    if (document.getElementById('sfwHate').checked) detections.push('hate');
    
    if (detections.length > 0) {
        options.detections = detections;
    }
    
    return { ...options, handle: handle || 'YOUR_FILE_HANDLE' };
}

function generateJavaScriptSfwCode(options) {
    const { handle, ...sfwOptions } = options;
    return `// Safe for Work detection
const client = filestack.init('YOUR_APIKEY');

client.sfw('${handle}', ${JSON.stringify(sfwOptions, null, 2)})
    .then(response => {
        console.log('SFW analysis:', response);
        // Handle SFW results
    })
    .catch(error => {
        console.error('SFW analysis failed:', error);
        // Handle error
    });`;
}

function generateReactSfwCode(options) {
    const { handle, ...sfwOptions } = options;
    return `import { filestack } from 'filestack-react';

const SfwComponent = () => {
    const client = filestack.init('YOUR_APIKEY');
    
    const analyzeSfw = async () => {
        try {
            const response = await client.sfw('${handle}', ${JSON.stringify(sfwOptions, null, 2)});
            console.log('SFW analysis:', response);
            // Handle SFW results
        } catch (error) {
            console.error('SFW analysis failed:', error);
            // Handle error
        }
    };
    
    return (
        <button onClick={analyzeSfw}>
            Analyze Content Safety
        </button>
    );
};`;
}

function generateVueSfwCode(options) {
    const { handle, ...sfwOptions } = options;
    return `<template>
    <button @click="analyzeSfw">Analyze Content Safety</button>
</template>

<script>
import { filestack } from 'filestack-js';

export default {
    methods: {
        async analyzeSfw() {
            const client = filestack.init('YOUR_APIKEY');
            
            try {
                const response = await client.sfw('${handle}', ${JSON.stringify(sfwOptions, null, 2)});
                console.log('SFW analysis:', response);
                // Handle SFW results
            } catch (error) {
                console.error('SFW analysis failed:', error);
                // Handle error
            }
        }
    }
};
</script>`;
}

function generateURLSfwCode(options) {
    const { handle, ...sfwOptions } = options;
    const params = Object.entries(sfwOptions).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    return `// SFW analysis URL
const sfwUrl = 'https://www.filestackapi.com/api/sfw/${handle}?key=YOUR_APIKEY${params ? '&' + params : ''}';

fetch(sfwUrl)
    .then(response => response.json())
    .then(data => console.log('SFW analysis:', data))
    .catch(error => console.error('SFW analysis failed:', error));`;
}

function testSfw() {
    const handle = document.getElementById('sfwHandle').value;
    if (!handle) {
        showNotification('Please enter a file handle or URL', 'error');
        return;
    }
    
    showNotification('SFW analysis would be tested here with a real API key', 'info');
}

// Tagging Functions
function generateTaggingCode() {
    const options = collectTaggingOptions();
    let code = '';
    
    switch (getCurrentTab()) {
        case 'javascript':
            code = generateJavaScriptTaggingCode(options);
            break;
        case 'react':
            code = generateReactTaggingCode(options);
            break;
        case 'vue':
            code = generateVueTaggingCode(options);
            break;
        case 'url':
            code = generateURLTaggingCode(options);
            break;
    }
    
    updateCodeDisplay(code, getCurrentTab());
}

function collectTaggingOptions() {
    const options = {};
    
    const handle = document.getElementById('taggingHandle').value;
    
    const limit = document.getElementById('taggingLimit').value;
    if (limit !== '10') {
        options.limit = parseInt(limit);
    }
    
    const types = [];
    if (document.getElementById('taggingObjects').checked) types.push('objects');
    if (document.getElementById('taggingScenes').checked) types.push('scenes');
    if (document.getElementById('taggingFaces').checked) types.push('faces');
    if (document.getElementById('taggingText').checked) types.push('text');
    
    if (types.length > 0) {
        options.types = types;
    }
    
    return { ...options, handle: handle || 'YOUR_FILE_HANDLE' };
}

function generateJavaScriptTaggingCode(options) {
    const { handle, ...taggingOptions } = options;
    return `// Image tagging
const client = filestack.init('YOUR_APIKEY');

client.tags('${handle}', ${JSON.stringify(taggingOptions, null, 2)})
    .then(response => {
        console.log('Tags:', response);
        // Handle tagging results
    })
    .catch(error => {
        console.error('Tagging failed:', error);
        // Handle error
    });`;
}

function generateReactTaggingCode(options) {
    const { handle, ...taggingOptions } = options;
    return `import { filestack } from 'filestack-react';

const TaggingComponent = () => {
    const client = filestack.init('YOUR_APIKEY');
    
    const generateTags = async () => {
        try {
            const response = await client.tags('${handle}', ${JSON.stringify(taggingOptions, null, 2)});
            console.log('Tags:', response);
            // Handle tagging results
        } catch (error) {
            console.error('Tagging failed:', error);
            // Handle error
        }
    };
    
    return (
        <button onClick={generateTags}>
            Generate Tags
        </button>
    );
};`;
}

function generateVueTaggingCode(options) {
    const { handle, ...taggingOptions } = options;
    return `<template>
    <button @click="generateTags">Generate Tags</button>
</template>

<script>
import { filestack } from 'filestack-js';

export default {
    methods: {
        async generateTags() {
            const client = filestack.init('YOUR_APIKEY');
            
            try {
                const response = await client.tags('${handle}', ${JSON.stringify(taggingOptions, null, 2)});
                console.log('Tags:', response);
                // Handle tagging results
            } catch (error) {
                console.error('Tagging failed:', error);
                // Handle error
            }
        }
    }
};
</script>`;
}

function generateURLTaggingCode(options) {
    const { handle, ...taggingOptions } = options;
    const params = Object.entries(taggingOptions).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    return `// Tagging URL
const taggingUrl = 'https://www.filestackapi.com/api/tags/${handle}?key=YOUR_APIKEY${params ? '&' + params : ''}';

fetch(taggingUrl)
    .then(response => response.json())
    .then(data => console.log('Tags:', data))
    .catch(error => console.error('Tagging failed:', error));`;
}

function testTagging() {
    const handle = document.getElementById('taggingHandle').value;
    if (!handle) {
        showNotification('Please enter a file handle or URL', 'error');
        return;
    }
    
    showNotification('Tagging would be tested here with a real API key', 'info');
}

// OCR Functions
function generateOcrCode() {
    const options = collectOcrOptions();
    let code = '';
    
    switch (getCurrentTab()) {
        case 'javascript':
            code = generateJavaScriptOcrCode(options);
            break;
        case 'react':
            code = generateReactOcrCode(options);
            break;
        case 'vue':
            code = generateVueOcrCode(options);
            break;
        case 'url':
            code = generateURLOcrCode(options);
            break;
    }
    
    updateCodeDisplay(code, getCurrentTab());
}

function collectOcrOptions() {
    const options = {};
    
    const handle = document.getElementById('ocrHandle').value;
    
    const language = document.getElementById('ocrLanguage').value;
    if (language !== 'en') {
        options.language = language;
    }
    
    if (document.getElementById('ocrCoordinates').checked) {
        options.coordinates = true;
    }
    
    if (document.getElementById('ocrConfidence').checked) {
        options.confidence = true;
    }
    
    if (document.getElementById('ocrWords').checked) {
        options.words = true;
    }
    
    if (document.getElementById('ocrLines').checked) {
        options.lines = true;
    }
    
    return { ...options, handle: handle || 'YOUR_FILE_HANDLE' };
}

function generateJavaScriptOcrCode(options) {
    const { handle, ...ocrOptions } = options;
    return `// OCR text extraction
const client = filestack.init('YOUR_APIKEY');

client.ocr('${handle}', ${JSON.stringify(ocrOptions, null, 2)})
    .then(response => {
        console.log('OCR results:', response);
        // Handle OCR results
    })
    .catch(error => {
        console.error('OCR failed:', error);
        // Handle error
    });`;
}

function generateReactOcrCode(options) {
    const { handle, ...ocrOptions } = options;
    return `import { filestack } from 'filestack-react';

const OcrComponent = () => {
    const client = filestack.init('YOUR_APIKEY');
    
    const extractText = async () => {
        try {
            const response = await client.ocr('${handle}', ${JSON.stringify(ocrOptions, null, 2)});
            console.log('OCR results:', response);
            // Handle OCR results
        } catch (error) {
            console.error('OCR failed:', error);
            // Handle error
        }
    };
    
    return (
        <button onClick={extractText}>
            Extract Text
        </button>
    );
};`;
}

function generateVueOcrCode(options) {
    const { handle, ...ocrOptions } = options;
    return `<template>
    <button @click="extractText">Extract Text</button>
</template>

<script>
import { filestack } from 'filestack-js';

export default {
    methods: {
        async extractText() {
            const client = filestack.init('YOUR_APIKEY');
            
            try {
                const response = await client.ocr('${handle}', ${JSON.stringify(ocrOptions, null, 2)});
                console.log('OCR results:', response);
                // Handle OCR results
            } catch (error) {
                console.error('OCR failed:', error);
                // Handle error
            }
        }
    }
};
</script>`;
}

function generateURLOcrCode(options) {
    const { handle, ...ocrOptions } = options;
    const params = Object.entries(ocrOptions).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    return `// OCR URL
const ocrUrl = 'https://www.filestackapi.com/api/ocr/${handle}?key=YOUR_APIKEY${params ? '&' + params : ''}';

fetch(ocrUrl)
    .then(response => response.json())
    .then(data => console.log('OCR results:', data))
    .catch(error => console.error('OCR failed:', error));`;
}

function testOcr() {
    const handle = document.getElementById('ocrHandle').value;
    if (!handle) {
        showNotification('Please enter a file handle or URL', 'error');
        return;
    }
    
    showNotification('OCR would be tested here with a real API key', 'info');
}

// Face Detection Functions
function generateFacesCode() {
    const options = collectFacesOptions();
    let code = '';
    
    switch (getCurrentTab()) {
        case 'javascript':
            code = generateJavaScriptFacesCode(options);
            break;
        case 'react':
            code = generateReactFacesCode(options);
            break;
        case 'vue':
            code = generateVueFacesCode(options);
            break;
        case 'url':
            code = generateURLFacesCode(options);
            break;
    }
    
    updateCodeDisplay(code, getCurrentTab());
}

function collectFacesOptions() {
    const options = {};
    
    const handle = document.getElementById('facesHandle').value;
    
    const limit = document.getElementById('facesLimit').value;
    if (limit !== '10') {
        options.limit = parseInt(limit);
    }
    
    const attributes = [];
    if (document.getElementById('facesAttributes').checked) attributes.push('attributes');
    if (document.getElementById('facesLandmarks').checked) attributes.push('landmarks');
    if (document.getElementById('facesAge').checked) attributes.push('age');
    if (document.getElementById('facesGender').checked) attributes.push('gender');
    if (document.getElementById('facesEmotion').checked) attributes.push('emotion');
    
    if (attributes.length > 0) {
        options.attributes = attributes;
    }
    
    return { ...options, handle: handle || 'YOUR_FILE_HANDLE' };
}

function generateJavaScriptFacesCode(options) {
    const { handle, ...facesOptions } = options;
    return `// Face detection
const client = filestack.init('YOUR_APIKEY');

client.faces('${handle}', ${JSON.stringify(facesOptions, null, 2)})
    .then(response => {
        console.log('Face detection results:', response);
        // Handle face detection results
    })
    .catch(error => {
        console.error('Face detection failed:', error);
        // Handle error
    });`;
}

function generateReactFacesCode(options) {
    const { handle, ...facesOptions } = options;
    return `import { filestack } from 'filestack-react';

const FacesComponent = () => {
    const client = filestack.init('YOUR_APIKEY');
    
    const detectFaces = async () => {
        try {
            const response = await client.faces('${handle}', ${JSON.stringify(facesOptions, null, 2)});
            console.log('Face detection results:', response);
            // Handle face detection results
        } catch (error) {
            console.error('Face detection failed:', error);
            // Handle error
        }
    };
    
    return (
        <button onClick={detectFaces}>
            Detect Faces
        </button>
    );
};`;
}

function generateVueFacesCode(options) {
    const { handle, ...facesOptions } = options;
    return `<template>
    <button @click="detectFaces">Detect Faces</button>
</template>

<script>
import { filestack } from 'filestack-js';

export default {
    methods: {
        async detectFaces() {
            const client = filestack.init('YOUR_APIKEY');
            
            try {
                const response = await client.faces('${handle}', ${JSON.stringify(facesOptions, null, 2)});
                console.log('Face detection results:', response);
                // Handle face detection results
            } catch (error) {
                console.error('Face detection failed:', error);
                // Handle error
            }
        }
    }
};
</script>`;
}

function generateURLFacesCode(options) {
    const { handle, ...facesOptions } = options;
    const params = Object.entries(facesOptions).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    return `// Face detection URL
const facesUrl = 'https://www.filestackapi.com/api/faces/${handle}?key=YOUR_APIKEY${params ? '&' + params : ''}';

fetch(facesUrl)
    .then(response => response.json())
    .then(data => console.log('Face detection results:', data))
    .catch(error => console.error('Face detection failed:', error));`;
}

function testFaces() {
    const handle = document.getElementById('facesHandle').value;
    if (!handle) {
        showNotification('Please enter a file handle or URL', 'error');
        return;
    }
    
    showNotification('Face detection would be tested here with a real API key', 'info');
}

// Security Functions
function generateSecurityCode() {
    const options = collectSecurityOptions();
    let code = '';
    
    switch (getCurrentTab()) {
        case 'javascript':
            code = generateJavaScriptSecurityCode(options);
            break;
        case 'react':
            code = generateReactSecurityCode(options);
            break;
        case 'vue':
            code = generateVueSecurityCode(options);
            break;
        case 'url':
            code = generateURLSecurityCode(options);
            break;
    }
    
    updateCodeDisplay(code, getCurrentTab());
}

function collectSecurityOptions() {
    const options = {};
    
    const policy = document.getElementById('securityPolicy').value;
    if (policy) {
        try {
            options.policy = JSON.parse(policy);
        } catch (e) {
            showNotification('Invalid JSON in security policy', 'error');
            return options;
        }
    }
    
    const signature = document.getElementById('securitySignature').value;
    if (signature) {
        options.signature = signature;
    }
    
    const expiry = document.getElementById('securityExpiry').value;
    if (expiry && expiry !== '3600') {
        options.expiry = parseInt(expiry);
    }
    
    if (document.getElementById('securityCall').checked) {
        options.callLimits = true;
    }
    
    if (document.getElementById('securityPath').checked) {
        options.pathRestrictions = true;
    }
    
    if (document.getElementById('securityTransform').checked) {
        options.transformRestrictions = true;
    }
    
    return options;
}

function generateJavaScriptSecurityCode(options) {
    return `// Security configuration
const client = filestack.init('YOUR_APIKEY', ${JSON.stringify(options, null, 2)});

// Now all operations will use the security policy
client.picker()
    .then(response => {
        console.log('Secure picker response:', response);
    })
    .catch(error => {
        console.error('Secure picker failed:', error);
    });`;
}

function generateReactSecurityCode(options) {
    return `import { filestack } from 'filestack-react';

const SecureComponent = () => {
    const client = filestack.init('YOUR_APIKEY', ${JSON.stringify(options, null, 2)});
    
    const openSecurePicker = async () => {
        try {
            const response = await client.picker();
            console.log('Secure picker response:', response);
        } catch (error) {
            console.error('Secure picker failed:', error);
        }
    };
    
    return (
        <button onClick={openSecurePicker}>
            Open Secure Picker
        </button>
    );
};`;
}

function generateVueSecurityCode(options) {
    return `<template>
    <button @click="openSecurePicker">Open Secure Picker</button>
</template>

<script>
import { filestack } from 'filestack-js';

export default {
    methods: {
        async openSecurePicker() {
            const client = filestack.init('YOUR_APIKEY', ${JSON.stringify(options, null, 2)});
            
            try {
                const response = await client.picker();
                console.log('Secure picker response:', response);
            } catch (error) {
                console.error('Secure picker failed:', error);
            }
        }
    }
};
</script>`;
}

function generateURLSecurityCode(options) {
    const params = Object.entries(options).map(([key, value]) => `${key}=${encodeURIComponent(JSON.stringify(value))}`).join('&');
    return `// Secure URL with policy
const secureUrl = 'https://www.filestackapi.com/api/picker?key=YOUR_APIKEY${params ? '&' + params : ''}';

// Use this URL with security policy applied
console.log('Secure picker URL:', secureUrl);`;
}

function testSecurity() {
    const policy = document.getElementById('securityPolicy').value;
    if (!policy) {
        showNotification('Please enter a security policy', 'error');
        return;
    }
    
    showNotification('Security configuration would be tested here with a real API key', 'info');
}

// Store Functions
function generateStoreCode() {
    const options = collectStoreOptions();
    let code = '';
    
    switch (getCurrentTab()) {
        case 'javascript':
            code = generateJavaScriptStoreCode(options);
            break;
        case 'react':
            code = generateReactStoreCode(options);
            break;
        case 'vue':
            code = generateVueStoreCode(options);
            break;
        case 'url':
            code = generateURLStoreCode(options);
            break;
    }
    
    updateCodeDisplay(code, getCurrentTab());
}

function collectStoreOptions() {
    const options = {};
    
    const location = document.getElementById('storeLocation').value;
    if (location !== 's3') {
        options.location = location;
    }
    
    const path = document.getElementById('storePath').value;
    if (path) {
        options.path = path;
    }
    
    const access = document.getElementById('storeAccess').value;
    if (access !== 'public') {
        options.access = access;
    }
    
    if (document.getElementById('storeMetadata').checked) {
        options.metadata = true;
    }
    
    if (document.getElementById('storeWorkflows').checked) {
        options.workflows = true;
    }
    
    if (document.getElementById('storeVersioning').checked) {
        options.versioning = true;
    }
    
    return options;
}

function generateJavaScriptStoreCode(options) {
    return `// Store configuration
const client = filestack.init('YOUR_APIKEY');

client.picker({
    storeTo: ${JSON.stringify(options, null, 2)}
})
.then(response => {
    console.log('Store response:', response);
    // Handle store response
})
.catch(error => {
    console.error('Store failed:', error);
    // Handle error
});`;
}

function generateReactStoreCode(options) {
    return `import { filestack } from 'filestack-react';

const StoreComponent = () => {
    const client = filestack.init('YOUR_APIKEY');
    
    const openStorePicker = async () => {
        try {
            const response = await client.picker({
                storeTo: ${JSON.stringify(options, null, 2)}
            });
            console.log('Store response:', response);
            // Handle store response
        } catch (error) {
            console.error('Store failed:', error);
            // Handle error
        }
    };
    
    return (
        <button onClick={openStorePicker}>
            Open Store Picker
        </button>
    );
};`;
}

function generateVueStoreCode(options) {
    return `<template>
    <button @click="openStorePicker">Open Store Picker</button>
</template>

<script>
import { filestack } from 'filestack-js';

export default {
    methods: {
        async openStorePicker() {
            const client = filestack.init('YOUR_APIKEY');
            
            try {
                const response = await client.picker({
                    storeTo: ${JSON.stringify(options, null, 2)}
                });
                console.log('Store response:', response);
                // Handle store response
            } catch (error) {
                console.error('Store failed:', error);
                // Handle error
            }
        }
    }
};
</script>`;
}

function generateURLStoreCode(options) {
    const params = Object.entries(options).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    return `// Store URL
const storeUrl = 'https://www.filestackapi.com/api/store/S3?key=YOUR_APIKEY${params ? '&' + params : ''}';

// Use with picker or direct upload
console.log('Store configuration URL:', storeUrl);`;
}

function testStore() {
    showNotification('Store configuration would be tested here with a real API key', 'info');
}

// Metadata Functions
function generateMetadataCode() {
    const options = collectMetadataOptions();
    let code = '';
    
    switch (getCurrentTab()) {
        case 'javascript':
            code = generateJavaScriptMetadataCode(options);
            break;
        case 'react':
            code = generateReactMetadataCode(options);
            break;
        case 'vue':
            code = generateVueMetadataCode(options);
            break;
        case 'url':
            code = generateURLMetadataCode(options);
            break;
    }
    
    updateCodeDisplay(code, getCurrentTab());
}

function collectMetadataOptions() {
    const options = {};
    
    const handle = document.getElementById('metadataHandle').value;
    
    const types = [];
    if (document.getElementById('metadataBasic').checked) types.push('basic');
    if (document.getElementById('metadataExif').checked) types.push('exif');
    if (document.getElementById('metadataColor').checked) types.push('color');
    if (document.getElementById('metadataGeolocation').checked) types.push('geolocation');
    
    if (types.length > 0) {
        options.types = types;
    }
    
    return { ...options, handle: handle || 'YOUR_FILE_HANDLE' };
}

function generateJavaScriptMetadataCode(options) {
    const { handle, ...metadataOptions } = options;
    return `// Metadata extraction
const client = filestack.init('YOUR_APIKEY');

client.metadata('${handle}', ${JSON.stringify(metadataOptions, null, 2)})
    .then(response => {
        console.log('Metadata:', response);
        // Handle metadata results
    })
    .catch(error => {
        console.error('Metadata extraction failed:', error);
        // Handle error
    });`;
}

function generateReactMetadataCode(options) {
    const { handle, ...metadataOptions } = options;
    return `import { filestack } from 'filestack-react';

const MetadataComponent = () => {
    const client = filestack.init('YOUR_APIKEY');
    
    const extractMetadata = async () => {
        try {
            const response = await client.metadata('${handle}', ${JSON.stringify(metadataOptions, null, 2)});
            console.log('Metadata:', response);
            // Handle metadata results
        } catch (error) {
            console.error('Metadata extraction failed:', error);
            // Handle error
        }
    };
    
    return (
        <button onClick={extractMetadata}>
            Extract Metadata
        </button>
    );
};`;
}

function generateVueMetadataCode(options) {
    const { handle, ...metadataOptions } = options;
    return `<template>
    <button @click="extractMetadata">Extract Metadata</button>
</template>

<script>
import { filestack } from 'filestack-js';

export default {
    methods: {
        async extractMetadata() {
            const client = filestack.init('YOUR_APIKEY');
            
            try {
                const response = await client.metadata('${handle}', ${JSON.stringify(metadataOptions, null, 2)});
                console.log('Metadata:', response);
                // Handle metadata results
            } catch (error) {
                console.error('Metadata extraction failed:', error);
                // Handle error
            }
        }
    }
};
</script>`;
}

function generateURLMetadataCode(options) {
    const { handle, ...metadataOptions } = options;
    const params = Object.entries(metadataOptions).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    return `// Metadata URL
const metadataUrl = 'https://www.filestackapi.com/api/metadata/${handle}?key=YOUR_APIKEY${params ? '&' + params : ''}';

fetch(metadataUrl)
    .then(response => response.json())
    .then(data => console.log('Metadata:', data))
    .catch(error => console.error('Metadata extraction failed:', error));`;
}

function testMetadata() {
    const handle = document.getElementById('metadataHandle').value;
    if (!handle) {
        showNotification('Please enter a file handle or URL', 'error');
        return;
    }
    
    showNotification('Metadata extraction would be tested here with a real API key', 'info');
}

// Utility function to get current tab
function getCurrentTab() {
    const activeTab = document.querySelector('.tab-btn.active');
    return activeTab ? activeTab.getAttribute('data-tab') : 'javascript';
}

// Setup range slider for SFW threshold
document.addEventListener('DOMContentLoaded', function() {
    const sfwThreshold = document.getElementById('sfwThreshold');
    const sfwThresholdValue = document.getElementById('sfwThresholdValue');
    
    if (sfwThreshold && sfwThresholdValue) {
        sfwThreshold.addEventListener('input', function() {
            sfwThresholdValue.textContent = this.value + '%';
        });
    }

    // Initialize AI generator vector database check
    checkAIVectorDatabase();
});

// AI Code Generator Functions
let vectorDbConnected = false;

// Dynamic Qdrant URL detection
function getQdrantUrl() {
    // Check if we're on a custom domain or ngrok
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:6333';
    } else {
        // For production/ngrok, prompt user for Qdrant URL
        const savedUrl = localStorage.getItem('qdrantUrl');
        if (savedUrl) return savedUrl;
        
        const customUrl = prompt(
            'Please enter your Qdrant database URL:\n\n' +
            'For ngrok: https://your-qdrant-tunnel.ngrok.io\n' +
            'For Qdrant Cloud: https://your-cluster.qdrant.io\n' +
            'For self-hosted: https://your-server.com:6333'
        );
        
        if (customUrl) {
            localStorage.setItem('qdrantUrl', customUrl);
            return customUrl;
        }
        
        return 'http://localhost:6333'; // fallback
    }
}

async function checkAIVectorDatabase() {
    try {
        const qdrantUrl = getQdrantUrl();
        const response = await fetch(`${qdrantUrl}/collections`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            const data = await response.json();
            const hasCollection = data.result && data.result.collections && 
                                data.result.collections.some(c => c.name === 'filestack_docs');
            
            if (hasCollection) {
                showAIStatus('✅ Vector database connected and ready!', 'success');
                vectorDbConnected = true;
            } else {
                showAIStatus('❌ Collection "filestack_docs" not found. Run: npm run index', 'error');
            }
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('Vector DB check failed:', error);
        showAIStatus('❌ Cannot connect to vector database. Make sure Qdrant is running on localhost:6333', 'error');
        
        // Retry after 5 seconds
        setTimeout(checkAIVectorDatabase, 5000);
    }
}

function showAIStatus(message, type) {
    const status = document.getElementById('aiStatus');
    if (status) {
        status.textContent = message;
        status.className = `alert ${type}`;
        status.style.display = 'block';
    }
}

async function generateAICode() {
    const openaiKey = document.getElementById('openaiApiKey').value.trim();
    const query = document.getElementById('aiQuery').value.trim();
    
    if (!openaiKey) {
        showAIStatus('❌ Please enter your OpenAI API key', 'error');
        return;
    }
    
    if (!query) {
        showAIStatus('❌ Please describe what you want to build', 'error');
        return;
    }
    
    if (!vectorDbConnected) {
        showAIStatus('❌ Vector database not connected', 'error');
        return;
    }
    
    const generateBtn = document.getElementById('aiGenerateBtn');
    const loading = document.getElementById('aiLoading');
    const outputContainer = document.getElementById('aiOutputContainer');
    
    generateBtn.disabled = true;
    loading.style.display = 'block';
    outputContainer.style.display = 'none';
    
    try {
        // Step 1: Get embedding for the query
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
                model: 'text-embedding-3-large',
                input: query
            })
        });
        
        if (!embeddingResponse.ok) {
            throw new Error('Failed to get embedding from OpenAI');
        }
        
        const embeddingData = await embeddingResponse.json();
        const queryEmbedding = embeddingData.data[0].embedding;
        
        // Step 2: Search vector database
        const qdrantUrl = getQdrantUrl();
        const searchResponse = await fetch(`${qdrantUrl}/collections/filestack_docs/points/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                vector: queryEmbedding,
                limit: 3,
                with_payload: true,
                with_vectors: false
            })
        });
        
        if (!searchResponse.ok) {
            throw new Error('Failed to search vector database');
        }
        
        const searchData = await searchResponse.json();
        const results = searchData.result || [];
        
        // Step 3: Build context from search results
        let context = "Relevant Filestack documentation:\\n\\n";
        results.forEach((result, index) => {
            const payload = result.payload || {};
            context += `${index + 1}. ${payload.title || 'Unknown'} (Score: ${(result.score * 100).toFixed(1)}%)\\n`;
            context += `${(payload.content || '').substring(0, 800)}...\\n\\n`;
        });
        
        // Step 4: Generate code with OpenAI
        const codeResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert Filestack developer. For filestack-js imports: In Node use CommonJS: const client = require("filestack-js").init("apikey"); In browsers use ES6: import * as filestack from "filestack-js"; const client = filestack.init("apikey"); Default to browser ES6 syntax unless specified as Node. Use ES6+ for everything else. CRITICAL STRUCTURE RULES: 1) pickerOptions contains ONLY picker configuration (fromSources, onUploadDone, accept, etc.) - ABSOLUTELY NEVER put transformOptions inside pickerOptions. 2) transformOptions MUST be defined as a separate const object OUTSIDE of pickerOptions and onUploadDone callback, at the top level. 3) Apply transformations using client.transform(fileUrl, transformOptions).toString() INSIDE the onUploadDone callback. 4) Always use variable names "pickerOptions" and "transformOptions". 5) Use exact parameter formats from documentation (crop: { dim: [x,y,w,h] }, rotate: { deg: 90 }). CRITICAL BOOLEAN vs OBJECT RULE: Many transforms support BOTH boolean true and object forms. Examples: sepia: true (simple) OR sepia: { tone: 80 } (with params). Others: blur: true OR blur: { amount: 5 }, sharpen: true OR sharpen: { amount: 3 }, etc. Use the simple boolean form when no specific parameters are needed, use object form when parameters are specified. 6) Always console.log original and transformed URLs. 7) Add event listener: document.getElementById("uploadButton").addEventListener("click", () => { client.picker(pickerOptions).open(); }). 8) IMPORTANT: When using client.transform(), the original file URL must be passed as the first parameter. This creates chained transformation URLs like: https://cdn.filestackcontent.com/API_KEY/transform1/transform2/"ORIGINAL_FILE_URL". Note: For chained transformations, the source file URL must be quoted and placed at the end. Never guess parameter names or values - stick precisely to documentation. CRITICAL: Use EXACT parameter names and values from the provided documentation context - never modify, abbreviate, or add underscores/hyphens. For example: use 'googledrive' not 'google_drive', use 'local_file_system' not 'local_file', etc. Provide working code examples.'
                    },
                    {
                        role: 'user',
                        content: `Query: ${query}\\n\\nContext from documentation:\\n${context}\\n\\nGenerate complete, working code with examples.`
                    }
                ],
                max_tokens: 8000,
                temperature: 0.2
            })
        });
        
        if (!codeResponse.ok) {
            throw new Error('Failed to generate code from OpenAI');
        }
        
        const codeData = await codeResponse.json();
        let generatedCode = codeData.choices[0].message.content;
        
        // Format the response
        generatedCode = formatAICodeResponse(generatedCode);
        
        // Show results
        document.getElementById('aiCodeOutput').innerHTML = generatedCode;
        outputContainer.style.display = 'block';
        
        // Show sources in separate container
        if (results.length > 0) {
            const sourcesHtml = generateSourcesHtml(results);
            document.getElementById('aiSources').innerHTML = sourcesHtml;
            document.getElementById('aiSourcesContainer').style.display = 'block';
        }
        
        showAIStatus(`✅ Code generated successfully! Used ${results.length} documentation sources.`, 'success');
        
    } catch (error) {
        console.error('Generation failed:', error);
        showAIStatus(`❌ Error: ${error.message}`, 'error');
    } finally {
        generateBtn.disabled = false;
        loading.style.display = 'none';
    }
}

function formatAICodeResponse(response) {
    // Convert markdown-style code blocks to HTML with proper indentation
    let formatted = response.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
        const formattedCode = formatJavaScriptCode(code.trim());
        return `<pre><code class="language-${language || 'javascript'}">${escapeHtml(formattedCode)}</code></pre>`;
    });
    
    // Convert inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline">$1</code>');
    
    // Convert headers
    formatted = formatted.replace(/### (.*$)/gm, '<h3>$1</h3>');
    
    // Convert paragraphs
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = '<p>' + formatted + '</p>';
    
    // Clean up empty paragraphs
    formatted = formatted.replace(/<p><\/p>/g, '');
    formatted = formatted.replace(/<p>(<h3>.*<\/h3>)<\/p>/g, '$1');
    formatted = formatted.replace(/<p>(<pre>.*<\/pre>)<\/p>/gs, '$1');
    
    return formatted;
}

function formatJavaScriptCode(code) {
    // Basic JavaScript code formatting
    const lines = code.split('\n');
    let indentLevel = 0;
    let formattedLines = [];
    
    for (let line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            formattedLines.push('');
            continue;
        }
        
        // Decrease indent for closing brackets
        if (trimmedLine.match(/^[\}\]]/)) {
            indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // Add indentation
        const indentedLine = '  '.repeat(indentLevel) + trimmedLine;
        formattedLines.push(indentedLine);
        
        // Increase indent for opening brackets
        if (trimmedLine.match(/[\{\[]$/) && !trimmedLine.match(/\}[\s,]*$/)) {
            indentLevel++;
        }
    }
    
    return formattedLines.join('\n');
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function generateSourcesHtml(results) {
    if (!results || results.length === 0) return '';
    
    let sourcesHtml = '<h4>📚 Sources Used:</h4><ul class="sources-list">';
    
    results.forEach((result, index) => {
        const payload = result.payload || {};
        const title = payload.title || 'Unknown';
        const filename = payload.filename || '';
        const score = (result.score * 100).toFixed(1);
        
        // Generate documentation URL based on filename
        let docUrl = '';
        if (filename) {
            const baseUrl = 'https://filestack.github.io/filestack-js/';
            if (filename.includes('__classes__')) {
                const className = filename.split('__classes__')[1].replace('.html.json', '');
                docUrl = `${baseUrl}classes/${className}.html`;
            } else if (filename.includes('__interfaces__')) {
                const interfaceName = filename.split('__interfaces__')[1].replace('.html.json', '');
                docUrl = `${baseUrl}interfaces/${interfaceName}.html`;
            } else if (filename.includes('__enums__')) {
                const enumName = filename.split('__enums__')[1].replace('.html.json', '');
                docUrl = `${baseUrl}enums/${enumName}.html`;
            } else if (filename.includes('__functions__')) {
                const functionName = filename.split('__functions__')[1].replace('.html.json', '');
                docUrl = `${baseUrl}functions/${functionName}.html`;
            } else {
                docUrl = baseUrl; // Fallback to main docs
            }
        }
        
        sourcesHtml += `<li class="source-item">
            <strong>${title}</strong> 
            <span class="source-score">(${score}% match)</span>
            ${docUrl ? `<br><a href="${docUrl}" target="_blank" rel="noopener">📖 View Documentation</a>` : ''}
        </li>`;
    });
    
    sourcesHtml += '</ul>';
    return sourcesHtml;
}

function copyAICode() {
    const codeOutput = document.getElementById('aiCodeOutput');
    // Only copy the code, not the sources section
    const codeElements = codeOutput.querySelectorAll('pre code');
    let codeText = '';
    
    codeElements.forEach(element => {
        codeText += element.textContent + '\n\n';
    });
    
    navigator.clipboard.writeText(codeText.trim()).then(() => {
        showNotification('Code copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy code', 'error');
    });
}
