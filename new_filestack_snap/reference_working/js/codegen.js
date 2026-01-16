// Intelligence features that require CDN URLs (not SDK transform options)
const INTELLIGENCE_FEATURES = ['tags', 'sfw', 'ocr'];

// Helper function to generate transform options object
function generateTransformOptions(activeTransformations, values) {
    const options = {};

    activeTransformations.forEach(key => {
        // Skip intelligence features - they'll be handled as CDN URLs
        if (INTELLIGENCE_FEATURES.includes(key)) {
            return;
        }

        switch (key) {
            // Simple boolean transformations
            case 'flip':
            case 'flop':
            case 'monochrome':
            case 'negative':
            case 'polaroid':
            case 'tornEdges':
            case 'circle':
            case 'compress':
            case 'pjpg':
            case 'upscale':
            case 'redeye':
            case 'ascii':
                options[key === 'tornEdges' ? 'torn_edges' : key] = true;
                break;

            // Amount-based transformations
            case 'blur':
                options.blur = { amount: values.blur };
                break;
            case 'sharpen':
                options.sharpen = { amount: values.sharpen };
                break;
            case 'sepia':
                options.sepia = { tone: values.sepia };
                break;
            case 'blackwhite':
                options.blackwhite = { threshold: values.blackwhite };
                break;
            case 'pixelate':
                options.pixelate = { amount: values.pixelate };
                break;
            case 'oilpaint':
                options.oil_paint = { amount: values.oilpaint };
                break;
            case 'modulate':
                options.modulate = { hue: values.modulate };
                break;
            case 'vignette':
                options.vignette = { amount: values.vignette };
                break;
            case 'shadow':
                options.shadow = { opacity: values.shadow };
                break;
            case 'border':
                options.border = { width: values.border };
                break;
            case 'quality':
                options.quality = { value: values.quality };
                break;
            case 'roundedCorners':
                options.rounded_corners = { radius: values.roundedCorners };
                break;

            // Dimensional transformations
            case 'resize':
                options.resize = {
                    width: values.resizeWidth,
                    height: values.resizeHeight,
                    fit: 'crop'
                };
                break;
            case 'crop':
                options.crop = {
                    dim: [values.cropX, values.cropY, values.cropWidth, values.cropHeight]
                };
                break;
            case 'rotate':
                options.rotate = { deg: values.rotate };
                break;

            // Face detection transformations
            case 'detectFaces':
                options.detect_faces = { minsize: 0.25, maxsize: 0.55, color: 'red' };
                break;
            case 'pixelateFaces':
                options.pixelate_faces = { faces: 'all', amount: 10 };
                break;
            case 'blurFaces':
                options.blur_faces = { faces: 'all', amount: 10 };
                break;
            case 'autoImage':
                options.auto_image = true;
                break;
        }
    });

    return options;
}

export function updateCode(state) {
    const codeEl = document.getElementById('generated-code');

    const options = {
        fromSources: state.picker.sources,
        accept: state.picker.accept,
        maxFiles: state.picker.maxFiles,
        maxSize: state.picker.maxSize * 1024 * 1024,
        displayMode: state.picker.displayMode,
        container: state.picker.displayMode !== 'overlay' ? state.picker.container : undefined
    };

    // Clean up undefined/empty
    if (options.accept.length === 0) delete options.accept;
    if (options.displayMode === 'overlay') delete options.container;

    let code = '';

    // Add CSS if custom styles exist
    if (state.customCSS && state.customCSS.trim()) {
        code += `// 1. Add custom CSS to your HTML\n// <style>\n`;
        state.customCSS.split('\n').forEach(line => {
            code += `// ${line}\n`;
        });
        code += `// </style>\n\n`;
    }

    const stepNumber = state.customCSS ? '2' : '1';
    code += `// ${stepNumber}. Include the SDK script in your HTML
// <script src="//static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"></script>

`;

    // Add client initialization with security if provided
    if (state.picker.policy && state.picker.signature) {
        code += `// Initialize with security
const client = filestack.init('${state.apiKey || 'YOUR_API_KEY'}', {
  security: {
    policy: '${state.picker.policy}',
    signature: '${state.picker.signature}'
  }
});
`;
    } else {
        code += `const client = filestack.init('${state.apiKey || 'YOUR_API_KEY'}');
`;
    }

    // Check if transformations are active
    const hasTransformations = state.transformations && state.transformations.active && state.transformations.active.length > 0;
    const intelligenceFeatures = hasTransformations ? state.transformations.active.filter(key => INTELLIGENCE_FEATURES.includes(key)) : [];
    const hasIntelligence = intelligenceFeatures.length > 0;
    const sdkTransformations = hasTransformations ? state.transformations.active.filter(key => !INTELLIGENCE_FEATURES.includes(key)) : [];
    const hasSDKTransforms = sdkTransformations.length > 0;

    if (hasSDKTransforms) {
        const transformOptions = generateTransformOptions(
            sdkTransformations,
            state.transformations.values
        );

        code += `
// Transformation options (SDK)
const transformOptions = ${JSON.stringify(transformOptions, null, 2)};

`;
    }

    code += `// Picker options
const pickerOptions = ${JSON.stringify(options, null, 2)};

`;

    // Add security policy/signature notice if intelligence is being used
    if (hasIntelligence && state.transformations.policy && state.transformations.signature) {
        code += `
// Intelligence features require security policy and signature
const SECURITY_POLICY = '${state.transformations.policy}';
const SECURITY_SIGNATURE = '${state.transformations.signature}';

`;
    }

    // Generate ONE unified picker call
    if (hasSDKTransforms && hasIntelligence) {
        // Both SDK transforms and intelligence features
        const intelligencePath = intelligenceFeatures.join('/');

        // Generate transformation chain for CDN URL
        const sdkTransformChain = Object.entries(generateTransformOptions(sdkTransformations, state.transformations.values))
            .map(([key, value]) => {
                if (typeof value === 'boolean') return key;
                if (typeof value === 'object') {
                    const params = Object.entries(value).map(([k, v]) => {
                        if (Array.isArray(v)) return `${k}:[${v.join(',')}]`;
                        return `${k}:${v}`;
                    }).join(',');
                    return `${key}=${params}`;
                }
                return key;
            }).join('/');

        code += `// Open picker with upload handler for transformations and intelligence
client.picker({
  ...pickerOptions,
  onUploadDone: (result) => {
    result.filesUploaded.forEach(file => {
      // Step 1: Apply SDK transformations
      const transformedUrl = client.transform(file.handle, transformOptions);
      console.log('Original URL:', file.url);
      console.log('Transformed URL:', transformedUrl);

      // Step 2: Build intelligence URL using the TRANSFORMED image
      let intelligenceUrl = 'https://cdn.filestackcontent.com';`;

        if (state.transformations.policy && state.transformations.signature) {
            code += `
      intelligenceUrl += \`/security=p:\${SECURITY_POLICY},s:\${SECURITY_SIGNATURE}\`;`;
        }

        code += `
      intelligenceUrl += '/${intelligencePath}';
      intelligenceUrl += '/${sdkTransformChain}';
      intelligenceUrl += '/' + file.handle;
      console.log('Intelligence URL (with transforms):', intelligenceUrl);

      // Fetch intelligence data from the transformed image
      fetch(intelligenceUrl)
        .then(res => res.json())
        .then(data => {
          console.log('Intelligence Data:', data);
          // Use the intelligence data (tags, sfw status, ocr text, etc.)
        })
        .catch(err => console.error('Intelligence fetch error:', err));
    });
  }
}).open();`;
    } else if (hasSDKTransforms) {
        // Only SDK transforms
        code += `// Open picker with upload handler for transformations
client.picker({
  ...pickerOptions,
  onUploadDone: (result) => {
    result.filesUploaded.forEach(file => {
      // Get transformed URL for each uploaded file
      const transformedUrl = client.transform(file.handle, transformOptions);
      console.log('Original URL:', file.url);
      console.log('Transformed URL:', transformedUrl);
      // Use transformedUrl in your application
    });
  }
}).open();`;
    } else if (hasIntelligence) {
        // Only intelligence features
        const intelligencePath = intelligenceFeatures.join('/');
        code += `// Open picker with upload handler for intelligence features
client.picker({
  ...pickerOptions,
  onUploadDone: (result) => {
    result.filesUploaded.forEach(file => {
      // Build CDN URL with intelligence features
      let intelligenceUrl = 'https://cdn.filestackcontent.com';`;

        if (state.transformations.policy && state.transformations.signature) {
            code += `
      intelligenceUrl += \`/security=p:\${SECURITY_POLICY},s:\${SECURITY_SIGNATURE}\`;`;
        }

        code += `
      intelligenceUrl += '/${intelligencePath}';
      intelligenceUrl += '/' + file.handle;
      console.log('Intelligence URL:', intelligenceUrl);

      // Fetch intelligence data (JSON response)
      fetch(intelligenceUrl)
        .then(res => res.json())
        .then(data => {
          console.log('Intelligence Data:', data);
          // Use the intelligence data (tags, sfw status, ocr text, etc.)
        })
        .catch(err => console.error('Intelligence fetch error:', err));
    });
  }
}).open();`;
    } else {
        code += `// Open picker
client.picker(pickerOptions).open();`;
    }

    codeEl.textContent = code.trim();
    // Apply Prism syntax highlighting
    if (window.Prism) {
        window.Prism.highlightElement(codeEl);
    }
}
