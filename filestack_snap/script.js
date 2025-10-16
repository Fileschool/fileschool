// Global variables
let currentSection = 'picker';
let filestackClient = null;
let currentPicker = null;

// Enhanced Code Generation System
class CodeGeneratorEnhanced {
    constructor() {
        this.generators = new Map();
        this.templates = new Map();
        this.validators = new Map();
        this.initializeTemplates();
    }

    initializeTemplates() {
        // JavaScript templates
        this.templates.set('javascript-base', {
            header: (apiKey) => `// Filestack Configuration\nconst apikey = "${apiKey}";\nconst client = filestack.init(apikey);\n\n`,
            picker: (options) => `const picker = client.picker(${this.formatOptions(options)});\npicker.open();`,
            transform: (url, transforms) => `const transformedUrl = client.transform()\n${transforms.map(t => `  .${t}`).join('\n')}\n  .output({ format: 'jpg', quality: 80 })\n  .url("${url}");`,
            upload: (options) => `client.upload(${this.formatOptions(options)});`,
            download: (handle) => `client.retrieve("${handle}");`
        });

        // React templates
        this.templates.set('react-base', {
            header: (apiKey) => `import * as filestack from 'filestack-js';\n\nconst apikey = "${apiKey}";\nconst client = filestack.init(apikey);\n\n// React Component\nfunction FilestackComponent() {\n  const handleAction = () => {`,
            footer: () => `  };\n\n  return (\n    <button onClick={handleAction}>\n      Open Filestack\n    </button>\n  );\n}\n\nexport default FilestackComponent;`,
            picker: (options) => `    const picker = client.picker(${this.formatOptions(options, '    ')});\n    picker.open();`,
            transform: (url, transforms) => `    const transformedUrl = client.transform()\n${transforms.map(t => `      .${t}`).join('\n')}\n      .output({ format: 'jpg', quality: 80 })\n      .url("${url}");\n    console.log(transformedUrl);`,
            upload: (options) => `    client.upload(${this.formatOptions(options, '    ')});`,
            download: (handle) => `    client.retrieve("${handle}");`
        });

        // Vue templates
        this.templates.set('vue-base', {
            header: (apiKey) => `<template>\n  <button @click="handleAction">Open Filestack</button>\n</template>\n\n<script>\nimport * as filestack from 'filestack-js';\n\nconst apikey = "${apiKey}";\nconst client = filestack.init(apikey);\n\nexport default {\n  methods: {\n    handleAction() {`,
            footer: () => `    }\n  }\n}\n</script>`,
            picker: (options) => `      const picker = client.picker(${this.formatOptions(options, '      ')});\n      picker.open();`,
            transform: (url, transforms) => `      const transformedUrl = client.transform()\n${transforms.map(t => `        .${t}`).join('\n')}\n        .output({ format: 'jpg', quality: 80 })\n        .url("${url}");\n      console.log(transformedUrl);`,
            upload: (options) => `      client.upload(${this.formatOptions(options, '      ')});`,
            download: (handle) => `      client.retrieve("${handle}");`
        });

        // Angular templates
        this.templates.set('angular-base', {
            header: (apiKey) => `import { Component } from '@angular/core';\nimport * as filestack from 'filestack-js';\n\n@Component({\n  selector: 'app-filestack',\n  template: '<button (click)="handleAction()">Open Filestack</button>'\n})\nexport class FilestackComponent {\n  private apikey = "${apiKey}";\n  private client = filestack.init(this.apikey);\n\n  handleAction() {`,
            footer: () => `  }\n}`,
            picker: (options) => `    const picker = this.client.picker(${this.formatOptions(options, '    ')});\n    picker.open();`,
            transform: (url, transforms) => `    const transformedUrl = this.client.transform()\n${transforms.map(t => `      .${t}`).join('\n')}\n      .output({ format: 'jpg', quality: 80 })\n      .url("${url}");\n    console.log(transformedUrl);`,
            upload: (options) => `    this.client.upload(${this.formatOptions(options, '    ')});`,
            download: (handle) => `    this.client.retrieve("${handle}");`
        });

        // Node.js templates
        this.templates.set('nodejs-base', {
            header: (apiKey) => `const filestack = require('filestack-js');\n\nconst apikey = "${apiKey}";\nconst client = filestack.init(apikey);\n\n// Server-side function\nasync function handleFilestack() {\n  try {`,
            footer: () => `  } catch (error) {\n    console.error('Filestack error:', error);\n  }\n}\n\nhandleFilestack();`,
            picker: (options) => `    // Note: Picker requires browser environment\n    console.log('Picker config:', ${this.formatOptions(options, '    ')});`,
            transform: (url, transforms) => `    const transformedUrl = client.transform()\n${transforms.map(t => `      .${t}`).join('\n')}\n      .output({ format: 'jpg', quality: 80 })\n      .url("${url}");\n    console.log('Transformed URL:', transformedUrl);`,
            upload: (options) => `    const result = await client.upload(${this.formatOptions(options, '    ')});\n    console.log('Upload result:', result);`,
            download: (handle) => `    const result = await client.retrieve("${handle}");\n    console.log('Download result:', result);`
        });

        // URL templates
        this.templates.set('url-base', {
            transform: (handle, transforms) => `https://cdn.filestackcontent.com/${transforms.join('/')}/${handle}`,
            processApi: (handle, task, params) => `https://process.filestackapi.com/${task}/${params ? params + '/' : ''}${handle}`
        });
    }

    formatOptions(options, indent = '') {
        if (!options || typeof options !== 'object') return '{}';

        const entries = Object.entries(options);
        if (entries.length === 0) return '{}';

        const formatted = entries.map(([key, value]) => {
            let formattedValue;
            if (typeof value === 'string') {
                formattedValue = `"${value}"`;
            } else if (typeof value === 'function') {
                formattedValue = value.toString();
            } else {
                formattedValue = JSON.stringify(value, null, 2);
            }
            return `${indent}  ${key}: ${formattedValue}`;
        }).join(',\n');

        return `{\n${formatted}\n${indent}}`;
    }

    validateSection(section, options) {
        const validator = this.validators.get(section);
        if (validator) {
            return validator(options);
        }
        return { valid: true, errors: [] };
    }

    generateCode(section, tab, options) {
        try {
            const validation = this.validateSection(section, options);
            if (!validation.valid) {
                return `// Validation Errors:\n${validation.errors.map(e => `// - ${e}`).join('\n')}\n\n// Please fix the errors above and regenerate the code.`;
            }

            // Check if this is a complex section that needs custom handling
            const complexCode = this.handleComplexSection(section, tab, options);
            if (complexCode) {
                return complexCode;
            }

            const template = this.templates.get(`${tab}-base`);
            if (!template) {
                return `// Code generation for ${tab} is not yet implemented for ${section}.\n// Available tabs: javascript, react, vue, angular, nodejs, url`;
            }

            const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_API_KEY';
            let code = '';

            if (tab === 'url') {
                return this.generateUrlCode(section, options);
            }

            if (template.header) {
                code += template.header(apiKey);
            }

            const methodName = this.getSectionMethod(section);
            if (template[methodName]) {
                // Different sections have different parameter signatures
                if (section === 'picker' || section === 'upload') {
                    // Picker and upload take just options
                    code += template[methodName](options);
                } else if (section === 'download') {
                    // Download takes just a handle
                    code += template[methodName](options.handle || 'YOUR_FILE_HANDLE');
                } else {
                    // Transform-based sections take url/handle and transforms
                    code += template[methodName](options.url || options.handle || 'default', options.transforms || options);
                }
            }

            if (template.footer) {
                code += template.footer();
            }

            return code || this.fallbackGeneration(section, tab, options);

        } catch (error) {
            return `// Error generating code: ${error.message}\n// Please check your configuration and try again.`;
        }
    }

    generateUrlCode(section, options) {
        const template = this.templates.get('url-base');
        const handle = options.handle || 'YOUR_FILE_HANDLE';

        switch (section) {
            case 'transform':
                const transforms = options.transforms || ['resize=width:300,height:300'];
                return template.transform(handle, transforms);
            case 'tagging':
                return template.processApi(handle, 'tags', '');
            case 'sfw':
                return template.processApi(handle, 'sfw', '');
            case 'faces':
                return template.processApi(handle, 'faces', '');
            case 'ocr':
                return template.processApi(handle, 'ocr', '');
            default:
                return `// URL generation not implemented for ${section}`;
        }
    }

    getSectionMethod(section) {
        const methodMap = {
            'picker': 'picker',
            'transform': 'transform',
            'upload': 'upload',
            'download': 'download',
            'sfw': 'transform',
            'tagging': 'transform',
            'faces': 'transform',
            'ocr': 'transform'
        };
        return methodMap[section] || 'picker';
    }

    fallbackGeneration(section, tab, options) {
        return `// Enhanced code generation for ${section} (${tab})\n// This is a fallback implementation\n// Please implement specific logic for this section.`;
    }

    registerValidator(section, validator) {
        this.validators.set(section, validator);
    }

    registerCustomGenerator(section, generator) {
        this.generators.set(section, generator);
    }

    // Handle complex sections that need custom logic
    handleComplexSection(section, tab, options) {
        switch (section) {
            case 'transform':
                return this.generateTransformCodeCustom(tab, options);
            case 'sentiment':
                return this.generateSentimentCode(tab, options);
            case 'caption':
                return this.generateCaptionCode(tab, options);
            case 'tagging':
                return this.generateTaggingCode(tab, options);
            case 'sfw':
                return this.generateSfwCode(tab, options);
            case 'faces':
                return this.generateFacesCode(tab, options);
            case 'ocr':
                return this.generateOcrCode(tab, options);
            case 'workflows':
                return this.generateWorkflowsCode(tab, options);
            case 'webhooks':
                return this.generateWebhooksCode(tab, options);
            default:
                return null;
        }
    }

    generateTransformCodeCustom(tab, options) {
        // Use the existing dedicated transform code generators
        switch (tab) {
            case 'javascript':
                return generateJavaScriptTransformCode(options);
            case 'react':
                return generateReactTransformCode(options);
            case 'vue':
                return generateVueTransformCode(options);
            case 'angular':
                return generateAngularTransformCode(options);
            case 'nodejs':
                return generateNodeJSTransformCode(options);
            case 'url':
                return generateURLTransformCode(options);
            default:
                return `// Transform code generation not implemented for ${tab}`;
        }
    }

    generateSentimentCode(tab, options) {
        const text = document.getElementById('sentimentText')?.value?.trim();
        const hasText = text && text.length > 0;

        if (hasText) {
            return this.generateTextSentimentCode(tab, text, options);
        } else {
            return this.generateImageSentimentCode(tab, options);
        }
    }

    generateTextSentimentCode(tab, text, options) {
        const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
        const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
        const escapedText = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        // Build security part only if both policy and signature are provided
        const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
        const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
        const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';
        const url = `https://cdn.filestackcontent.com/${sec}text_sentiment=text:"${escapedText}"`;

        switch (tab) {
            case 'javascript':
                return `// Text sentiment analysis
fetch('${url}')
  .then(r => r.json())
  .then(data => console.log('Text sentiment:', data))
  .catch(err => console.error('Text sentiment failed:', err));`;

            case 'react':
                return `import React from 'react';

const TextSentiment = () => {
  const analyzeSentiment = async () => {
    try {
      const res = await fetch('${url}');
      const data = await res.json();
      console.log('Text sentiment:', data);
    } catch (error) {
      console.error('Text sentiment failed:', error);
    }
  };

  return (
    <button onClick={analyzeSentiment}>
      Analyze Text Sentiment
    </button>
  );
};

export default TextSentiment;`;

            case 'vue':
                return `<template>
  <button @click="analyzeSentiment">Analyze Text Sentiment</button>
</template>

<script>
export default {
  methods: {
    async analyzeSentiment() {
      try {
        const res = await fetch('${url}');
        const data = await res.json();
        console.log('Text sentiment:', data);
      } catch (error) {
        console.error('Text sentiment failed:', error);
      }
    }
  }
}
</script>`;

            case 'angular':
                return `import { Component } from '@angular/core';

@Component({
  selector: 'app-text-sentiment',
  template: '<button (click)="analyzeSentiment()">Analyze Text Sentiment</button>'
})
export class TextSentimentComponent {
  async analyzeSentiment() {
    try {
      const res = await fetch('${url}');
      const data = await res.json();
      console.log('Text sentiment:', data);
    } catch (error) {
      console.error('Text sentiment failed:', error);
    }
  }
}`;

            case 'nodejs':
                return `const fetch = require('node-fetch');

async function analyzeTextSentiment() {
  try {
    const res = await fetch('${url}');
    const data = await res.json();
    console.log('Text sentiment:', data);
    return data;
  } catch (error) {
    console.error('Text sentiment failed:', error);
    throw error;
  }
}

analyzeTextSentiment();`;

            case 'url':
                return `// Text Sentiment Analysis URL
const sentimentUrl = '${url}';

// Usage: GET request to this URL returns sentiment analysis
// Response format: { "sentiment": "positive|negative|neutral", "confidence": 0.85 }`;
        }
    }

    generateImageSentimentCode(tab, options) {
        const inputType = document.querySelector('input[name="sentimentInputType"]:checked')?.value || 'handle';
        const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
        const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
        const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_API_KEY';

        let source = '';
        let needsApiKey = false;

        switch (inputType) {
            case 'handle':
                source = document.getElementById('sentimentHandle')?.value || 'YOUR_FILE_HANDLE';
                break;
            case 'external':
                source = document.getElementById('sentimentExternalUrl')?.value || 'https://example.com/image.jpg';
                needsApiKey = true;
                break;
            case 'storage':
                const alias = document.getElementById('sentimentStorageAlias')?.value || 'STORAGE_ALIAS';
                const path = document.getElementById('sentimentStoragePath')?.value || '/path/to/image.jpg';
                source = `src://${alias}${path}`;
                needsApiKey = true;
                break;
        }

        // Build transformation chain
        const enableChaining = document.getElementById('sentimentEnableChaining')?.checked || false;
        let transformChain = '';

        if (enableChaining) {
            const preSteps = document.querySelectorAll('#sentimentPreChainBuilder .chain-step');
            const preTransforms = [];

            preSteps.forEach(step => {
                const operation = step.querySelector('.chain-operation')?.value;
                const params = step.querySelector('.chain-params')?.value;
                if (operation) {
                    if (params) {
                        preTransforms.push(`${operation}=${params}`);
                    } else {
                        preTransforms.push(operation);
                    }
                }
            });

            if (preTransforms.length > 0) {
                transformChain = preTransforms.join('/') + '/';
            }
        }

        // Build security part only if both policy and signature are provided
        const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
        const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
        const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';
        let url;

        if (needsApiKey) {
            url = `https://cdn.filestackcontent.com/${apiKey}/${sec}${transformChain}image_sentiment/${source}`;
        } else {
            url = `https://cdn.filestackcontent.com/${sec}${transformChain}image_sentiment/${source}`;
        }

        const chainNote = transformChain ? `\n\n// This URL includes pre-processing transformations: ${transformChain.slice(0, -1)}` : '';

        switch (tab) {
            case 'javascript':
                return `// Image sentiment analysis
fetch('${url}')
  .then(r => r.json())
  .then(data => console.log('Image sentiment:', data))
  .catch(err => console.error('Image sentiment failed:', err));${chainNote}`;

            case 'react':
                return `import React from 'react';

const ImageSentiment = () => {
  const analyzeSentiment = async () => {
    try {
      const res = await fetch('${url}');
      const data = await res.json();
      console.log('Image sentiment:', data);
    } catch (error) {
      console.error('Image sentiment failed:', error);
    }
  };

  return (
    <button onClick={analyzeSentiment}>
      Analyze Image Sentiment
    </button>
  );
};

export default ImageSentiment;${chainNote}`;

            case 'url':
                return `// Image Sentiment Analysis URL
const sentimentUrl = '${url}';${chainNote}`;

            default:
                return `// Image sentiment analysis for ${tab}
const sentimentUrl = '${url}';${chainNote}`;
        }
    }

    generateCaptionCode(tab, options) {
        const inputType = document.querySelector('input[name="captionInputType"]:checked')?.value || 'handle';
        const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
        const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
        const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_API_KEY';

        let source = '';
        let needsApiKey = false;

        switch (inputType) {
            case 'handle':
                source = document.getElementById('captionHandle')?.value || 'YOUR_FILE_HANDLE';
                break;
            case 'external':
                source = document.getElementById('captionExternalUrl')?.value || 'https://example.com/image.jpg';
                needsApiKey = true;
                break;
            case 'storage':
                const alias = document.getElementById('captionStorageAlias')?.value || 'STORAGE_ALIAS';
                const path = document.getElementById('captionStoragePath')?.value || '/path/to/image.jpg';
                source = `src://${alias}${path}`;
                needsApiKey = true;
                break;
        }

        // Build transformation chain
        const enableChaining = document.getElementById('captionEnableChaining')?.checked || false;
        let transformChain = '';
        const transformSteps = [];

        if (enableChaining) {
            const preSteps = document.querySelectorAll('#captionPreChainBuilder .chain-step');

            preSteps.forEach(step => {
                const operation = step.querySelector('.chain-operation')?.value;
                const params = step.querySelector('.chain-params')?.value;
                if (operation) {
                    if (params) {
                        transformSteps.push(`${operation}=${params}`);
                    } else {
                        transformSteps.push(operation);
                    }
                }
            });

            if (transformSteps.length > 0) {
                transformChain = transformSteps.join('/') + '/';
            }
        }

        // Build security part only if both policy and signature are provided
        const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
        const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
        const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';
        let url;

        if (needsApiKey) {
            url = `https://cdn.filestackcontent.com/${apiKey}/${sec}${transformChain}caption/${source}`;
        } else {
            url = `https://cdn.filestackcontent.com/${sec}${transformChain}caption/${source}`;
        }

        const chainNote = transformChain ? `\n\n// Pre-processing transformations applied: ${transformSteps.join(', ')}` : '';
        const examples = `\n\n// URL Format Examples:
// Basic handle: https://cdn.filestackcontent.com/security=p:<POLICY>,s:<SIGNATURE>/caption/<HANDLE>
// With resize: https://cdn.filestackcontent.com/security=p:<POLICY>,s:<SIGNATURE>/resize=h:1000/caption/<HANDLE>
// External URL: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/caption/<EXTERNAL_URL>`;

        switch (tab) {
            case 'javascript':
                return `// Caption generation (Processing API)
fetch('${url}')
  .then(r => r.json())
  .then(data => console.log('Caption:', data))
  .catch(err => console.error('Caption failed:', err));${chainNote}${examples}`;

            case 'react':
                return `import React from 'react';

const CaptionGenerator = () => {
  const generateCaption = async () => {
    try {
      const res = await fetch('${url}');
      const data = await res.json();
      console.log('Caption:', data);
    } catch (error) {
      console.error('Caption failed:', error);
    }
  };

  return (
    <button onClick={generateCaption}>
      Generate Caption
    </button>
  );
};

export default CaptionGenerator;${chainNote}`;

            case 'vue':
                return `<template>
  <button @click="generateCaption">Generate Caption</button>
</template>

<script>
export default {
  methods: {
    async generateCaption() {
      try {
        const res = await fetch('${url}');
        const data = await res.json();
        console.log('Caption:', data);
      } catch (error) {
        console.error('Caption failed:', error);
      }
    }
  }
}
</script>${chainNote}`;

            case 'angular':
                return `import { Component } from '@angular/core';

@Component({
  selector: 'app-caption-generator',
  template: '<button (click)="generateCaption()">Generate Caption</button>'
})
export class CaptionGeneratorComponent {
  async generateCaption() {
    try {
      const res = await fetch('${url}');
      const data = await res.json();
      console.log('Caption:', data);
    } catch (error) {
      console.error('Caption failed:', error);
    }
  }
}${chainNote}`;

            case 'nodejs':
                return `const fetch = require('node-fetch');

async function generateCaption() {
  try {
    const res = await fetch('${url}');
    const data = await res.json();
    console.log('Caption:', data);
    return data;
  } catch (error) {
    console.error('Caption failed:', error);
    throw error;
  }
}

generateCaption();${chainNote}`;

            case 'url':
                return `// Caption Generation URL
const captionUrl = '${url}';${chainNote}${examples}`;
        }
    }

    generateTaggingCode(tab, options) {
        const inputType = document.querySelector('input[name="taggingInputType"]:checked')?.value || 'handle';
        const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
        const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
        const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_API_KEY';

        let source = '';
        let needsApiKey = false;

        switch (inputType) {
            case 'handle':
                source = document.getElementById('taggingHandle')?.value || 'YOUR_FILE_HANDLE';
                break;
            case 'external':
                source = document.getElementById('taggingExternalUrl')?.value || 'https://example.com/image.jpg';
                needsApiKey = true;
                break;
            case 'storage':
                const alias = document.getElementById('taggingStorageAlias')?.value || 'STORAGE_ALIAS';
                const path = document.getElementById('taggingStoragePath')?.value || '/path/to/image.jpg';
                source = `src://${alias}${path}`;
                needsApiKey = true;
                break;
        }

        // Build transformation chain
        const enableChaining = document.getElementById('taggingEnableChaining')?.checked || false;
        let transformChain = '';
        const transformSteps = [];

        if (enableChaining) {
            const preSteps = document.querySelectorAll('#taggingPreChainBuilder .chain-step');

            preSteps.forEach(step => {
                const operation = step.querySelector('.chain-operation')?.value;
                const params = step.querySelector('.chain-params')?.value;
                if (operation) {
                    if (params) {
                        transformSteps.push(`${operation}=${params}`);
                    } else {
                        transformSteps.push(operation);
                    }
                }
            });

            if (transformSteps.length > 0) {
                transformChain = transformSteps.join('/') + '/';
            }
        }

        // Build security part only if both policy and signature are provided
        const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
        const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
        const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';
        let url;

        if (needsApiKey) {
            url = `https://cdn.filestackcontent.com/${apiKey}/${sec}${transformChain}tags/${source}`;
        } else {
            url = `https://cdn.filestackcontent.com/${sec}${transformChain}tags/${source}`;
        }

        const chainNote = transformChain ? `\n\n// Pre-processing transformations applied: ${transformSteps.join(', ')}` : '';

        switch (tab) {
            case 'javascript':
                return `// Image tagging
fetch('${url}')
  .then(r => r.json())
  .then(data => console.log('Image tags:', data))
  .catch(err => console.error('Tagging failed:', err));${chainNote}`;

            case 'react':
                return `import React from 'react';

const ImageTagger = () => {
  const tagImage = async () => {
    try {
      const res = await fetch('${url}');
      const data = await res.json();
      console.log('Image tags:', data);
    } catch (error) {
      console.error('Tagging failed:', error);
    }
  };

  return (
    <button onClick={tagImage}>
      Tag Image
    </button>
  );
};

export default ImageTagger;${chainNote}`;

            case 'vue':
                return `<template>
  <button @click="tagImage">Tag Image</button>
</template>

<script>
export default {
  methods: {
    async tagImage() {
      try {
        const res = await fetch('${url}');
        const data = await res.json();
        console.log('Image tags:', data);
      } catch (error) {
        console.error('Tagging failed:', error);
      }
    }
  }
}
</script>${chainNote}`;

            case 'url':
                return `// Image Tagging URL
const taggingUrl = '${url}';${chainNote}`;

            default:
                return `// Image tagging for ${tab}
const taggingUrl = '${url}';${chainNote}`;
        }
    }

    generateSfwCode(tab, options) {
        const inputType = document.querySelector('input[name="sfwInputType"]:checked')?.value || 'handle';
        const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
        const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
        const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_API_KEY';

        let source = '';
        let needsApiKey = false;

        switch (inputType) {
            case 'handle':
                source = document.getElementById('sfwHandle')?.value || 'YOUR_FILE_HANDLE';
                break;
            case 'external':
                source = document.getElementById('sfwExternalUrl')?.value || 'https://example.com/image.jpg';
                needsApiKey = true;
                break;
            case 'storage':
                const alias = document.getElementById('sfwStorageAlias')?.value || 'STORAGE_ALIAS';
                const path = document.getElementById('sfwStoragePath')?.value || '/path/to/image.jpg';
                source = `src://${alias}${path}`;
                needsApiKey = true;
                break;
        }

        // Build transformation chain
        const enableChaining = document.getElementById('sfwEnableChaining')?.checked || false;
        let transformChain = '';
        const transformSteps = [];

        if (enableChaining) {
            const preSteps = document.querySelectorAll('#sfwPreChainBuilder .chain-step');

            preSteps.forEach(step => {
                const operation = step.querySelector('.chain-operation')?.value;
                const params = step.querySelector('.chain-params')?.value;
                if (operation) {
                    if (params) {
                        transformSteps.push(`${operation}=${params}`);
                    } else {
                        transformSteps.push(operation);
                    }
                }
            });

            if (transformSteps.length > 0) {
                transformChain = transformSteps.join('/') + '/';
            }
        }

        // Build security part only if both policy and signature are provided
        const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
        const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
        const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';

        let url;

        if (needsApiKey) {
            url = `https://cdn.filestackcontent.com/${apiKey}/${sec}${transformChain}sfw/${source}`;
        } else {
            url = `https://cdn.filestackcontent.com/${sec}${transformChain}sfw/${source}`;
        }

        const chainNote = transformChain ? `\n\n// Pre-processing transformations applied: ${transformSteps.join(', ')}` : '';

        switch (tab) {
            case 'javascript':
                return `// Safe for Work detection
fetch('${url}')
  .then(r => r.json())
  .then(data => console.log('SFW status:', data))
  .catch(err => console.error('SFW check failed:', err));${chainNote}`;

            case 'react':
                return `import React from 'react';

const SafeForWorkChecker = () => {
  const checkSFW = async () => {
    try {
      const res = await fetch('${url}');
      const data = await res.json();
      console.log('SFW status:', data);
    } catch (error) {
      console.error('SFW check failed:', error);
    }
  };

  return (
    <button onClick={checkSFW}>
      Check SFW Status
    </button>
  );
};

export default SafeForWorkChecker;${chainNote}`;

            case 'vue':
                return `<template>
  <button @click="checkSFW">Check SFW Status</button>
</template>

<script>
export default {
  methods: {
    async checkSFW() {
      try {
        const res = await fetch('${url}');
        const data = await res.json();
        console.log('SFW status:', data);
      } catch (error) {
        console.error('SFW check failed:', error);
      }
    }
  }
}
</script>${chainNote}`;

            case 'url':
                return `// Safe for Work Check URL
const sfwUrl = '${url}';${chainNote}`;

            default:
                return `// Safe for Work check for ${tab}
const sfwUrl = '${url}';${chainNote}`;
        }
    }

    generateFacesCode(tab, options) {
        const inputType = document.querySelector('input[name="facesInputType"]:checked')?.value || 'handle';
        const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
        const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
        const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_API_KEY';

        let source = '';
        let needsApiKey = false;

        switch (inputType) {
            case 'handle':
                source = document.getElementById('facesHandle')?.value || 'YOUR_FILE_HANDLE';
                break;
            case 'external':
                source = document.getElementById('facesExternalUrl')?.value || 'https://example.com/image.jpg';
                needsApiKey = true;
                break;
            case 'storage':
                const alias = document.getElementById('facesStorageAlias')?.value || 'STORAGE_ALIAS';
                const path = document.getElementById('facesStoragePath')?.value || '/path/to/image.jpg';
                source = `src://${alias}${path}`;
                needsApiKey = true;
                break;
        }

        // Build transformation chain
        const enableChaining = document.getElementById('facesEnableChaining')?.checked || false;
        let transformChain = '';
        const transformSteps = [];

        if (enableChaining) {
            const preSteps = document.querySelectorAll('#facesPreChainBuilder .chain-step');

            preSteps.forEach(step => {
                const operation = step.querySelector('.chain-operation')?.value;
                const params = step.querySelector('.chain-params')?.value;
                if (operation) {
                    if (params) {
                        transformSteps.push(`${operation}=${params}`);
                    } else {
                        transformSteps.push(operation);
                    }
                }
            });

            if (transformSteps.length > 0) {
                transformChain = transformSteps.join('/') + '/';
            }
        }

        // Build security part only if both policy and signature are provided
        const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
        const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
        const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';
        let url;

        if (needsApiKey) {
            url = `https://cdn.filestackcontent.com/${apiKey}/${sec}${transformChain}detect_faces/${source}`;
        } else {
            url = `https://cdn.filestackcontent.com/${sec}${transformChain}detect_faces/${source}`;
        }

        const chainNote = transformChain ? `\n\n// Pre-processing transformations applied: ${transformSteps.join(', ')}` : '';

        switch (tab) {
            case 'javascript':
                return `// Face detection
fetch('${url}')
  .then(r => r.json())
  .then(data => console.log('Faces detected:', data))
  .catch(err => console.error('Face detection failed:', err));${chainNote}`;

            case 'react':
                return `import React from 'react';

const FaceDetector = () => {
  const detectFaces = async () => {
    try {
      const res = await fetch('${url}');
      const data = await res.json();
      console.log('Faces detected:', data);
    } catch (error) {
      console.error('Face detection failed:', error);
    }
  };

  return (
    <button onClick={detectFaces}>
      Detect Faces
    </button>
  );
};

export default FaceDetector;${chainNote}`;

            case 'vue':
                return `<template>
  <button @click="detectFaces">Detect Faces</button>
</template>

<script>
export default {
  methods: {
    async detectFaces() {
      try {
        const res = await fetch('${url}');
        const data = await res.json();
        console.log('Faces detected:', data);
      } catch (error) {
        console.error('Face detection failed:', error);
      }
    }
  }
}
</script>${chainNote}`;

            case 'url':
                return `// Face Detection URL
const facesUrl = '${url}';${chainNote}`;

            default:
                return `// Face detection for ${tab}
const facesUrl = '${url}';${chainNote}`;
        }
    }

    generateOcrCode(tab, options) {
        const inputType = document.querySelector('input[name="ocrInputType"]:checked')?.value || 'handle';
        const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
        const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
        const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_API_KEY';

        let source = '';
        let needsApiKey = false;

        switch (inputType) {
            case 'handle':
                source = document.getElementById('ocrHandle')?.value || 'YOUR_FILE_HANDLE';
                break;
            case 'external':
                source = document.getElementById('ocrExternalUrl')?.value || 'https://example.com/document.pdf';
                needsApiKey = true;
                break;
            case 'storage':
                const alias = document.getElementById('ocrStorageAlias')?.value || 'STORAGE_ALIAS';
                const path = document.getElementById('ocrStoragePath')?.value || '/path/to/image.jpg';
                source = `src://${alias}${path}`;
                needsApiKey = true;
                break;
        }

        // Build transformation chain
        const enableChaining = document.getElementById('ocrEnableChaining')?.checked || false;
        let transformChain = '';
        const transformSteps = [];

        if (enableChaining) {
            const preSteps = document.querySelectorAll('#ocrPreChainBuilder .chain-step');

            preSteps.forEach(step => {
                const operation = step.querySelector('.chain-operation')?.value;
                const params = step.querySelector('.chain-params')?.value;
                if (operation) {
                    if (params) {
                        transformSteps.push(`${operation}=${params}`);
                    } else {
                        transformSteps.push(operation);
                    }
                }
            });

            if (transformSteps.length > 0) {
                transformChain = transformSteps.join('/') + '/';
            }
        }

        // Build security part only if both policy and signature are provided
        const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
        const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
        const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';
        let url;

        if (needsApiKey) {
            url = `https://cdn.filestackcontent.com/${apiKey}/${sec}${transformChain}ocr/${source}`;
        } else {
            url = `https://cdn.filestackcontent.com/${sec}${transformChain}ocr/${source}`;
        }

        const chainNote = transformChain ? `\n\n// Pre-processing transformations applied: ${transformSteps.join(', ')}` : '';

        switch (tab) {
            case 'javascript':
                return `// Optical Character Recognition (OCR)
fetch('${url}')
  .then(r => r.json())
  .then(data => console.log('OCR results:', data))
  .catch(err => console.error('OCR failed:', err));${chainNote}`;

            case 'react':
                return `import React from 'react';

const OCRProcessor = () => {
  const processOCR = async () => {
    try {
      const res = await fetch('${url}');
      const data = await res.json();
      console.log('OCR results:', data);
    } catch (error) {
      console.error('OCR failed:', error);
    }
  };

  return (
    <button onClick={processOCR}>
      Process OCR
    </button>
  );
};

export default OCRProcessor;${chainNote}`;

            case 'vue':
                return `<template>
  <button @click="processOCR">Process OCR</button>
</template>

<script>
export default {
  methods: {
    async processOCR() {
      try {
        const res = await fetch('${url}');
        const data = await res.json();
        console.log('OCR results:', data);
      } catch (error) {
        console.error('OCR failed:', error);
      }
    }
  }
}
</script>${chainNote}`;

            case 'url':
                return `// OCR Processing URL
const ocrUrl = '${url}';${chainNote}`;

            default:
                return `// OCR processing for ${tab}
const ocrUrl = '${url}';${chainNote}`;
        }
    }

    generateWorkflowsCode(tab, options) {
        const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_API_KEY';
        const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
        const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
        const workflowId = options.workflowId || 'YOUR_WORKFLOW_ID';
        const sourceType = options.sourceType || 'handle';
        const jobId = options.jobId || null;

        // Build security part only if both policy and signature are provided
        const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
        const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
        const securityPart = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';

        let source = '';
        let needsApiKey = false;

        // Build source based on type
        switch (sourceType) {
            case 'handle':
                source = options.handle || 'YOUR_FILE_HANDLE';
                break;
            case 'url':
                source = options.url || 'https://example.com/image.jpg';
                needsApiKey = true;
                break;
            case 'storage':
                const alias = options.storageAlias || 'STORAGE_ALIAS';
                const path = options.storagePath || '/path/to/file.jpg';
                source = `src://${alias}${path}`;
                needsApiKey = true;
                break;
        }

        // Build run workflow URL
        const apiKeyPart = needsApiKey ? `${apiKey}/` : '';
        const runWorkflowUrl = `https://cdn.filestackcontent.com/${apiKeyPart}${securityPart}run_workflow=id:${workflowId}/${source}`;

        // Build status check URL
        const statusUrl = jobId ?
            `https://cdn.filestackcontent.com/${apiKey}/${securityPart}workflow_status=job_id:${jobId}` :
            `https://cdn.filestackcontent.com/${apiKey}/${securityPart}workflow_status=job_id:JOB_ID_FROM_RESPONSE`;

        switch (tab) {
            case 'javascript':
                return `// Filestack Workflows API
// Base URL: https://cdn.filestackcontent.com

// Step 1: Run Workflow (GET request)
const runWorkflowUrl = '${runWorkflowUrl}';

fetch(runWorkflowUrl)
  .then(r => r.json())
  .then(data => {
    console.log('Workflow started:', data);
    console.log('Job ID:', data.jobid);
    console.log('Status:', data.status);

    // Step 2: Check workflow status using Job ID
    const jobId = data.jobid;
    const statusUrl = \`https://cdn.filestackcontent.com/${apiKey}/${securityPart}workflow_status=job_id:\${jobId}\`;

    // Poll for status (you may want to add a delay/retry mechanism)
    setTimeout(() => {
      fetch(statusUrl)
        .then(r => r.json())
        .then(statusData => {
          console.log('Workflow status:', statusData);
          console.log('Results:', statusData.results);
        })
        .catch(err => console.error('Status check failed:', err));
    }, 3000);
  })
  .catch(err => console.error('Workflow failed:', err));`;

            case 'react':
                return `import React, { useState } from 'react';

const WorkflowExecutor = () => {
  const [jobId, setJobId] = useState('');
  const [status, setStatus] = useState('');
  const [results, setResults] = useState(null);

  const runWorkflow = async () => {
    const runUrl = '${runWorkflowUrl}';

    try {
      const res = await fetch(runUrl);
      const data = await res.json();
      console.log('Workflow started:', data);
      setJobId(data.jobid);
      setStatus(data.status);
    } catch (error) {
      console.error('Workflow failed:', error);
    }
  };

  const checkStatus = async () => {
    if (!jobId) return;

    const statusUrl = \`https://cdn.filestackcontent.com/${apiKey}/${securityPart}workflow_status=job_id:\${jobId}\`;

    try {
      const res = await fetch(statusUrl);
      const data = await res.json();
      console.log('Status:', data);
      setStatus(data.status);
      setResults(data.results);
    } catch (error) {
      console.error('Status check failed:', error);
    }
  };

  return (
    <div>
      <button onClick={runWorkflow}>Run Workflow</button>
      {jobId && (
        <>
          <p>Job ID: {jobId}</p>
          <p>Status: {status}</p>
          <button onClick={checkStatus}>Check Status</button>
          {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
        </>
      )}
    </div>
  );
};

export default WorkflowExecutor;`;

            case 'nodejs':
                return `const fetch = require('node-fetch');

// Step 1: Run Workflow
async function runWorkflow() {
  const runUrl = '${runWorkflowUrl}';

  try {
    const res = await fetch(runUrl);
    const data = await res.json();
    console.log('Workflow started:', data);
    console.log('Job ID:', data.jobid);

    // Step 2: Wait and check status
    await new Promise(resolve => setTimeout(resolve, 3000));

    const statusUrl = \`https://cdn.filestackcontent.com/${apiKey}/${securityPart}workflow_status=job_id:\${data.jobid}\`;
    const statusRes = await fetch(statusUrl);
    const statusData = await statusRes.json();

    console.log('Workflow status:', statusData);
    console.log('Results:', statusData.results);

    return statusData;
  } catch (error) {
    console.error('Workflow error:', error);
  }
}

runWorkflow();`;

            case 'url':
                return `// Filestack Workflows API (GET requests via URL)

// Step 1: Run Workflow
GET ${runWorkflowUrl}

// Response will include:
// {
//   "jobid": "job-id-here",
//   "status": "Started",
//   "sources": ["${source}"],
//   "workflow": "${workflowId}",
//   "createdAt": "timestamp",
//   "updatedAt": "timestamp"
// }

// Step 2: Check Workflow Status (use Job ID from response)
GET ${statusUrl}

// Response when completed:
// {
//   "jobid": "job-id-here",
//   "status": "Finished",
//   "results": { /* workflow results here */ },
//   "sources": ["${source}"],
//   "workflow": "${workflowId}",
//   "ttl": 172800
// }`;

            default:
                return `// Workflow execution for ${tab}
// Run workflow: ${runWorkflowUrl}
// Check status: ${statusUrl}`;
        }
    }

    generateWebhooksCode(tab, options) {
        const url = options.url || 'https://your-app.com/filestack-webhook';
        const secret = options.secret || null;
        const events = options.events || {};

        const eventTypes = [];
        if (events.upload) eventTypes.push('upload.complete');
        if (events.transform) eventTypes.push('transform.complete');
        if (events.workflow) eventTypes.push('workflow.complete');

        const eventsNote = eventTypes.length > 0 ? `\n// Configured events: ${eventTypes.join(', ')}` : '';

        switch (tab) {
            case 'javascript':
            case 'nodejs':
                return `// Webhook Configuration
// Configure webhooks in your Filestack Developer Portal
// Webhook URL: ${url}${secret ? `\n// Secret Key: ${secret}` : ''}${eventsNote}

// Example webhook handler (Node.js/Express)
const express = require('express');
const crypto = require('crypto');
const app = express();

app.post('/filestack-webhook', express.json(), (req, res) => {
  ${secret ? `// Verify webhook signature
  const signature = req.headers['x-filestack-signature'];
  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', '${secret}')
    .update(payload)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).send('Invalid signature');
  }

  ` : ''}// Process webhook event
  const event = req.body;
  console.log('Webhook received:', event);

  // Handle different event types
  switch(event.type) {
    case 'upload.complete':
      console.log('Upload completed:', event.data);
      break;
    case 'transform.complete':
      console.log('Transform completed:', event.data);
      break;
    case 'workflow.complete':
      console.log('Workflow completed:', event.data);
      break;
  }

  res.status(200).send('OK');
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));`;

            case 'react':
                return `// Webhook Configuration
// Configure webhooks in your Filestack Developer Portal
// Webhook URL: ${url}${secret ? `\n// Secret Key: ${secret}` : ''}${eventsNote}

// Note: Webhooks are server-side only
// You'll need a backend server to receive webhook notifications
// This React component shows how to poll for status or use WebSockets

import React, { useEffect, useState } from 'react';

const WebhookStatus = () => {
  const [events, setEvents] = useState([]);

  // Poll your backend for webhook events
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/filestack-events');
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Filestack Events</h3>
      {events.map((event, i) => (
        <div key={i}>{event.type}: {event.status}</div>
      ))}
    </div>
  );
};

export default WebhookStatus;`;

            case 'url':
                return `// Webhook Configuration
Webhook URL: ${url}${secret ? `\nSecret Key: ${secret}` : ''}${eventsNote}

// Configure in Filestack Developer Portal:
// 1. Go to https://dev.filestack.com
// 2. Navigate to Webhooks section
// 3. Add webhook URL: ${url}
// 4. Select event types: ${eventTypes.length > 0 ? eventTypes.join(', ') : 'upload.complete, transform.complete, workflow.complete'}${secret ? `\n// 5. Set secret key for signature verification` : ''}`;

            default:
                return `// Webhook Configuration
// Webhook URL: ${url}${secret ? `\n// Secret Key: ${secret}` : ''}${eventsNote}`;
        }
    }
}

// Initialize enhanced code generator
const enhancedCodeGenerator = new CodeGeneratorEnhanced();

// Enhanced update function with better error handling and validation
function updateCodeDisplayEnhanced(code, language, section) {
    const codeElement = document.getElementById('generatedCode');
    if (!codeElement) {
        console.error('Code display element not found');
        return;
    }

    // Add metadata comments
    const timestamp = new Date().toISOString();
    const metadata = `// Generated on: ${timestamp}\n// Section: ${section}\n// Language: ${language}\n// API Key: ${document.getElementById('globalApikey')?.value ? 'Configured' : 'Not set'}\n\n`;

    const fullCode = metadata + code;
    codeElement.textContent = fullCode;

    // Enhanced language detection and syntax highlighting
    const languageMap = {
        'javascript': 'javascript',
        'react': 'jsx',
        'vue': 'vue',
        'angular': 'typescript',
        'nodejs': 'javascript',
        'url': 'http'
    };

    const langClass = languageMap[language] || 'javascript';
    codeElement.className = `language-${langClass}`;

    // Enhanced syntax highlighting with error handling
    if (typeof Prism !== 'undefined') {
        try {
            Prism.highlightElement(codeElement);
        } catch (e) {
            console.warn('Syntax highlighting failed:', e);
        }
    }

    // Add copy functionality enhancement
    if (window.enhancedCopyHandler) {
        window.enhancedCopyHandler.updateCode(fullCode);
    }
}

// Enhanced copy functionality
window.enhancedCopyHandler = {
    currentCode: '',
    updateCode(code) {
        this.currentCode = code;
    },
    copy() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(this.currentCode).then(() => {
                this.showNotification('Code copied to clipboard!');
            }).catch(err => {
                console.error('Copy failed:', err);
                this.fallbackCopy();
            });
        } else {
            this.fallbackCopy();
        }
    },
    fallbackCopy() {
        const textarea = document.createElement('textarea');
        textarea.value = this.currentCode;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.showNotification('Code copied to clipboard!');
    },
    showNotification(message) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
};

// Enhanced section-specific validators
enhancedCodeGenerator.registerValidator('picker', (options) => {
    const errors = [];

    // Removed API key validation - API key is optional for handles
    if (options.maxSize && isNaN(parseInt(options.maxSize))) {
        errors.push('Max file size must be a number');
    }

    if (options.maxFiles && isNaN(parseInt(options.maxFiles))) {
        errors.push('Max files must be a number');
    }

    return { valid: errors.length === 0, errors };
});

enhancedCodeGenerator.registerValidator('transform', (options) => {
    const errors = [];

    // Check if at least one transformation option is set (excluding handle and output)
    const transformKeys = Object.keys(options).filter(key => key !== 'handle' && key !== 'output');

    if (transformKeys.length === 0) {
        errors.push('At least one transformation must be selected');
    }

    return { valid: errors.length === 0, errors };
});

// Override the original copy function to use enhanced version
function copyCode() {
    window.enhancedCopyHandler.copy();
}

// Universal enhanced code generation wrapper
function generateCodeEnhanced(section, tab = 'javascript') {
    try {
        // Get options based on section
        let options = {};
        switch (section) {
            case 'picker':
                options = collectPickerOptions();
                break;
            case 'transform':
                options = collectTransformOptions();
                break;
            case 'upload':
                options = collectUploadOptions();
                break;
            case 'download':
                options = collectDownloadOptions();
                break;
            case 'sfw':
                options = collectSfwOptions();
                break;
            case 'tagging':
                options = collectTaggingOptions();
                break;
            case 'faces':
                options = collectFacesOptions();
                break;
            case 'ocr':
                options = collectOcrOptions();
                break;
            case 'workflows':
                options = collectWorkflowsOptions();
                break;
            case 'webhooks':
                options = collectWebhooksOptions();
                break;
            default:
                options = {};
        }

        // Try enhanced generation first
        const enhancedCode = enhancedCodeGenerator.generateCode(section, tab, options);

        // Always use enhanced version if available, otherwise use fallback message
        updateCodeDisplayEnhanced(enhancedCode, tab, section);

    } catch (error) {
        console.error(`Enhanced ${section} generation failed:`, error);
        const fallbackCode = `// Error generating code for ${section}\n// Please check your configuration and try again.\n// Error: ${error.message}`;
        updateCodeDisplayEnhanced(fallbackCode, tab, section);
    }
}

// Enhanced collection functions to handle missing options
function collectUploadOptions() {
    try {
        return {
            maxSize: document.getElementById('uploadMaxSize')?.value || null,
            accept: document.getElementById('uploadAccept')?.value || null,
            tags: document.getElementById('uploadTags')?.value || null
        };
    } catch (error) {
        console.warn('Error collecting upload options:', error);
        return {};
    }
}

function collectDownloadOptions() {
    try {
        return {
            handle: document.getElementById('downloadHandle')?.value || 'YOUR_FILE_HANDLE',
            policy: document.getElementById('downloadPolicy')?.value || null,
            signature: document.getElementById('downloadSignature')?.value || null
        };
    } catch (error) {
        console.warn('Error collecting download options:', error);
        return { handle: 'YOUR_FILE_HANDLE' };
    }
}

function collectSfwOptions() {
    try {
        const options = {
            handle: document.getElementById('sfwHandle')?.value || 'YOUR_FILE_HANDLE',
            url: document.getElementById('sfwExternalUrl')?.value || null,
            inputType: document.querySelector('input[name="sfwInputType"]:checked')?.value || 'handle'
        };

        // Check if chaining is enabled
        const enableChaining = document.getElementById('sfwEnableChaining')?.checked || false;
        if (enableChaining) {
            options.enableChaining = true;
            options.preTransforms = [];

            // Collect pre-transformation chain steps
            const preSteps = document.querySelectorAll('#sfwPreChainBuilder .chain-step');
            preSteps.forEach(step => {
                const operation = step.querySelector('.chain-operation')?.value;
                const params = step.querySelector('.chain-params')?.value;
                if (operation) {
                    const transform = { operation };
                    if (params) {
                        transform.params = params;
                    }
                    options.preTransforms.push(transform);
                }
            });
        }

        return options;
    } catch (error) {
        console.warn('Error collecting SFW options:', error);
        return { handle: 'YOUR_FILE_HANDLE' };
    }
}

function collectTaggingOptions() {
    try {
        const options = {
            handle: document.getElementById('taggingHandle')?.value || 'YOUR_FILE_HANDLE',
            url: document.getElementById('taggingExternalUrl')?.value || null,
            inputType: document.querySelector('input[name="taggingInputType"]:checked')?.value || 'handle'
        };

        // Check if chaining is enabled
        const enableChaining = document.getElementById('taggingEnableChaining')?.checked || false;
        if (enableChaining) {
            options.enableChaining = true;
            options.preTransforms = [];

            // Collect pre-transformation chain steps
            const preSteps = document.querySelectorAll('#taggingPreChainBuilder .chain-step');
            preSteps.forEach(step => {
                const operation = step.querySelector('.chain-operation')?.value;
                const params = step.querySelector('.chain-params')?.value;
                if (operation) {
                    const transform = { operation };
                    if (params) {
                        transform.params = params;
                    }
                    options.preTransforms.push(transform);
                }
            });
        }

        return options;
    } catch (error) {
        console.warn('Error collecting tagging options:', error);
        return { handle: 'YOUR_FILE_HANDLE' };
    }
}

function collectFacesOptions() {
    try {
        const options = {
            handle: document.getElementById('facesHandle')?.value || 'YOUR_FILE_HANDLE',
            url: document.getElementById('facesExternalUrl')?.value || null,
            inputType: document.querySelector('input[name="facesInputType"]:checked')?.value || 'handle'
        };

        // Faces detection parameters
        const minSize = document.getElementById('facesMinSize')?.value;
        const maxSize = document.getElementById('facesMaxSize')?.value;
        const exportFaces = document.getElementById('facesExport')?.checked;

        if (minSize) options.minsize = parseFloat(minSize);
        if (maxSize) options.maxsize = parseFloat(maxSize);
        if (exportFaces) options.export = true;

        return options;
    } catch (error) {
        console.warn('Error collecting faces options:', error);
        return { handle: 'YOUR_FILE_HANDLE' };
    }
}

function collectOcrOptions() {
    try {
        const options = {
            handle: document.getElementById('ocrHandle')?.value || 'YOUR_FILE_HANDLE',
            url: document.getElementById('ocrExternalUrl')?.value || null,
            inputType: document.querySelector('input[name="ocrInputType"]:checked')?.value || 'handle'
        };

        // Check if chaining is enabled
        const enableChaining = document.getElementById('ocrEnableChaining')?.checked || false;
        if (enableChaining) {
            options.enableChaining = true;
            options.preTransforms = [];

            // Collect pre-transformation chain steps
            const preSteps = document.querySelectorAll('#ocrPreChainBuilder .chain-step');
            preSteps.forEach(step => {
                const operation = step.querySelector('.chain-operation')?.value;
                const params = step.querySelector('.chain-params')?.value;
                if (operation) {
                    const transform = { operation };
                    if (params) {
                        transform.params = params;
                    }
                    options.preTransforms.push(transform);
                }
            });
        }

        return options;
    } catch (error) {
        console.warn('Error collecting OCR options:', error);
        return { handle: 'YOUR_FILE_HANDLE' };
    }
}

function collectWorkflowsOptions() {
    try {
        const sourceType = document.querySelector('input[name="workflowSourceType"]:checked')?.value || 'handle';

        return {
            workflowId: document.getElementById('workflowId')?.value || null,
            sourceType: sourceType,
            handle: document.getElementById('workflowHandle')?.value || null,
            url: document.getElementById('workflowUrl')?.value || null,
            storageAlias: document.getElementById('workflowStorageAlias')?.value || null,
            storagePath: document.getElementById('workflowStoragePath')?.value || null,
            jobId: document.getElementById('workflowJobId')?.value || null
        };
    } catch (error) {
        console.warn('Error collecting workflows options:', error);
        return {};
    }
}

function collectWebhooksOptions() {
    try {
        return {
            url: document.getElementById('webhookUrl')?.value || null,
            secret: document.getElementById('webhookSecret')?.value || null,
            events: {
                upload: document.getElementById('webhookUpload')?.checked || false,
                transform: document.getElementById('webhookTransform')?.checked || false,
                workflow: document.getElementById('webhookWorkflow')?.checked || false
            }
        };
    } catch (error) {
        console.warn('Error collecting webhooks options:', error);
        return {};
    }
}

// Setup manual code generation system with visual feedback
function setupManualCodeGeneration() {
    let configurationChanged = false;
    const generateBtn = document.getElementById('generateCodeBtn');

    if (!generateBtn) {
        console.error('Generate Code button not found');
        return;
    }

    // Function to mark configuration as changed
    const markConfigChanged = () => {
        if (!configurationChanged) {
            configurationChanged = true;
            updateGenerateButton(true);
        }
    };

    // Function to mark configuration as up-to-date
    const markConfigUpToDate = () => {
        configurationChanged = false;
        updateGenerateButton(false);
    };

    // Update generate button appearance
    window.updateGenerateButton = function(hasChanges) {
        if (!generateBtn) return;

        if (hasChanges) {
            generateBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Generate Code (Updated)';
            generateBtn.classList.add('btn-warning');
            generateBtn.classList.remove('btn-primary');
            generateBtn.style.animation = 'pulse 2s infinite';
        } else {
            generateBtn.innerHTML = '<i class="fas fa-play"></i> Generate Code';
            generateBtn.classList.add('btn-primary');
            generateBtn.classList.remove('btn-warning');
            generateBtn.style.animation = '';
        }
    };

    // Manual generation function
    window.manualGenerateCode = function() {
        if (!currentSection) {
            showUserFeedback('Please select a section first', 'warning');
            return;
        }

        // Check if current section is workflow-only (no client-side code generation)
        // Workflow-only sections: video-tagging, video-sfw, phishing, virus
        // Code-generating sections: picker, transform, upload, download, sfw, tagging, faces, ocr,
        //                          caption, sentiment, dnd, security, metadata, store, transform-chains,
        //                          workflows, webhooks, custom-source, video-processing, audio-processing
        const workflowOnlySections = ['video-tagging', 'video-sfw', 'phishing', 'virus'];
        if (workflowOnlySections.includes(currentSection)) {
            showUserFeedback('This section is workflow-only and does not generate code', 'info');
            return;
        }

        try {
            const activeTab = document.querySelector('.tab-btn.active');
            const tabName = activeTab ? activeTab.getAttribute('data-tab') : 'javascript';

            // Show loading state
            const generateBtn = document.getElementById('generateCodeBtn');
            const originalText = generateBtn ? generateBtn.innerHTML : '';
            if (generateBtn && !generateBtn.disabled) {
                generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
                generateBtn.disabled = true;
            }

            // Generate code
            generateCodeEnhanced(currentSection, tabName);
            markConfigUpToDate();

            // Restore button state
            if (generateBtn) {
                setTimeout(() => {
                    generateBtn.innerHTML = originalText;
                    // Only re-enable if not a workflow-only section
                    if (!workflowOnlySections.includes(currentSection)) {
                        generateBtn.disabled = false;
                    }
                    showUserFeedback('Code generated successfully!', 'success');
                }, 300);
            } else {
                showUserFeedback('Code generated successfully!', 'success');
            }
        } catch (error) {
            console.error('Code generation error:', error);
            showUserFeedback('Error generating code. Please check your configuration.', 'error');

            // Restore button state on error
            const generateBtn = document.getElementById('generateCodeBtn');
            if (generateBtn) {
                generateBtn.innerHTML = '<i class="fas fa-play"></i> Generate Code';
                // Only re-enable if not a workflow-only section
                const workflowOnlySections = ['video-tagging', 'video-sfw', 'phishing', 'virus'];
                if (!workflowOnlySections.includes(currentSection)) {
                    generateBtn.disabled = false;
                }
            }
        }
    };

    // Set initial placeholder
    window.setCodePlaceholder = function() {
        const codeElement = document.getElementById('generatedCode');
        if (codeElement) {
            codeElement.textContent = `// Your generated code will appear here
// Configure your options and click "Generate Code" button above
//
// Tip: Any configuration changes will be highlighted in the button`;
        }
    };

    // Monitor all form inputs for changes
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Skip inputs that shouldn't trigger change notifications
        if (input.type === 'file' || input.classList.contains('no-regenerate')) {
            return;
        }

        input.addEventListener('input', markConfigChanged);
        input.addEventListener('change', markConfigChanged);
    });

    // Monitor checkboxes specifically
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Handle transform option toggles
            if (checkbox.id.startsWith('enable')) {
                toggleTransformInputs(checkbox);
            }
            markConfigChanged();
        });
    });

    // Monitor radio buttons
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener('change', markConfigChanged);
    });

    // API Key input gets special treatment
    const apiKeyInput = document.getElementById('globalApikey');
    if (apiKeyInput) {
        apiKeyInput.addEventListener('input', () => {
            // Update Filestack client when API key changes
            if (typeof filestack !== 'undefined' && apiKeyInput.value) {
                try {
                    filestackClient = filestack.init(apiKeyInput.value);
                } catch (error) {
                    console.warn('Invalid API key:', error);
                }
            }
            markConfigChanged();
        });
    }

    // Add pulse animation CSS if not already present
    if (!document.querySelector('style[data-manual-generation-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-manual-generation-styles', 'true');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }

            .code-header-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }

            .code-actions {
                display: flex;
                gap: 8px;
            }

            .btn-warning {
                background-color: #ff9800 !important;
                border-color: #ff9800 !important;
                color: white !important;
            }

            .btn-warning:hover {
                background-color: #f57c00 !important;
                border-color: #f57c00 !important;
            }

            /* Fix code overflow issues */
            .code-content {
                overflow-x: hidden !important;
            }

            .code-content pre {
                overflow-x: auto !important;
                white-space: pre-wrap !important;
                word-wrap: break-word !important;
                max-width: 100% !important;
            }

            .code-content code {
                white-space: pre-wrap !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
                max-width: 100% !important;
                display: block !important;
            }

            /* Ensure code panel doesn't overflow */
            .code-panel {
                overflow: hidden !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced error handling and user feedback system
function showUserFeedback(message, type = 'info') {
    const existingFeedback = document.querySelector('.user-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    const feedback = document.createElement('div');
    feedback.className = 'user-feedback';
    feedback.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        max-width: 300px;
        padding: 12px 16px;
        border-radius: 6px;
        z-index: 10001;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;

    // Set colors based on type
    const colors = {
        success: { bg: '#4CAF50', text: 'white' },
        error: { bg: '#f44336', text: 'white' },
        warning: { bg: '#ff9800', text: 'white' },
        info: { bg: '#2196F3', text: 'white' }
    };

    const color = colors[type] || colors.info;
    feedback.style.backgroundColor = color.bg;
    feedback.style.color = color.text;
    feedback.textContent = message;

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: ${color.text};
        font-size: 18px;
        font-weight: bold;
        padding: 0;
        margin-left: 10px;
        cursor: pointer;
        float: right;
        line-height: 1;
    `;
    closeBtn.onclick = () => feedback.remove();

    feedback.appendChild(closeBtn);
    document.body.appendChild(feedback);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 5000);

    // Add slide-in animation
    if (!document.querySelector('style[data-feedback-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-feedback-styles', 'true');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced initialization with better error handling
function enhancedInitialization() {
    try {
        // Validate that essential elements exist
        const essentialElements = [
            'generatedCode',
            'globalApikey'
        ];

        const missingElements = essentialElements.filter(id => !document.getElementById(id));

        if (missingElements.length > 0) {
            showUserFeedback(`Missing essential elements: ${missingElements.join(', ')}`, 'error');
            return;
        }

        // Initialize with guidance
        showUserFeedback('Filestack Snap ready! Configure your options and click Generate Code.', 'info');

        // Add keyboard shortcuts
        setupKeyboardShortcuts();

    } catch (error) {
        console.error('Enhanced initialization failed:', error);
        showUserFeedback('Initialization failed. Some features may not work correctly.', 'error');
    }
}

// Keyboard shortcuts for better UX
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + C to copy code
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && e.target.closest('.code-content')) {
            e.preventDefault();
            copyCode();
            return;
        }

        // Ctrl/Cmd + R to generate code manually
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            if (typeof manualGenerateCode === 'function') {
                manualGenerateCode();
            }
            return;
        }

        // Number keys 1-6 to switch tabs
        if (e.key >= '1' && e.key <= '6' && !e.target.matches('input, textarea, select')) {
            const tabIndex = parseInt(e.key) - 1;
            const tabs = ['javascript', 'react', 'vue', 'angular', 'nodejs', 'url'];
            if (tabs[tabIndex]) {
                switchCodeTab(tabs[tabIndex]);
                showUserFeedback(`Switched to ${tabs[tabIndex]} tab - Click Generate Code to update`, 'info');
            }
        }
    });
}

// Add to document ready
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    setupEventListeners();
    setupTransformOptions();
    setupRangeSliders();
    setupInputValidation();
    enhancedInitialization();
});

// Validation helper function
function validateNumberInput(elementId, defaultValue = null) {
    const element = document.getElementById(elementId);
    if (!element) return defaultValue;

    const value = parseFloat(element.value);
    const min = parseFloat(element.min);
    const max = parseFloat(element.max);

    // If value is NaN or empty, return default
    if (isNaN(value) || element.value === '') {
        return defaultValue;
    }

    // Clamp value to min/max bounds
    if (!isNaN(min) && value < min) {
        element.value = min;
        return min;
    }
    if (!isNaN(max) && value > max) {
        element.value = max;
        return max;
    }

    return value;
}

// Validation helper for integer values
function validateIntegerInput(elementId, defaultValue = null) {
    const value = validateNumberInput(elementId, defaultValue);
    return value !== null ? Math.floor(value) : defaultValue;
}

// Original initialization (now handled by enhanced version above)

// Initialize the application
function initializeApp() {
    // Initialize Filestack client
    if (typeof filestack !== 'undefined') {
        const apiKey = document.getElementById('globalApikey').value || 'YOUR_APIKEY';
        filestackClient = filestack.init(apiKey);
    }

    // Show initial section
    showSection('picker');

    // Set up manual code generation system
    setupManualCodeGeneration();

    // Set initial placeholder text
    setCodePlaceholder();
}

// Setup event listeners
function setupEventListeners() {
    // Top Navigation - Tier 1 (Main Categories)
    document.querySelectorAll('.tier-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            const tier = this.getAttribute('data-tier');

            // Remove active class from all tier-1 tabs
            document.querySelectorAll('.tier-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Hide all tier-2 sections
            document.querySelectorAll('.nav-tier-2').forEach(t => t.classList.remove('active'));

            // Show the corresponding tier-2 section
            const tier2Section = document.querySelector(`.nav-tier-2[data-parent="${tier}"]`);
            if (tier2Section) {
                tier2Section.classList.add('active');

                // Automatically click the first sub-tab in this category
                const firstSubTab = tier2Section.querySelector('.sub-tab');
                if (firstSubTab) {
                    firstSubTab.click();
                }
            }
        });
    });

    // Top Navigation - Tier 2 (Subcategories)
    document.querySelectorAll('.sub-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            const section = this.getAttribute('data-section');

            // Remove active class from all sub-tabs in the current tier-2
            const parentTier2 = this.closest('.nav-tier-2');
            parentTier2.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show the corresponding content section
            showSection(section);
        });
    });

    // Code tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const tab = this.getAttribute('data-tab');
            switchCodeTab(tab);
        });
    });

    // Transform option toggles
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.id.startsWith('enable')) {
            checkbox.addEventListener('change', function () {
                toggleTransformInputs(this);
            });
        }
    });

    // Transform chains add step button
    const addChainStepBtn = document.getElementById('addChainStep');
    if (addChainStepBtn) {
        addChainStepBtn.addEventListener('click', addChainStep);
    }

    // Initialize existing remove step buttons
    document.querySelectorAll('.btn-remove-step').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.chain-step').remove();
            generateTransformChainsCode();
        });
    });

    // Initialize existing chain steps with dynamic placeholders and hints
    document.querySelectorAll('.chain-step').forEach(step => {
        const operationSelect = step.querySelector('.chain-operation');
        const paramsInput = step.querySelector('.chain-params');

        if (operationSelect && paramsInput) {
            // Create or get hint div
            let hintDiv = step.querySelector('.chain-param-hint');
            if (!hintDiv) {
                hintDiv = document.createElement('div');
                hintDiv.className = 'chain-param-hint';
                hintDiv.style.display = 'none';
                paramsInput.parentNode.insertBefore(hintDiv, paramsInput.nextSibling);
            }

            // Add change listener
            operationSelect.addEventListener('change', () => {
                const paramInfo = getParameterInfo(operationSelect.value);

                if (operationSelect.value) {
                    paramsInput.placeholder = paramInfo.example;

                    if (paramInfo.example === '') {
                        paramsInput.disabled = true;
                        paramsInput.value = '';
                        hintDiv.style.display = 'none';
                    } else {
                        paramsInput.disabled = false;
                        hintDiv.innerHTML = `<strong>${paramInfo.description}</strong><br>${paramInfo.constraints}`;
                        hintDiv.style.display = 'block';
                    }
                } else {
                    paramsInput.placeholder = 'Select operation first';
                    hintDiv.style.display = 'none';
                }
            });

            // Set initial placeholder and hint if operation is already selected
            if (operationSelect.value) {
                const paramInfo = getParameterInfo(operationSelect.value);
                paramsInput.placeholder = paramInfo.example;
                if (paramInfo.example && paramInfo.example !== '') {
                    hintDiv.innerHTML = `<strong>${paramInfo.description}</strong><br>${paramInfo.constraints}`;
                    hintDiv.style.display = 'block';
                }
            }
        }
    });

    // Setup chaining toggles for intelligence features
    const chainingToggles = [
        { checkbox: 'sfwEnableChaining', group: 'sfwChainingGroup' },
        { checkbox: 'taggingEnableChaining', group: 'taggingChainingGroup' },
        { checkbox: 'ocrEnableChaining', group: 'ocrChainingGroup' },
        { checkbox: 'captionEnableChaining', group: 'captionChainingGroup' },
        { checkbox: 'sentimentEnableChaining', group: 'sentimentChainingGroup' }
    ];

    chainingToggles.forEach(({ checkbox, group }) => {
        const checkboxEl = document.getElementById(checkbox);
        const groupEl = document.getElementById(group);

        if (checkboxEl && groupEl) {
            checkboxEl.addEventListener('change', function() {
                groupEl.style.display = this.checked ? 'block' : 'none';
            });
        }
    });

    // Setup add step buttons for chain builders
    const addStepButtons = [
        { button: 'addSfwPreStep', builder: 'sfwPreChainBuilder' },
        { button: 'addTaggingPreStep', builder: 'taggingPreChainBuilder' },
        { button: 'addOcrPreStep', builder: 'ocrPreChainBuilder' },
        { button: 'addCaptionPreStep', builder: 'captionPreChainBuilder' },
        { button: 'addSentimentPreStep', builder: 'sentimentPreChainBuilder' }
    ];

    addStepButtons.forEach(({ button, builder }) => {
        const buttonEl = document.getElementById(button);
        if (buttonEl) {
            buttonEl.addEventListener('click', () => addChainStepToBuilder(builder));
        }
    });

    // Setup workflow source type radio buttons
    const workflowSourceRadios = document.querySelectorAll('input[name="workflowSourceType"]');
    workflowSourceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const handleGroup = document.getElementById('workflowHandleGroup');
            const urlGroup = document.getElementById('workflowUrlGroup');
            const storageGroup = document.getElementById('workflowStorageGroup');

            // Hide all groups
            if (handleGroup) handleGroup.style.display = 'none';
            if (urlGroup) urlGroup.style.display = 'none';
            if (storageGroup) storageGroup.style.display = 'none';

            // Show selected group
            if (this.value === 'handle' && handleGroup) {
                handleGroup.style.display = 'block';
            } else if (this.value === 'url' && urlGroup) {
                urlGroup.style.display = 'block';
            } else if (this.value === 'storage' && storageGroup) {
                storageGroup.style.display = 'block';
            }
        });
    });
}

// Setup transform options
function setupTransformOptions() {
    // Add event listeners for transform option toggles
    const transformOptions = [
        'resize', 'crop', 'rotate', 'flip', 'flop', 'blur', 'sharpen', 'sepia',
        'blackWhite', 'negative', 'circle', 'roundedCorners', 'partialBlur',
        'partialPixelate', 'blurFaces', 'cropFaces', 'pixelateFaces', 'vignette',
        'shadow', 'border', 'watermark', 'smartCrop', 'upscale', 'pdfConvert', 'pdfInfo'
    ];

    transformOptions.forEach(option => {
        const checkbox = document.getElementById(`enable${option.charAt(0).toUpperCase() + option.slice(1)}`);
        if (checkbox) {
            checkbox.addEventListener('change', function () {
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
        qualitySlider.addEventListener('input', function () {
            document.getElementById('qualityValue').textContent = this.value + '%';
        });
    }

    if (compressSlider) {
        compressSlider.addEventListener('input', function () {
            document.getElementById('compressValue').textContent = this.value + '%';
        });
    }
}

// Setup input validation for all number inputs
function setupInputValidation() {
    // Get all number inputs with min/max attributes
    const numberInputs = document.querySelectorAll('input[type="number"][min], input[type="number"][max]');

    numberInputs.forEach(input => {
        // Validate on blur (when user leaves the field)
        input.addEventListener('blur', function () {
            const value = parseFloat(this.value);
            const min = parseFloat(this.min);
            const max = parseFloat(this.max);

            if (!isNaN(value)) {
                if (!isNaN(min) && value < min) {
                    this.value = min;
                    showNotification(`Value clamped to minimum: ${min}`, 'info');
                } else if (!isNaN(max) && value > max) {
                    this.value = max;
                    showNotification(`Value clamped to maximum: ${max}`, 'info');
                }
            }
        });

        // Also validate on input for immediate feedback
        input.addEventListener('input', function () {
            const value = parseFloat(this.value);
            const min = parseFloat(this.min);
            const max = parseFloat(this.max);

            if (!isNaN(value)) {
                if (!isNaN(min) && value < min) {
                    this.style.borderColor = '#ff6b6b';
                } else if (!isNaN(max) && value > max) {
                    this.style.borderColor = '#ff6b6b';
                } else {
                    this.style.borderColor = '';
                }
            }
        });
    });
}

// Real-time code generation disabled - using manual generation only
function setupRealTimeCodeGeneration() {
    // This function is disabled - manual generation only
    return; // Exit early to prevent automatic generation
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

    // Define workflow-only sections (no code generation)
    const workflowOnlySections = ['video-tagging', 'video-sfw', 'phishing', 'virus'];
    const isWorkflowOnly = workflowOnlySections.includes(sectionName);

    // Get generate button
    const generateBtn = document.getElementById('generateCodeBtn');

    // Show workflow message for sections that don't have direct API support
    if (isWorkflowOnly) {
        showWorkflowOnlyMessage(sectionName);

        // Disable and grey out generate button
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.style.opacity = '0.5';
            generateBtn.style.cursor = 'not-allowed';
            generateBtn.title = 'This section is workflow-only and does not generate code';
        }
    } else {
        // Enable generate button for code-generating sections
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.style.opacity = '1';
            generateBtn.style.cursor = 'pointer';
            generateBtn.title = 'Generate code for this section';
        }

        // Don't auto-generate code when switching sections
        // Users should click "Generate Code" button manually
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

    // Auto-regenerate code for the new language/framework
    if (currentSection && typeof generateCodeEnhanced === 'function') {
        generateCodeEnhanced(currentSection, tabName);
    }

    // Update code display with correct language
    const codeElement = document.getElementById('generatedCode');
    if (codeElement) {
        // Set the language class for syntax highlighting
        codeElement.className = `language-${tabName === 'javascript' ? 'javascript' : tabName === 'react' ? 'jsx' : tabName === 'vue' ? 'vue' : 'javascript'}`;
    }
}

// Helper: get active code tab
function getCurrentTab() {
    const active = document.querySelector('.code-tabs .tab-btn.active');
    return active ? active.getAttribute('data-tab') : 'javascript';
}

// Toggle transform inputs
function toggleTransformInputs(checkbox) {
    const optionName = checkbox.id.replace('enable', '').toLowerCase();
    const inputs = document.getElementById(`${optionName}Inputs`);

    if (inputs) {
        inputs.style.display = checkbox.checked ? 'grid' : 'none';
    }
}

// Enhanced wrapper for picker code generation
function generatePickerCodeEnhanced(tab = 'javascript') {
    try {
        const options = collectPickerOptions();

        // Try enhanced generation first
        const enhancedCode = enhancedCodeGenerator.generateCode('picker', tab, options);

        if (enhancedCode && !enhancedCode.includes('fallback implementation')) {
            updateCodeDisplayEnhanced(enhancedCode, tab, 'picker');
            return;
        }

        // Fall back to original generation if enhanced fails
        generatePickerCode(tab);
    } catch (error) {
        console.error('Enhanced picker generation failed:', error);
        generatePickerCode(tab);
    }
}

// Generate picker code (original function preserved)
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
        case 'angular':
            code = generateAngularPickerCode(options);
            break;
        case 'nodejs':
            code = generateNodeJSPickerCode(options);
            break;
        case 'url':
            code = generateURLPickerCode(options);
            break;
    }

    updateCodeDisplay(code, tab);
}

// Enhanced wrapper for transform code generation
function generateTransformCodeEnhanced(tab = 'javascript') {
    try {
        const options = collectTransformOptions();

        // Try enhanced generation first
        const enhancedCode = enhancedCodeGenerator.generateCode('transform', tab, options);

        if (enhancedCode && !enhancedCode.includes('fallback implementation')) {
            updateCodeDisplayEnhanced(enhancedCode, tab, 'transform');
            return;
        }

        // Fall back to original generation if enhanced fails
        generateTransformCode(tab);
    } catch (error) {
        console.error('Enhanced transform generation failed:', error);
        generateTransformCode(tab);
    }
}

// Generate transform code (original function preserved)
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
        case 'angular':
            code = generateAngularTransformCode(options);
            break;
        case 'nodejs':
            code = generateNodeJSTransformCode(options);
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

    // API Key is handled separately in code generation, not in options

    // Display mode
    const displayMode = document.querySelector('input[name="displayMode"]:checked')?.value;
    if (displayMode && displayMode !== 'overlay') {
        options.displayMode = displayMode;
    }

    // Language
    const language = document.getElementById('language')?.value;
    if (language && language !== 'en') {
        options.lang = language;
    }

    // Accept files - Find the "File Acceptance" card and get its checkboxes
    const acceptFiles = [];
    const fileAcceptanceCard = Array.from(document.querySelectorAll('#picker .config-card')).find(card =>
        card.textContent.includes('File Acceptance')
    );
    console.log('File Acceptance Card found:', fileAcceptanceCard);
    if (fileAcceptanceCard) {
        const checkboxes = fileAcceptanceCard.querySelectorAll('input[type="checkbox"][value]');
        console.log('File acceptance checkboxes:', checkboxes.length);
        checkboxes.forEach(checkbox => {
            console.log('Checkbox:', checkbox.value, 'Checked:', checkbox.checked);
            if (checkbox.checked) {
                acceptFiles.push(checkbox.value);
            }
        });
    }
    console.log('Accept files collected:', acceptFiles);
    if (acceptFiles.length > 0) {
        options.accept = acceptFiles;
    }

    // Sources - Find the "Sources" card and get its checkboxes
    const sources = [];
    const sourcesCard = Array.from(document.querySelectorAll('#picker .config-card')).find(card =>
        card.textContent.includes('Sources') && !card.textContent.includes('From')
    );
    console.log('Sources Card found:', sourcesCard);
    if (sourcesCard) {
        const checkboxes = sourcesCard.querySelectorAll('input[type="checkbox"][value]');
        console.log('Sources checkboxes:', checkboxes.length);
        checkboxes.forEach(checkbox => {
            console.log('Source checkbox:', checkbox.value, 'Checked:', checkbox.checked);
            if (checkbox.checked) {
                sources.push(checkbox.value);
            }
        });
    }
    console.log('Sources collected:', sources);
    if (sources.length > 0) {
        options.fromSources = sources;
    }

    // File limits with validation
    const maxFiles = validateIntegerInput('maxFiles');
    if (maxFiles !== null) {
        options.maxFiles = maxFiles;
    }

    const minFiles = validateIntegerInput('minFiles');
    if (minFiles !== null) {
        options.minFiles = minFiles;
    }

    const maxSize = validateIntegerInput('maxSize');
    if (maxSize !== null) {
        options.maxSize = maxSize * 1024 * 1024; // Convert MB to bytes
    }

    const concurrency = validateIntegerInput('concurrency');
    if (concurrency !== null) {
        options.concurrency = concurrency;
    }

    // Image dimensions
    const imageMaxDim = document.getElementById('imageMaxDim').value;
    if (imageMaxDim) {
        const dims = imageMaxDim.split(',').map(d => parseInt(d.trim()));
        if (dims.length === 2) {
            options.imageMax = dims;
        }
    }
    const imageMinDim = document.getElementById('imageMinDim').value;
    if (imageMinDim) {
        const dims = imageMinDim.split(',').map(d => parseInt(d.trim()));
        if (dims.length === 2) {
            options.imageMin = dims;
        }
    }

    // Advanced options
    if (document.getElementById('hideModalWhenUploading').checked) {
        options.hideModalWhenUploading = true;
    }

    if (document.getElementById('uploadInBackground').checked) {
        options.uploadInBackground = true;
    }

    if (document.getElementById('cleanupImageExif').checked) {
        options.cleanupImageExif = true;
    }

    if (document.getElementById('exposeOriginalFile').checked) {
        options.exposeOriginalFile = true;
    }

    // Store Options
    const loc = document.getElementById('storeLocation')?.value;
    const path = document.getElementById('storePath')?.value;
    const workflows = document.getElementById('storeWorkflows')?.value;
    if ((loc && loc.length) || (path && path.length) || (workflows && workflows.length)) {
        options.storeTo = {};
        if (loc) options.storeTo.location = loc;
        if (path) options.storeTo.path = path;
        if (workflows) {
            const wf = workflows.split(',').map(s => s.trim()).filter(Boolean);
            if (wf.length) options.storeTo.workflows = wf;
        }
    }

    // Upload Options with validation
    const retry = validateIntegerInput('uploadRetry');
    const timeout = validateIntegerInput('uploadTimeout');
    const tagsJson = document.getElementById('uploadTagsJson')?.value;
    if (retry !== null || timeout !== null || (tagsJson && tagsJson.trim() !== '')) {
        options.uploadConfig = {};
        if (retry !== null) options.uploadConfig.retry = retry;
        if (timeout !== null) options.uploadConfig.timeout = timeout;
        if (tagsJson && tagsJson.trim() !== '') {
            try {
                options.uploadConfig.tags = JSON.parse(tagsJson);
            } catch (e) {
                // ignore invalid JSON, UI will still show code without tags
            }
        }
    }

    console.log('Final collected picker options:', options);
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

    // Basic transformations with validation
    if (document.getElementById('enableResize').checked) {
        const width = validateIntegerInput('resizeWidth');
        const height = validateIntegerInput('resizeHeight');
        const fit = document.getElementById('resizeFit').value;

        options.resize = {};
        if (width !== null) options.resize.width = width;
        if (height !== null) options.resize.height = height;
        if (fit !== 'clip') options.resize.fit = fit;
    }

    if (document.getElementById('enableCrop').checked) {
        const x = validateIntegerInput('cropX');
        const y = validateIntegerInput('cropY');
        const width = validateIntegerInput('cropWidth');
        const height = validateIntegerInput('cropHeight');

        if (x !== null && y !== null && width !== null && height !== null) {
            options.crop = {
                dim: [x, y, width, height]
            };
        }
    }

    if (document.getElementById('enableRotate').checked) {
        const degrees = validateIntegerInput('rotateDegrees');
        if (degrees !== null) {
            options.rotate = degrees;
        }
    }

    if (document.getElementById('enableFlip').checked) {
        options.flip = true;
    }

    if (document.getElementById('enableFlop').checked) {
        options.flop = true;
    }

    // Filters with validation
    if (document.getElementById('enableBlur').checked) {
        const amount = validateIntegerInput('blurAmount');
        if (amount !== null) {
            options.blur = amount;
        }
    }

    if (document.getElementById('enableSharpen').checked) {
        const amount = validateIntegerInput('sharpenAmount');
        if (amount !== null) {
            options.sharpen = amount;
        }
    }

    if (document.getElementById('enableSepia').checked) {
        const tone = validateIntegerInput('sepiaTone');
        if (tone !== null) {
            options.sepia = { tone: tone };
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
        const radius = validateIntegerInput('roundedCornersRadius');
        if (radius !== null) {
            options.rounded_corners = radius;
        }
    }

    // Advanced effects with validation
    if (document.getElementById('enableVignette').checked) {
        const amount = validateIntegerInput('vignetteAmount');
        if (amount !== null) {
            options.vignette = amount;
        }
    }

    if (document.getElementById('enableShadow').checked) {
        const blur = validateIntegerInput('shadowBlur');
        const opacity = validateIntegerInput('shadowOpacity');
        const vector = document.getElementById('shadowVector').value;

        options.shadow = {};
        if (blur !== null) options.shadow.blur = blur;
        if (opacity !== null) options.shadow.opacity = opacity;
        if (vector) {
            const vectorArray = vector.split(',').map(v => parseInt(v.trim()));
            if (vectorArray.length === 2) {
                options.shadow.vector = vectorArray;
            }
        }
    }

    if (document.getElementById('enableBorder').checked) {
        const width = validateIntegerInput('borderWidth');
        const color = document.getElementById('borderColor').value;

        options.border = {};
        if (width !== null) options.border.width = width;
        if (color) options.border.color = color;
    }

    if (document.getElementById('enableWatermark').checked) {
        const file = document.getElementById('watermarkFile').value;
        const size = validateIntegerInput('watermarkSize');
        const position = document.getElementById('watermarkPosition').value;

        if (file) {
            options.watermark = { file: file };
            if (size !== null) options.watermark.size = size;
            if (position) options.watermark.position = position.split(',');
        }
    }

    if (document.getElementById('enablePartialBlur').checked) {
        const objects = document.getElementById('partialBlurObjects').value;
        if (objects) {
            try {
                options.partial_blur = { objects: JSON.parse(objects) };
            } catch (e) {
                // ignore invalid JSON
            }
        }
    }

    if (document.getElementById('enablePartialPixelate').checked) {
        const objects = document.getElementById('partialPixelateObjects').value;
        if (objects) {
            try {
                options.partial_pixelate = { objects: JSON.parse(objects) };
            }
            catch (e) {
                // ignore invalid JSON
            }
        }
    }

    // Face transformations with validation
    if (document.getElementById('enableBlurFaces').checked) {
        const amount = validateIntegerInput('blurFacesAmount');
        const minSize = validateNumberInput('blurFacesMinSize');
        const maxSize = validateNumberInput('blurFacesMaxSize');

        options.blur_faces = {};
        if (amount !== null) options.blur_faces.amount = amount;
        if (minSize !== null) options.blur_faces.minsize = minSize;
        if (maxSize !== null) options.blur_faces.maxsize = maxSize;
    }

    if (document.getElementById('enableCropFaces').checked) {
        const width = validateIntegerInput('cropFacesWidth');
        const height = validateIntegerInput('cropFacesHeight');
        const mode = document.getElementById('cropFacesMode').value;

        options.crop_faces = {};
        if (width !== null) options.crop_faces.width = width;
        if (height !== null) options.crop_faces.height = height;
        if (mode) options.crop_faces.mode = mode;
    }

    if (document.getElementById('enablePixelateFaces').checked) {
        const amount = validateIntegerInput('pixelateFacesAmount');
        const minSize = validateNumberInput('pixelateFacesMinSize');
        const maxSize = validateNumberInput('pixelateFacesMaxSize');

        options.pixelate_faces = {};
        if (amount !== null) options.pixelate_faces.amount = amount;
        if (minSize !== null) options.pixelate_faces.minsize = minSize;
        if (maxSize !== null) options.pixelate_faces.maxsize = maxSize;
    }

    // Smart crop with validation
    if (document.getElementById('enableSmartCrop').checked) {
        const width = validateIntegerInput('smartCropWidth');
        const height = validateIntegerInput('smartCropHeight');
        const mode = document.getElementById('smartCropMode').value;

        if (width !== null && height !== null) {
            options.smart_crop = {
                width: width,
                height: height
            };
            if (mode !== 'auto') options.smart_crop.mode = mode;
        }
    }

    // AI Upscale
    if (document.getElementById('enableUpscale').checked) {
        const noise = document.getElementById('upscaleNoise').value;
        const style = document.getElementById('upscaleStyle').value;

        options.upscale = {};
        if (noise !== 'none') options.upscale.noise = noise;
        if (style) options.upscale.style = style;
    }

    // PDF processing
    if (document.getElementById('enablePdfConvert').checked) {
        const pages = document.getElementById('pdfPages').value;
        const pageFormat = document.getElementById('pdfPageFormat').value;
        const orientation = document.getElementById('pdfOrientation').value;

        options.pdfconvert = {};
        if (pages) options.pdfconvert.pages = pages.split(',').map(p => p.trim());
        if (pageFormat) options.pdfconvert.pageformat = pageFormat;
        if (orientation) options.pdfconvert.pageorientation = orientation;
    }

    if (document.getElementById('enablePdfInfo').checked) {
        options.pdfinfo = true;
    }

    // Output settings with validation
    const format = document.getElementById('outputFormat').value;
    if (format !== 'auto') {
        options.output = { format: format };
    }

    const quality = validateIntegerInput('outputQuality', 80);
    if (quality !== 80) {
        if (!options.output) options.output = {};
        options.output.quality = quality;
    }

    const compress = validateIntegerInput('outputCompress', 80);
    if (compress !== 80) {
        if (!options.output) options.output = {};
        options.output.compress = compress;
    }

    return options;
}

// Generate JavaScript picker code
function generateJavaScriptPickerCode(options) {
    let code = `// Filestack Picker Configuration\n`;
    const apiKey = (document.getElementById('globalApikey') && document.getElementById('globalApikey').value) || 'YOUR_API_KEY';
    code += `const apikey = "${apiKey}";\n`;
    code += `const client = filestack.init(apikey);\n\n`;

    // Build options object as code to preserve functions
    const lines = [];
    if (options.displayMode) lines.push(`  displayMode: '${options.displayMode}',`);
    if (options.lang) lines.push(`  lang: '${options.lang}',`);
    if (options.accept) lines.push(`  accept: ${JSON.stringify(options.accept)},`);
    if (options.fromSources) lines.push(`  fromSources: ${JSON.stringify(options.fromSources)},`);
    if (options.maxFiles) lines.push(`  maxFiles: ${options.maxFiles},`);
    if (options.minFiles) lines.push(`  minFiles: ${options.minFiles},`);
    if (options.maxSize) lines.push(`  maxSize: ${options.maxSize},`);
    if (options.concurrency) lines.push(`  concurrency: ${options.concurrency},`);
    if (options.imageDim) lines.push(`  imageDim: ${JSON.stringify(options.imageDim)},`);
    if (options.imageMax) lines.push(`  imageMax: ${JSON.stringify(options.imageMax)},`);
    if (options.imageMin) lines.push(`  imageMin: ${JSON.stringify(options.imageMin)},`);
    if (options.multipleFileUpload) lines.push(`  multipleFileUpload: true,`);
    if (options.disableThumbnails) lines.push(`  disableThumbnails: true,`);
    if (options.disableTransformer) lines.push(`  disableTransformer: true,`);
    if (options.hideModalWhenUploading) lines.push(`  hideModalWhenUploading: true,`);
    if (options.allowManualRetry) lines.push(`  allowManualRetry: true,`);
    if (options.uploadInBackground) lines.push(`  uploadInBackground: true,`);
    if (options.transformationsUI) lines.push(`  transformationsUI: true,`);
    if (options.cleanupImageExif) lines.push(`  cleanupImageExif: true,`);
    if (options.exposeOriginalFile) lines.push(`  exposeOriginalFile: true,`);
    if (options.modalSize) lines.push(`  modalSize: ${JSON.stringify(options.modalSize)},`);
    if (options.pasteMode) lines.push(`  pasteMode: '${options.pasteMode}',`);

    // storeTo
    if (options.storeTo) {
        lines.push(`  storeTo: ${JSON.stringify(options.storeTo, null, 2).replace(/\n/g, '\n  ')},`);
    }

    // uploadConfig (with optional callbacks)
    if (options.uploadConfig) {
        // Build uploadConfig body manually to include callbacks
        const uc = [];
        if (typeof options.uploadConfig.retry !== 'undefined') uc.push(`    retry: ${options.uploadConfig.retry},`);
        if (typeof options.uploadConfig.timeout !== 'undefined') uc.push(`    timeout: ${options.uploadConfig.timeout},`);
        if (options.uploadConfig.tags) uc.push(`    tags: ${JSON.stringify(options.uploadConfig.tags)},`);
        if (document.getElementById('enableUploadOnProgress')?.checked) {
            uc.push(`    onProgress: (evt) => { console.log('Upload progress', evt.totalPercent); },`);
        }
        if (document.getElementById('enableUploadOnRetry')?.checked) {
            uc.push(`    onRetry: (data) => { console.log('Retry upload', data); },`);
        }
        lines.push(`  uploadConfig: {\n${uc.join('\n')}\n  },`);
    }

    // Callbacks
    if (document.getElementById('enableOnFileSelected')?.checked) {
        lines.push(`  onFileSelected: (file) => {\n    if (file.size > 1000 * 1000) {\n      throw new Error('File too big, select something smaller than 1MB');\n    }\n  },`);
    }
    if (document.getElementById('enableAcceptFn')?.checked) {
        lines.push(`  acceptFn: (file, options) => {\n    return options.mimeFromMagicBytes(file.originalFile).then(() => Promise.resolve());\n  },`);
    }
    if (document.getElementById('enableOnUploadDone')?.checked) {
        lines.push(`  onUploadDone: (res) => {\n    console.log('PickerResponse', res);\n  },`);
    }

    const optionsCode = `const options = {\n${lines.join('\n')}\n};\n\n`;
    code += optionsCode;

    code += `const picker = client.picker(options);\n`;
    code += `picker.open();\n`;

    return code;
}

// Generate React picker code
function generateReactPickerCode(options) {
    const apiKey = (document.getElementById('globalApikey') && document.getElementById('globalApikey').value) || 'YOUR_API_KEY';
    let code = `// React Component with Filestack Picker\n`;
    code += `import React from 'react';\n`;
    code += `import { PickerOverlay } from 'filestack-react';\n\n`;

    code += `const FilestackPicker = () => {\n`;
    code += `  const onUploadDone = (res) => {\n`;
    code += `    console.log(res);\n`;
    code += `  };\n\n`;

    code += `  return (\n`;
    code += `    <PickerOverlay\n`;
    code += `      apikey={'${apiKey}'}\n`;
    code += `      pickerOptions={${JSON.stringify(options, null, 2)}}\n`;
    code += `      onUploadDone={onUploadDone}\n`;
    code += `    />\n`;
    code += `  );\n`;
    code += `};\n\n`;

    code += `export default FilestackPicker;\n`;

    return code;
}

// Generate Vue picker code
function generateVuePickerCode(options) {
    const apiKey = (document.getElementById('globalApikey') && document.getElementById('globalApikey').value) || 'YOUR_API_KEY';
    let code = `<!-- Vue Component with Filestack Picker -->\n`;
    code += `<template>\n`;
    code += `  <div>\n`;
    code += `    <picker-overlay\n`;
    code += `      :apikey="'${apiKey}'"\n`;
    code += `      :pickerOptions="${JSON.stringify(options, null, 2)}"\n`;
    code += `      @uploadDone="onUploadDone"\n`;
    code += `    />\n`;
    code += `  </div>\n`;
    code += `</template>\n\n`;

    code += `<script>\n`;
    code += `import { PickerOverlay } from 'filestack-vue';\n\n`;
    code += `export default {\n`;
    code += `  name: 'FilestackPicker',\n`;
    code += `  components: {\n`;
    code += `    PickerOverlay,\n`;
    code += `  },\n`;
    code += `  methods: {\n`;
    code += `    onUploadDone(res) {\n`;
    code += `      console.log(res);\n`;
    code += `    },\n`;
    code += `  },\n`;
    code += `};\n`;
    code += `</script>\n`;

    return code;
}

// Generate Angular picker code
function generateAngularPickerCode(options) {
    const apiKey = (document.getElementById('globalApikey') && document.getElementById('globalApikey').value) || 'YOUR_API_KEY';
    let code = `// Angular Component for Filestack Picker\n`;
    code += `// First, install: npm install filestack-js @filestack/angular\n\n`;

    code += `// In your app.module.ts:\n`;
    code += `import { BrowserModule } from '@angular/platform-browser';\n`;
    code += `import { NgModule } from '@angular/core';\n`;
    code += `import { FilestackModule } from '@filestack/angular';\n`;
    code += `import { AppComponent } from './app.component';\n\n`;

    code += `@NgModule({\n`;
    code += `  declarations: [AppComponent],\n`;
    code += `  imports: [\n`;
    code += `    BrowserModule,\n`;
    code += `    FilestackModule.forRoot({ apikey: '${apiKey}' })\n`;
    code += `  ],\n`;
    code += `  bootstrap: [AppComponent]\n`;
    code += `})\n`;
    code += `export class AppModule {}\n\n`;

    code += `// In your component:\n`;
    code += `import { Component } from '@angular/core';\n\n`;

    code += `@Component({\n`;
    code += `  selector: 'app-filestack-picker',\n`;
    code += `  template: \`\n`;
    code += `    <ng-picker-overlay\n`;
    code += `      [apikey]="apikey"\n`;
    code += `      (uploadSuccess)="onUploadSuccess($event)">\n`;
    code += `      <button class="custom-button">Open Picker</button>\n`;
    code += `    </ng-picker-overlay>\n`;
    code += `  \`\n`;
    code += `})\n`;
    code += `export class FilestackPickerComponent {\n`;
    code += `  apikey = '${apiKey}';\n\n`;

    code += `  onUploadSuccess(res: any) {\n`;
    code += `    console.log('Upload successful:', res);\n`;
    code += `  }\n`;
    code += `}\n`;

    return code;
}

// Generate NodeJS picker code
function generateNodeJSPickerCode(options) {
    const apiKey = (document.getElementById('globalApikey') && document.getElementById('globalApikey').value) || 'YOUR_API_KEY';
    let code = `// Node.js Server-side Filestack Implementation\n`;
    code += `const filestack = require('filestack-js');\n`;
    code += `const express = require('express');\n`;
    code += `const crypto = require('crypto');\n`;
    code += `const app = express();\n\n`;

    code += `const client = filestack.init('${apiKey}');\n`;
    code += `const APP_SECRET = 'YOUR_APP_SECRET'; // Get this from Developer Portal\n\n`;

    code += `// Generate security policy and signature manually\n`;
    code += `function generateSecurity() {\n`;
    code += `  const policy = {\n`;
    code += `    expiry: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now\n`;
    code += `    call: ['pick', 'read', 'stat', 'write', 'writeUrl', 'store', 'convert', 'remove', 'exif'],\n`;
    code += `    // Add more restrictions as needed\n`;
    code += `  };\n\n`;

    code += `  // Base64URL encode the policy\n`;
    code += `  const policyBase64 = Buffer.from(JSON.stringify(policy))\n`;
    code += `    .toString('base64')\n`;
    code += `    .replace(/\\+/g, '-')\n`;
    code += `    .replace(/\\//g, '_')\n`;
    code += `    .replace(/=/g, '');\n\n`;

    code += `  // Create HMAC-SHA256 signature\n`;
    code += `  const signature = crypto\n`;
    code += `    .createHmac('sha256', APP_SECRET)\n`;
    code += `    .update(policyBase64)\n`;
    code += `    .digest('hex');\n\n`;

    code += `  return { policy: policyBase64, signature };\n`;
    code += `}\n\n`;

    code += `// Endpoint to get security credentials for client-side use\n`;
    code += `app.get('/security', (req, res) => {\n`;
    code += `  const security = generateSecurity();\n`;
    code += `  res.json(security);\n`;
    code += `});\n\n`;

    code += `// Example picker initialization endpoint\n`;
    code += `app.get('/picker-config', (req, res) => {\n`;
    code += `  const security = generateSecurity();\n`;
    code += `  const pickerOptions = {\n`;
    code += `    ...${JSON.stringify(options, null, 4)},\n`;
    code += `    security: security\n`;
    code += `  };\n`;
    code += `  res.json({ apikey: '${apiKey}', options: pickerOptions });\n`;
    code += `});\n\n`;

    code += `app.listen(3000, () => {\n`;
    code += `  console.log('Server running on port 3000');\n`;
    code += `});\n`;

    return code;
}

// Generate URL picker code
function generateURLPickerCode(options) {
    let code = `// Filestack Picker URL configuration is not a public feature. Use the JS SDK.\n`;
    code += `// See structured docs: Web Picker + PickerOptions + Store/Upload Options.\n`;
    code += `// Recommended: client.picker(options).open() as in the JS example.\n`;

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
    code += `  );
`;
    code += `};

`;

    code += `export default FilestackTransform;
`;

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
    code += `  name: 'FilestackTransform',
`;
    code += `  data() {\n`;
    code += `    return {\n`;
    code += `      transformedUrl: ''\n`;
    code += `    };
`;
    code += `  },
`;
    code += `  mounted() {\n`;
    code += `    const apikey = "YOUR_APIKEY";\n`;
    code += `    const client = filestack.init(apikey);
`;

    if (options.handle) {
        code += `    const handle = "${options.handle}";\n`;
    } else {
        code += `    const handle = "YOUR_FILE_HANDLE";\n`;
    }

    code += `\n    const transformOptions = ${JSON.stringify(options, null, 4)};\n\n`;

    code += `    const url = client.transform(handle, transformOptions);
`;
    code += `    this.transformedUrl = url;
`;
    code += `  }\n`;
    code += `};
`;
    code += `</script>\n`;

    return code;
}

// Generate Angular transform code
function generateAngularTransformCode(options) {
    const apiKey = (document.getElementById('globalApikey') && document.getElementById('globalApikey').value) || 'YOUR_API_KEY';
    let code = `// Angular Component for Filestack Transform\n`;
    code += `// Using FilestackService from @filestack/angular\n\n`;

    code += `import { Component, OnInit } from '@angular/core';\n`;
    code += `import { FilestackService } from '@filestack/angular';\n\n`;

    code += `@Component({\n`;
    code += `  selector: 'app-filestack-transform',\n`;
    code += `  template: \`\n`;
    code += `    <input [(ngModel)]="handle" placeholder="Enter file handle">\n`;
    code += `    <button (click)="transformFile()">Transform</button>\n`;
    code += `    <img *ngIf="transformedUrl" [src]="transformedUrl" alt="Transformed">\n`;
    code += `  \`\n`;
    code += `})\n`;
    code += `export class FilestackTransformComponent implements OnInit {\n`;
    code += `  public handle: string = '';\n`;
    code += `  public transformedUrl: string = '';\n\n`;

    code += `  constructor(private filestackService: FilestackService) {}\n\n`;

    code += `  ngOnInit() {\n`;
    code += `    this.filestackService.init('${apiKey}');\n`;
    code += `  }\n\n`;

    code += `  transformFile() {\n`;
    code += `    if (!this.handle) return;\n`;
    code += `    const transformOptions = ${JSON.stringify(options, null, 4)};\n\n`;
    code += `    this.transformedUrl = this.filestackService.transform(this.handle, transformOptions);\n`;
    code += `  }\n`;
    code += `}\n`;

    return code;
}

// Generate NodeJS transform code
function generateNodeJSTransformCode(options) {
    const apiKey = (document.getElementById('globalApikey') && document.getElementById('globalApikey').value) || 'YOUR_API_KEY';
    let code = `// Node.js Server-side Filestack Transform\n`;
    code += `const filestack = require('filestack-js');\n`;
    code += `const express = require('express');\n`;
    code += `const crypto = require('crypto');\n`;
    code += `const app = express();\n\n`;

    code += `const client = filestack.init('${apiKey}');\n`;
    code += `const APP_SECRET = 'YOUR_APP_SECRET'; // Get this from Developer Portal\n\n`;

    code += `// Generate security policy for transformations\n`;
    code += `function generateSecurity() {\n`;
    code += `  const policy = {\n`;
    code += `    expiry: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now\n`;
    code += `    call: ['read', 'convert'],\n`;
    code += `  };\n\n`;

    code += `  // Base64URL encode the policy\n`;
    code += `  const policyBase64 = Buffer.from(JSON.stringify(policy))\n`;
    code += `    .toString('base64')\n`;
    code += `    .replace(/\\+/g, '-')\n`;
    code += `    .replace(/\\//g, '_')\n`;
    code += `    .replace(/=/g, '');\n\n`;

    code += `  // Create HMAC-SHA256 signature\n`;
    code += `  const signature = crypto\n`;
    code += `    .createHmac('sha256', APP_SECRET)\n`;
    code += `    .update(policyBase64)\n`;
    code += `    .digest('hex');\n\n`;

    code += `  return { policy: policyBase64, signature };\n`;
    code += `}\n\n`;

    code += `// Transform endpoint\n`;
    code += `app.get('/transform/:handle', (req, res) => {\n`;
    code += `  try {\n`;
    code += `    const handle = req.params.handle;\n`;
    code += `    const transformOptions = ${JSON.stringify(options, null, 4)};\n\n`;

    code += `    // Generate transform URL (client-side transforms don't need server processing)\n`;
    code += `    const transformedUrl = client.transform(handle, transformOptions);\n`;
    code += `    \n`;
    code += `    // If security is enabled, you can generate secured transform URLs\n`;
    code += `    const security = generateSecurity();\n`;
    code += `    const securedUrl = \`\${transformedUrl}?policy=\${security.policy}&signature=\${security.signature}\`;\n\n`;

    code += `    res.json({ \n`;
    code += `      success: true, \n`;
    code += `      url: transformedUrl,\n`;
    code += `      securedUrl: securedUrl\n`;
    code += `    });\n`;
    code += `  } catch (error) {\n`;
    code += `    res.status(500).json({ error: error.message });\n`;
    code += `  }\n`;
    code += `});\n\n`;

    code += `app.listen(3000, () => {\n`;
    code += `  console.log('Transform server running on port 3000');\n`;
    code += `});\n`;

    return code;
}

// Generate URL transform code
function generateURLTransformCode(options) {
    let code = `// Filestack Transform URL (CDN)\n`;
    code += `const base = 'https://cdn.filestackcontent.com';\n`;
    const handle = options.handle || 'YOUR_FILE_HANDLE';
    // Build only documented-safe segments (resize, crop, rotate, flip, flop, plus a few effects)
    const segments = [];
    if (options.resize) {
        const p = [];
        if (options.resize.width) p.push(`width:${options.resize.width}`);
        if (options.resize.height) p.push(`height:${options.resize.height}`);
        if (options.resize.fit) p.push(`fit:${options.resize.fit}`);
        segments.push(`resize=${p.join(',')}`);
    }
    if (options.crop && options.crop.dim) {
        segments.push(`crop=dim:[${options.crop.dim.join(',')}]`);
    }
    if (typeof options.rotate === 'number') {
        segments.push(`rotate=deg:${options.rotate}`);
    }
    if (options.flip) segments.push('flip');
    if (options.flop) segments.push('flop');
    if (typeof options.blur === 'number') segments.push(`blur=amount:${options.blur}`);
    if (typeof options.sepia === 'number') segments.push(`sepia=tone:${options.sepia}`);
    if (options.negative) segments.push('negative');
    if (typeof options.vignette === 'number') segments.push(`vignette=amount:${options.vignette}`);
    if (options.shadow) {
        const sp = [];
        if (typeof options.shadow.opacity !== 'undefined') sp.push(`opacity:${options.shadow.opacity}`);
        if (typeof options.shadow.x !== 'undefined' && typeof options.shadow.y !== 'undefined') sp.push(`vector:[${options.shadow.x},${options.shadow.y}]`);
        if (sp.length) segments.push(`shadow=${sp.join(',')}`);
    }
    if (options.border && typeof options.border.width !== 'undefined') segments.push(`border=width:${options.border.width}`);
    if (options.blackwhite && typeof options.blackwhite === 'object' && typeof options.blackwhite.threshold !== 'undefined') {
        segments.push(`blackwhite=threshold:${options.blackwhite.threshold}`);
    }
    if (options.partial_blur && Array.isArray(options.partial_blur.objects)) segments.push(`partial_blur=objects:[${options.partial_blur.objects.map(o => `[${o.join(',')}]`).join(',')}]`);
    if (options.partial_pixelate && Array.isArray(options.partial_pixelate.objects)) segments.push(`partial_pixelate=objects:[${options.partial_pixelate.objects.map(o => `[${o.join(',')}]`).join(',')}]`);
    if (options.smart_crop && options.smart_crop.width && options.smart_crop.height) {
        const sp = [`width:${options.smart_crop.width}`, `height:${options.smart_crop.height}`];
        if (options.smart_crop.mode) sp.push(`mode:${options.smart_crop.mode}`);
        segments.push(`smart_crop=${sp.join(',')}`);
    }
    if (options.pdfconvert || options.pdfinfo || (options.output && options.output.format === 'pdf')) {
        // Per docs, output=f:pdf should precede pdf tasks
        segments.unshift('output=f:pdf');
        if (options.pdfinfo) {
            // Minimal example from docs
            segments.push('pdfinfo=colorinfo:true');
        }
        if (options.pdfconvert) {
            const pp = [];
            if (options.pdfconvert.pageorientation) pp.push(`pageorientation:${options.pdfconvert.pageorientation}`);
            if (options.pdfconvert.pageformat) pp.push(`pageformat:${options.pdfconvert.pageformat}`);
            if (Array.isArray(options.pdfconvert.pages)) pp.push(`pages:[${options.pdfconvert.pages.join(',')}]`);
            if (pp.length) segments.push(`pdfconvert=${pp.join(',')}`);
        }
    }
    // Compose URL
    code += `const url = base + '/${segments.join('/')}/${handle}';\n`;
    code += `console.log('Transform URL:', url);\n`;
    return code;
}

// Update code display
function updateCodeDisplay(code, language) {
    const codeElement = document.getElementById('generatedCode');
    const codePanel = document.querySelector('.code-panel');

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

        // Add glow animation to code panel
        if (codePanel) {
            codePanel.classList.add('code-updated');
            setTimeout(() => {
                codePanel.classList.remove('code-updated');
            }, 600);
        }
    }
}

// Quick Start Templates
function loadTemplate(templateName) {
    const templates = {
        startup: {
            name: 'Startup / SaaS',
            description: 'Optimized for profile photos, documents, and team collaboration files',
            config: {
                displayMode: 'overlay',
                maxFiles: 10,
                maxSize: 10485760, // 10MB
                accept: ['image/*', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv'],
                fromSources: ['local_file_system', 'googledrive', 'dropbox', 'onedrive', 'url'],
                storeTo: { location: 's3' },
                transformations: { crop: true, rotate: true }
            }
        },
        ecommerce: {
            name: 'E-Commerce',
            description: 'Perfect for product images, invoices, and receipts',
            config: {
                displayMode: 'overlay',
                maxFiles: 20,
                maxSize: 5242880, // 5MB
                accept: ['image/jpeg', 'image/png', 'image/webp', '.pdf'],
                fromSources: ['local_file_system', 'url', 'webcam'],
                storeTo: { location: 's3' },
                transformations: { crop: true, rotate: true, circle: false },
                imageMin: [800, 800],
                imageMax: [4000, 4000]
            }
        },
        edtech: {
            name: 'EdTech / Learning',
            description: 'Designed for assignments, PDFs, videos, and educational content',
            config: {
                displayMode: 'overlay',
                maxFiles: 5,
                maxSize: 104857600, // 100MB
                accept: ['.pdf', '.doc', '.docx', '.ppt', '.pptx', 'video/*', 'image/*'],
                fromSources: ['local_file_system', 'googledrive', 'onedrive', 'dropbox', 'webcam'],
                storeTo: { location: 's3' },
                transformations: { crop: false, rotate: false }
            }
        },
        printing: {
            name: 'Printing Service',
            description: 'High-resolution images, PDFs, and design files with quality preservation',
            config: {
                displayMode: 'overlay',
                maxFiles: 15,
                maxSize: 52428800, // 50MB
                accept: ['image/*', '.pdf', '.ai', '.psd', '.eps', '.svg'],
                fromSources: ['local_file_system', 'googledrive', 'dropbox', 'url'],
                storeTo: { location: 's3' },
                transformations: { crop: true, rotate: true },
                imageMin: [2400, 2400],
                imageMax: [10000, 10000]
            }
        },
        healthcare: {
            name: 'Healthcare',
            description: 'HIPAA-compliant settings for medical records and sensitive documents',
            config: {
                displayMode: 'overlay',
                maxFiles: 5,
                maxSize: 20971520, // 20MB
                accept: ['.pdf', 'image/*', '.doc', '.docx', '.dicom'],
                fromSources: ['local_file_system', 'webcam'],
                storeTo: { location: 's3' },
                transformations: { crop: true, rotate: true },
                uploadInBackground: false
            }
        },
        media: {
            name: 'Media / Creative',
            description: 'For photos, videos, audio files, and large creative assets',
            config: {
                displayMode: 'overlay',
                maxFiles: 50,
                maxSize: 524288000, // 500MB
                accept: ['image/*', 'video/*', 'audio/*'],
                fromSources: ['local_file_system', 'googledrive', 'dropbox', 'instagram', 'facebook', 'webcam', 'video'],
                storeTo: { location: 's3' },
                transformations: { crop: true, rotate: true, circle: false },
                videoResolution: '1920x1080'
            }
        }
    };

    const template = templates[templateName];
    if (!template) {
        showNotification('Template not found', 'error');
        return;
    }

    // Apply configuration to form fields
    const config = template.config;

    // Display Mode
    if (config.displayMode) {
        document.querySelector(`input[name="displayMode"][value="${config.displayMode}"]`)?.click();
    }

    // Max Files
    if (config.maxFiles) {
        const maxFilesInput = document.getElementById('maxFiles');
        if (maxFilesInput) maxFilesInput.value = config.maxFiles;
    }

    // Max Size (convert bytes to MB for display)
    if (config.maxSize) {
        const maxSizeInput = document.getElementById('maxSize');
        if (maxSizeInput) maxSizeInput.value = Math.floor(config.maxSize / 1048576); // Convert bytes to MB
    }

    // File Acceptance - uncheck all first, then check the ones in config
    const fileAcceptanceSection = document.querySelector('.config-card:has(h3 .fa-file-alt)');
    if (fileAcceptanceSection && config.accept) {
        const allFileCheckboxes = fileAcceptanceSection.querySelectorAll('input[type="checkbox"]');
        allFileCheckboxes.forEach(checkbox => checkbox.checked = false);

        config.accept.forEach(acceptType => {
            const checkbox = Array.from(allFileCheckboxes).find(cb =>
                cb.value === acceptType ||
                (acceptType.includes('*') && cb.value.includes('*') && cb.value.split('/')[0] === acceptType.split('/')[0])
            );
            if (checkbox) checkbox.checked = true;
        });
    }

    // Sources - uncheck all first, then check the ones in config
    const sourcesSection = document.querySelector('.config-card:has(h3 .fa-cloud)');
    if (sourcesSection && config.fromSources) {
        const allSourceCheckboxes = sourcesSection.querySelectorAll('input[type="checkbox"]');
        allSourceCheckboxes.forEach(checkbox => checkbox.checked = false);

        config.fromSources.forEach(source => {
            const checkbox = Array.from(allSourceCheckboxes).find(cb => cb.value === source);
            if (checkbox) checkbox.checked = true;
        });
    }

    // Image dimensions
    if (config.imageMin) {
        const imageMinDimInput = document.getElementById('imageMinDim');
        if (imageMinDimInput) imageMinDimInput.value = config.imageMin.join(',');
    }

    if (config.imageMax) {
        const imageMaxDimInput = document.getElementById('imageMaxDim');
        if (imageMaxDimInput) imageMaxDimInput.value = config.imageMax.join(',');
    }

    // Storage location
    if (config.storeTo && config.storeTo.location) {
        const storeLocationSelect = document.getElementById('storeLocation');
        if (storeLocationSelect) {
            storeLocationSelect.value = config.storeTo.location === 's3' ? '' : config.storeTo.location;
        }
    }

    // Show success notification
    showNotification(`Template "${template.name}" loaded successfully!`, 'success');

    // Auto-generate code with the new configuration
    setTimeout(() => {
        manualGenerateCode();
    }, 300);
}

// Transformation Pipeline Templates
function loadTransformPipeline(pipelineName) {
    const pipelines = {
        profile: {
            name: 'Profile Picture',
            description: 'Perfect square profile image with optimization',
            transforms: [
                { id: 'enableResize', params: { resizeWidth: 400, resizeHeight: 400, resizeFit: 'crop' } },
                { id: 'enableCircle', params: {} },
                { id: 'enableEnhance', params: {} },
                { id: 'enableCompress', params: {} }
            ]
        },
        thumbnail: {
            name: 'Thumbnail',
            description: 'Small optimized thumbnail for galleries',
            transforms: [
                { id: 'enableResize', params: { resizeWidth: 200, resizeHeight: 200, resizeFit: 'max' } },
                { id: 'enableSharpen', params: { sharpenAmount: 3 } },
                { id: 'enableCompress', params: {} }
            ]
        },
        product: {
            name: 'Product Image',
            description: 'E-commerce product image with white background',
            transforms: [
                { id: 'enableResize', params: { resizeWidth: 1200, resizeHeight: 1200, resizeFit: 'max' } },
                { id: 'enableEnhance', params: {} },
                { id: 'enableSharpen', params: { sharpenAmount: 2 } },
                { id: 'enableCompress', params: {} }
            ]
        },
        social: {
            name: 'Social Media',
            description: 'Instagram/Facebook ready square image',
            transforms: [
                { id: 'enableResize', params: { resizeWidth: 1080, resizeHeight: 1080, resizeFit: 'crop' } },
                { id: 'enableEnhance', params: {} },
                { id: 'enableSharpen', params: { sharpenAmount: 2 } },
                { id: 'enableCompress', params: {} }
            ]
        },
        banner: {
            name: 'Hero Banner',
            description: 'Wide banner with subtle background blur',
            transforms: [
                { id: 'enableResize', params: { resizeWidth: 1920, resizeHeight: 600, resizeFit: 'crop' } },
                { id: 'enableBlur', params: { blurAmount: 2 } },
                { id: 'enableEnhance', params: {} },
                { id: 'enableCompress', params: {} }
            ]
        },
        print: {
            name: 'Print Ready',
            description: 'High resolution for printing without compression',
            transforms: [
                { id: 'enableResize', params: { resizeWidth: 3000, resizeHeight: 3000, resizeFit: 'max' } },
                { id: 'enableEnhance', params: {} }
            ]
        },
        vintage: {
            name: 'Vintage Filter',
            description: 'Old-school photo effect with sepia and vignette',
            transforms: [
                { id: 'enableSepia', params: { sepiaTone: 80 } },
                { id: 'enableVignette', params: { vignetteAmount: 50 } },
                { id: 'enableBlur', params: { blurAmount: 1 } }
            ]
        },
        modern: {
            name: 'Modern & Clean',
            description: 'Enhanced and sharpened for modern look',
            transforms: [
                { id: 'enableEnhance', params: {} },
                { id: 'enableSharpen', params: { sharpenAmount: 3 } },
                { id: 'enableCompress', params: {} }
            ]
        }
    };

    const pipeline = pipelines[pipelineName];
    if (!pipeline) {
        showNotification('Pipeline not found', 'error');
        return;
    }

    // Clear all transform checkboxes first
    document.querySelectorAll('#transform input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
        // Hide the input fields
        const inputs = checkbox.closest('.transform-option')?.querySelector('.transform-inputs');
        if (inputs) inputs.style.display = 'none';
    });

    // Apply pipeline transforms
    pipeline.transforms.forEach(transform => {
        const checkbox = document.getElementById(transform.id);
        if (checkbox) {
            checkbox.checked = true;

            // Show and populate input fields
            const inputsDiv = checkbox.closest('.transform-option')?.querySelector('.transform-inputs');
            if (inputsDiv) {
                inputsDiv.style.display = 'grid';

                // Set parameter values
                Object.keys(transform.params).forEach(paramKey => {
                    const input = document.getElementById(paramKey);
                    if (input) {
                        input.value = transform.params[paramKey];
                    }
                });
            }
        }
    });

    // Show success notification
    showNotification(`Pipeline "${pipeline.name}" loaded successfully!`, 'success');

    // Auto-generate code with the new configuration
    setTimeout(() => {
        manualGenerateCode();
    }, 300);
}

// Copy code to clipboard
function copyCode() {
    const codeElement = document.getElementById('generatedCode');
    const copyBtn = event?.target?.closest('.btn-secondary');

    if (codeElement) {
        const text = codeElement.textContent;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Code copied to clipboard!', 'success');

            // Add visual feedback to the button
            if (copyBtn) {
                copyBtn.classList.add('copied');
                const originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';

                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = originalHTML;
                }, 2000);
            }
        }).catch(() => {
            showNotification('Failed to copy code', 'error');
        });
    }
}

// ===== Missing generators to avoid ReferenceError and enable code output =====

// Display message for workflow-only sections (no code generation)
function showWorkflowOnlyMessage(sectionName) {
    const codeElement = document.getElementById('generatedCode');
    if (!codeElement) return;
    const pretty = {
        'video-tagging': 'Video Tagging',
        'video-sfw': 'Video SFW',
        'phishing': 'Phishing Detection',
        'virus': 'Virus Detection'
    };
    const title = pretty[sectionName] || 'This feature';
    const msg = `// ${title} is workflow-only in Filestack.\n// No client-side code snippet is generated here.\n// Use Workflows in the Developer Portal and call run_workflow + workflow_status.`;
    updateCodeDisplay(msg, 'javascript');
}

// Caption (Processing API: caption)
function generateCaptionCode() {
    // Get input type and values
    const inputType = document.querySelector('input[name="captionInputType"]:checked')?.value || 'handle';
    const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
    const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
    const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_FILESTACK_API_KEY';

    let source = '';
    let needsApiKey = false;

    // Determine source based on input type
    switch (inputType) {
        case 'handle':
            source = document.getElementById('captionHandle')?.value || 'YOUR_FILE_HANDLE';
            break;
        case 'external':
            source = document.getElementById('captionExternalUrl')?.value || 'https://example.com/image.jpg';
            needsApiKey = true;
            break;
        case 'storage':
            const alias = document.getElementById('captionStorageAlias')?.value || 'STORAGE_ALIAS';
            const path = document.getElementById('captionStoragePath')?.value || '/path/to/image.jpg';
            source = `src://${alias}${path}`;
            needsApiKey = true;
            break;
    }

    // Build transformation chain
    const enableChaining = document.getElementById('captionEnableChaining')?.checked || false;
    let transformChain = '';

    if (enableChaining) {
        const preSteps = document.querySelectorAll('#captionPreChainBuilder .chain-step');
        const preTransforms = [];

        preSteps.forEach(step => {
            const operation = step.querySelector('.chain-operation').value;
            const params = step.querySelector('.chain-params').value;
            if (operation) {
                if (params) {
                    preTransforms.push(`${operation}=${params}`);
                } else {
                    preTransforms.push(operation);
                }
            }
        });

        if (preTransforms.length > 0) {
            transformChain = preTransforms.join('/') + '/';
        }
    }

    // Build security part only if both policy and signature are provided
    const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
    const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
    const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';

    // Build final URL
    let url;
    if (needsApiKey) {
        url = `https://cdn.filestackcontent.com/${apiKey}/${sec}${transformChain}caption/${source}`;
    } else {
        url = `https://cdn.filestackcontent.com/${sec}${transformChain}caption/${source}`;
    }

    const tab = getCurrentTab();
    let code = '';

    if (tab === 'javascript') {
        code = `// Caption generation (Processing API)\nfetch('${url}')\n  .then(r => r.json())\n  .then(data => console.log('Caption:', data))\n  .catch(err => console.error('Caption failed:', err));`;

        if (transformChain) {
            code += `\n\n// This URL includes pre-processing transformations before caption generation`;
        }

        code += `\n\n// Usage Examples:\n// Basic handle: https://cdn.filestackcontent.com/security=p:<POLICY>,s:<SIGNATURE>/caption/<HANDLE>\n// With resize: https://cdn.filestackcontent.com/security=p:<POLICY>,s:<SIGNATURE>/resize=h:1000/caption/<HANDLE>\n// External URL: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/caption/<EXTERNAL_URL>\n// Storage Alias: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/caption/src://<ALIAS>/<PATH>`;

    } else if (tab === 'react') {
        code = `const Caption = () => {\n  const run = async () => {\n    const res = await fetch('${url}');\n    const data = await res.json();\n    console.log('Caption:', data);\n  };\n  return (<button onClick={run}>Generate Caption</button>);\n};`;

        if (transformChain) {
            code += `\n\n// This URL includes pre-processing transformations before caption generation`;
        }

    } else if (tab === 'vue') {
        code = `<template><button @click="run">Generate Caption</button></template>\n<script>export default { methods:{ async run(){ const r=await fetch('${url}'); console.log('Caption:', await r.json()); } } }</script>`;

        if (transformChain) {
            code += `\n\n<!-- This URL includes pre-processing transformations before caption generation -->`;
        }

    } else if (tab === 'url') {
        code = `// Caption URL\nconst url = '${url}';`;

        if (transformChain) {
            code += `\n\n// This URL includes pre-processing transformations before caption generation`;
        }

        code += `\n\n// URL Format Examples:\n// Basic handle: https://cdn.filestackcontent.com/security=p:<POLICY>,s:<SIGNATURE>/caption/<HANDLE>\n// With resize: https://cdn.filestackcontent.com/security=p:<POLICY>,s:<SIGNATURE>/resize=h:1000/caption/<HANDLE>\n// External URL: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/caption/<EXTERNAL_URL>\n// Storage Alias: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/caption/src://<ALIAS>/<PATH>`;
    }

    updateCodeDisplay(code, tab);
}

// Tagging
function generateTaggingCode() {
    // Get input type and values
    const inputType = document.querySelector('input[name="taggingInputType"]:checked')?.value || 'handle';
    const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
    const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
    const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_FILESTACK_API_KEY';

    let source = '';
    let needsApiKey = false;

    // Determine source based on input type
    switch (inputType) {
        case 'handle':
            source = document.getElementById('taggingHandle')?.value || 'YOUR_FILE_HANDLE';
            break;
        case 'external':
            source = document.getElementById('taggingExternalUrl')?.value || 'https://example.com/image.jpg';
            needsApiKey = true;
            break;
        case 'storage':
            const alias = document.getElementById('taggingStorageAlias')?.value || 'STORAGE_ALIAS';
            const path = document.getElementById('taggingStoragePath')?.value || '/path/to/image.jpg';
            source = `src://${alias}${path}`;
            needsApiKey = true;
            break;
    }

    // Build transformation chain
    const enableChaining = document.getElementById('taggingEnableChaining')?.checked || false;
    let transformChain = '';

    if (enableChaining) {
        const preSteps = document.querySelectorAll('#taggingPreChainBuilder .chain-step');
        const preTransforms = [];

        preSteps.forEach(step => {
            const operation = step.querySelector('.chain-operation').value;
            const params = step.querySelector('.chain-params').value;
            if (operation) {
                if (params) {
                    preTransforms.push(`${operation}=${params}`);
                } else {
                    preTransforms.push(operation);
                }
            }
        });

        if (preTransforms.length > 0) {
            transformChain = preTransforms.join('/') + '/';
        }
    }

    // Build security part only if both policy and signature are provided
    const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
    const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
    const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';

    // Build final URL
    let url;
    if (needsApiKey) {
        url = `https://cdn.filestackcontent.com/${apiKey}/${sec}${transformChain}tags=version:2/${source}`;
    } else {
        url = `https://cdn.filestackcontent.com/${sec}${transformChain}tags=version:2/${source}`;
    }

    const tab = getCurrentTab();
    let code = '';

    if (tab === 'javascript') {
        code = `// Image tagging (Processing API)\nfetch('${url}')\n  .then(r => r.json())\n  .then(data => console.log('Tags:', data))\n  .catch(err => console.error('Tagging failed:', err));`;

        if (transformChain) {
            code += `\n\n// This URL includes pre-processing transformations before tagging`;
        }

        code += `\n\n// Usage Examples:\n// Basic handle: https://cdn.filestackcontent.com/security=p:<POLICY>,s:<SIGNATURE>/tags=version:2/<HANDLE>\n// With resize: https://cdn.filestackcontent.com/security=p:<POLICY>,s:<SIGNATURE>/resize=h:2000/tags=version:2/<HANDLE>\n// External URL: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/tags=version:2/<EXTERNAL_URL>\n// Storage Alias: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/tags=version:2/src://<ALIAS>/<PATH>`;

    } else if (tab === 'react') {
        code = `const Tagging = () => {\n  const run = async () => {\n    const res = await fetch('${url}');\n    const data = await res.json();\n    console.log('Tags:', data);\n  };\n  return (<button onClick={run}>Tag Image</button>);\n};`;

        if (transformChain) {
            code += `\n\n// This URL includes pre-processing transformations before tagging`;
        }

    } else if (tab === 'vue') {
        code = `<template><button @click="run">Tag Image</button></template>\n<script>export default { methods:{ async run(){ const r=await fetch('${url}'); console.log('Tags:', await r.json()); } } }</script>`;

        if (transformChain) {
            code += `\n\n<!-- This URL includes pre-processing transformations before tagging -->`;
        }

    } else if (tab === 'url') {
        code = `// Tagging URL\nconst url = '${url}';`;

        if (transformChain) {
            code += `\n\n// This URL includes pre-processing transformations before tagging`;
        }

        code += `\n\n// URL Format Examples:\n// Basic handle: https://cdn.filestackcontent.com/security=p:<POLICY>,s:<SIGNATURE>/tags=version:2/<HANDLE>\n// With resize: https://cdn.filestackcontent.com/security=p:<POLICY>,s:<SIGNATURE>/resize=h:2000/tags=version:2/<HANDLE>\n// External URL: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/tags=version:2/<EXTERNAL_URL>\n// Storage Alias: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/tags=version:2/src://<ALIAS>/<PATH>`;
    }

    updateCodeDisplay(code, tab);
}

// OCR
function generateOcrCode() {
    // Get input type and values
    const inputType = document.querySelector('input[name="ocrInputType"]:checked')?.value || 'handle';
    const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
    const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
    const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_FILESTACK_API_KEY';

    let source = '';
    let needsApiKey = false;

    // Determine source based on input type
    switch (inputType) {
        case 'handle':
            source = document.getElementById('ocrHandle')?.value || 'YOUR_FILE_HANDLE';
            break;
        case 'external':
            source = document.getElementById('ocrExternalUrl')?.value || 'https://example.com/document.pdf';
            needsApiKey = true;
            break;
        case 'storage':
            const alias = document.getElementById('ocrStorageAlias')?.value || 'STORAGE_ALIAS';
            const path = document.getElementById('ocrStoragePath')?.value || '/path/to/document.pdf';
            source = `src://${alias}${path}`;
            needsApiKey = true;
            break;
    }

    // Build transformation chain
    const enableChaining = document.getElementById('ocrEnableChaining')?.checked || false;
    let transformChain = '';

    if (enableChaining) {
        const preSteps = document.querySelectorAll('#ocrPreChainBuilder .chain-step');
        const preTransforms = [];

        preSteps.forEach(step => {
            const operation = step.querySelector('.chain-operation').value;
            const params = step.querySelector('.chain-params').value;
            if (operation) {
                if (params) {
                    preTransforms.push(`${operation}=${params}`);
                } else {
                    preTransforms.push(operation);
                }
            }
        });

        if (preTransforms.length > 0) {
            transformChain = preTransforms.join('/') + '/';
        }
    }

    // OCR specific options
    const withDoc = !!document.getElementById('ocrWithDocDetection')?.checked;
    const coords = !!document.getElementById('ocrCoordinates')?.checked;
    const preprocess = !!document.getElementById('ocrPreprocess')?.checked;
    const docPart = withDoc ? `doc_detection=coords:${coords ? 'true' : 'false'},preprocess:${preprocess ? 'true' : 'false'}/` : '';

    // Build security part only if both policy and signature are provided
    const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
    const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
    const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';

    // Build final URL
    let url;
    if (needsApiKey) {
        url = `https://cdn.filestackcontent.com/${apiKey}/${sec}${transformChain}${docPart}ocr/${source}`;
    } else {
        url = `https://cdn.filestackcontent.com/${sec}${transformChain}${docPart}ocr/${source}`;
    }

    const tab = getCurrentTab();
    let code = '';

    if (tab === 'javascript') {
        code = `// OCR via Processing API\nfetch('${url}')\n  .then(r => r.json())\n  .then(data => console.log('OCR:', data))\n  .catch(err => console.error('OCR failed:', err));`;

        if (transformChain) {
            code += `\n\n// This URL includes pre-processing transformations before OCR`;
        }

        code += `\n\n// Usage Examples:\n// Basic handle: https://cdn.filestackcontent.com/security=p:<POLICY>,s:<SIGNATURE>/ocr/<HANDLE>\n// External URL: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/ocr/<EXTERNAL_URL>\n// Storage Alias: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/ocr/src://<ALIAS>/<PATH>`;

    } else if (tab === 'react') {
        code = `const OCR = () => {\n  const run = async () => {\n    const res = await fetch('${url}');\n    const data = await res.json();\n    console.log('OCR:', data);\n  };\n  return (<button onClick={run}>Run OCR</button>);\n};`;

        if (transformChain) {
            code += `\n\n// This URL includes pre-processing transformations before OCR`;
        }

    } else if (tab === 'vue') {
        code = `<template><button @click="run">Run OCR</button></template>\n<script>export default { methods:{ async run(){ const r=await fetch('${url}'); console.log('OCR:', await r.json()); } } }</script>`;

        if (transformChain) {
            code += `\n\n<!-- This URL includes pre-processing transformations before OCR -->`;
        }

    } else if (tab === 'url') {
        code = `// OCR URL\nconst url = '${url}';`;

        if (transformChain) {
            code += `\n\n// This URL includes pre-processing transformations before OCR`;
        }

        code += `\n\n// URL Format Examples:\n// Basic handle: https://cdn.filestackcontent.com/security=p:<POLICY>,s:<SIGNATURE>/ocr/<HANDLE>\n// External URL: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/ocr/<EXTERNAL_URL>\n// Storage Alias: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/ocr/src://<ALIAS>/<PATH>`;
    }

    updateCodeDisplay(code, tab);
}

// Faces (hoisted global)
function generateFacesCode() {
    const values = (function collectFacesOptions() {
        const handle = document.getElementById('facesHandle')?.value || 'YOUR_FILE_HANDLE';
        const minSize = validateNumberInput('facesMinSize');
        const maxSize = validateNumberInput('facesMaxSize');
        const exportOption = !!document.getElementById('facesExport')?.checked;
        const parts = [];
        if (minSize !== null) parts.push(`minsize:${minSize}`);
        if (maxSize !== null) parts.push(`maxsize:${maxSize}`);
        if (exportOption) parts.push('export:true');
        return { handle, params: parts.join(',') };
    })();
    const tab = getCurrentTab();
    const url = `https://cdn.filestackcontent.com/detect_faces${values.params ? `=${values.params}` : ''}/${values.handle}`;
    let code = '';
    if (tab === 'javascript') {
        code = `// Face detection\nfetch('${url}')\n  .then(r => r.json())\n  .then(data => console.log('Faces:', data))\n  .catch(err => console.error('Face detection failed:', err));`;
    } else if (tab === 'react') {
        code = `const Faces = () => {\n  const run = async () => {\n    const res = await fetch('${url}');\n    const data = await res.json();\n    console.log('Faces:', data);\n  };\n  return (<button onClick={run}>Detect Faces</button>);\n};`;
    } else if (tab === 'vue') {
        code = `<template><button @click=\"run\">Detect Faces</button></template>\n<script>\nexport default {\n  methods:{\n    async run(){\n      const res = await fetch('${url}');\n      const data = await res.json();\n      console.log('Faces:', data);\n    }\n  }\n}\n</script>`;
    } else if (tab === 'url') {
        code = `// Face detection URL\nconst url = '${url}';`;
    }
    updateCodeDisplay(code, tab);
}

// Security
function generateSecurityCode() {
    const policy = document.getElementById('securityPolicy')?.value || 'BASE64_POLICY';
    const signature = document.getElementById('securitySignature')?.value || 'SIGNATURE';
    const tab = getCurrentTab();
    let code = '';
    if (tab === 'javascript') {
        code = `// Initialize Filestack with security\nconst client = filestack.init('YOUR_APIKEY', {\n  security: { policy: '${policy}', signature: '${signature}' }\n});`;
    } else if (tab === 'react') {
        code = `import { PickerOverlay } from 'filestack-react';\n\n<PickerOverlay apikey={"YOUR_APIKEY"} pickerOptions={{ security: { policy: '${policy}', signature: '${signature}' } }} />`;
    } else if (tab === 'vue') {
        code = `<picker-overlay :apikey=\"'YOUR_APIKEY'\" :pickerOptions=\"{ security: { policy: '${policy}', signature: '${signature}' } }\" />`;
    } else if (tab === 'url') {
        code = `// URL usage\nconst url = 'https://cdn.filestackcontent.com/security=p:${policy},s:${signature}/sfw/YOUR_FILE_HANDLE';`;
    }
    updateCodeDisplay(code, tab);
}

// Store
function generateStoreCode() {
    const location = document.getElementById('storeLocation')?.value || 's3';
    const path = document.getElementById('storePath')?.value || '/uploads/';
    const access = document.getElementById('storeAccess')?.value || 'public';
    const workflows = !!document.getElementById('storeWorkflows')?.checked;
    const metadata = !!document.getElementById('storeMetadata')?.checked;
    const versioning = !!document.getElementById('storeVersioning')?.checked;
    const storeTo = { location, path, access }; // simplified
    const tab = getCurrentTab();
    let code = '';
    if (tab === 'javascript') {
        code = `const client = filestack.init('YOUR_APIKEY');\nconst picker = client.picker({ storeTo: ${JSON.stringify(storeTo, null, 2)} });\npicker.open();`;
    } else if (tab === 'react') {
        code = `import { PickerOverlay } from 'filestack-react';\n\n<PickerOverlay apikey={"YOUR_APIKEY"} pickerOptions={{ storeTo: ${JSON.stringify(storeTo)} }} />`;
    } else if (tab === 'vue') {
        code = `<picker-overlay :apikey=\"'YOUR_APIKEY'\" :pickerOptions=\"{ storeTo: ${JSON.stringify(storeTo)} }\" />`;
    } else if (tab === 'url') {
        code = `// StoreTo is configured via picker options, not direct URL.`;
    }
    updateCodeDisplay(code, tab);
}

// Metadata
function generateMetadataCode() {
    const handle = document.getElementById('metadataHandle')?.value || 'YOUR_FILE_HANDLE';
    const policy = document.getElementById('securityPolicy')?.value || '';
    const signature = document.getElementById('securitySignature')?.value || '';
    const qs = policy && signature ? `?policy=${encodeURIComponent(policy)}&signature=${encodeURIComponent(signature)}` : '';
    const url = `https://www.filestackapi.com/api/file/${handle}/metadata${qs}`;
    const tab = getCurrentTab();
    let code = '';
    if (tab === 'javascript') {
        code = `// File metadata (File API)\nfetch('${url}')\n  .then(r => r.json())\n  .then(data => console.log('Metadata:', data))\n  .catch(err => console.error('Metadata failed:', err));`;
    } else if (tab === 'react') {
        code = `const Metadata = () => {\n  const run = async () => {\n    const res = await fetch('${url}');\n    const data = await res.json();\n    console.log('Metadata:', data);\n  };\n  return (<button onClick={run}>Get Metadata</button>);\n};`;
    } else if (tab === 'vue') {
        code = `<template><button @click=\"run\">Get Metadata</button></template>\n<script>export default { methods:{ async run(){ const r=await fetch('${url}'); console.log('Metadata:', await r.json()); } } }</script>`;
    } else if (tab === 'url') {
        code = `// File API metadata URL\nconst url = '${url}';`;
    }
    updateCodeDisplay(code, tab);
}

// Drag & Drop (Drop Pane via Picker)
function generateDndCode() {
    const accept = document.getElementById('dndAccept')?.value || '';
    const maxSize = validateIntegerInput('dndMaxSize');
    const maxFiles = validateIntegerInput('dndMaxFiles');
    const failOver = !!document.getElementById('dndFailOverMaxFiles')?.checked;
    const container = document.getElementById('dndContainer')?.value || '.drop-container';
    const policy = document.getElementById('dndPolicy')?.value || '';
    const signature = document.getElementById('dndSignature')?.value || '';
    const cname = document.getElementById('dndCname')?.value || '';
    const config = {};
    if (accept) config.accept = accept.split(',').map(s => s.trim());
    if (maxSize !== null) config.maxSize = maxSize;
    if (maxFiles !== null) config.maxFiles = maxFiles;
    if (failOver) config.failOverMaxFiles = true;
    const sdkConfigParts = [];
    if (cname) sdkConfigParts.push(`cname: '${cname}'`);
    if (policy && signature) sdkConfigParts.push(`security: { policy: '${policy}', signature: '${signature}' }`);
    const sdkConfig = sdkConfigParts.length ? `const sdkConfig = { ${sdkConfigParts.join(', ')} }\n\n` : '';
    const tab = getCurrentTab();
    let code = '';
    const base = `${sdkConfig}const filestackDnDInstance = new filestackDnD.init('YOUR_APIKEY', document.querySelector('${container}')${Object.keys(config).length ? `, ${JSON.stringify(config, null, 2)}` : ''}${sdkConfigParts.length ? `, null, null, sdkConfig` : ''});`;
    if (tab === 'javascript') {
        code = base;
    } else if (tab === 'react') {
        code = `// Include filestack-drag-and-drop script in index.html\n// Then use in componentDidMount / useEffect:\n${base}`;
    } else if (tab === 'vue') {
        code = `<!-- Include filestack-drag-and-drop script in index.html -->\n<script>\nexport default {\n  mounted(){\n    ${base}\n  }\n}\n</script>`;
    } else if (tab === 'url') {
        code = `// Drag & Drop is a JS library initialization, not a URL.`;
    }
    updateCodeDisplay(code, tab);
}

// Video Tagging (Workflow-only)
// (removed) Workflow-only: no code generation for Video Tagging

// Video SFW (Workflow-only)
// (removed) Workflow-only: no code generation for Video SFW


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
    } else if (currentSection === 'dnd') {
        testDnd();
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
document.addEventListener('click', function (e) {
    const modal = document.getElementById('previewModal');
    if (modal && e.target === modal) {
        closePreviewModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
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

    if (document.getElementById('uploadWorkflows').checked) {
        options.workflows = true;
    }

    return options;
}

function generateJavaScriptUploadCode(options) {
    return `// Upload file to Filestack\nconst file = document.getElementById('uploadFile').files[0];\nif (!file) {\n    console.error('Please select a file');\n    return;\n}\n\nconst client = filestack.init('YOUR_APIKEY');\n\nclient.upload(file, ${JSON.stringify(options, null, 2)})\n    .then(response => {\n        console.log('Upload successful:', response);\n        // Handle successful upload\n    })\n    .catch(error => {\n        console.error('Upload failed:', error);\n        // Handle upload error\n    });`;
}

function generateReactUploadCode(options) {
    return `import { filestack } from 'filestack-react';\n\nconst UploadComponent = () => {\n    const client = filestack.init('YOUR_APIKEY');\n    \n    const handleUpload = async (file) => {\n        try {\n            const response = await client.upload(file, ${JSON.stringify(options, null, 2)});\n            console.log('Upload successful:', response);\n            // Handle successful upload\n        } catch (error) {\n            console.error('Upload failed:', error);\n            // Handle upload error\n        }\n    };\n    \n    return (\n        <input \n            type="file" \n            onChange={(e) => handleUpload(e.target.files[0])}\n            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"\n        />\n    );\n};`;
}

function generateVueUploadCode(options) {
    return `<template>\n    <input \n        type="file" \n        @change="handleUpload"\n        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"\n    />\n</template>\n\n<script>\nimport { filestack } from 'filestack-js';\n\nexport default {\n    methods: {\n        async handleUpload(event) {\n            const file = event.target.files[0];\n            if (!file) return;\n            \n            const client = filestack.init('YOUR_APIKEY');\n            \n            try {\n                const response = await client.upload(file, ${JSON.stringify(options, null, 2)});\n                console.log('Upload successful:', response);\n                // Handle successful upload\n            } catch (error) {\n                console.error('Upload failed:', error);\n                // Handle upload error\n            }\n        }\n    }\n};\n</script>`;
}

function generateURLUploadCode(options) {
    return `// Direct upload URL\nconst uploadUrl = 'https://www.filestackapi.com/api/store/S3?key=YOUR_APIKEY${Object.entries(options).map(([key, value]) => `&${key}=${encodeURIComponent(value)}`).join('')}';\n\n// Use with fetch or XMLHttpRequest\nfetch(uploadUrl, {\n    method: 'POST',\n    body: formData\n})\n.then(response => response.json())\n.then(data => console.log('Upload successful:', data))\n.catch(error => console.error('Upload failed:', error));`;
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

    return { ...options, handle: handle || 'YOUR_FILE_HANDLE' };
}

function generateJavaScriptDownloadCode(options) {
    const { handle, ...downloadOptions } = options;
    const params = Object.entries(downloadOptions).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    const url = `https://cdn.filestackcontent.com/${handle}${params ? '?' + params : ''}`;
    const fname = downloadOptions.filename || 'download';
    return `// Download via CDN URL\nconst link = document.createElement('a');\nlink.href = '${url}';\nlink.download = '${fname}';\ndocument.body.appendChild(link);\nlink.click();\nlink.remove();`;
}

function generateReactDownloadCode(options) {
    const { handle, ...downloadOptions } = options;
    const params = Object.entries(downloadOptions).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    const url = `https://cdn.filestackcontent.com/${handle}${params ? '?' + params : ''}`;
    const fname = downloadOptions.filename || 'download';
    return `const DownloadComponent = () => {\n  const handleDownload = () => {\n    const link = document.createElement('a');\n    link.href = '${url}';\n    link.download = '${fname}';\n    document.body.appendChild(link);\n    link.click();\n    link.remove();\n  };\n  return (<button onClick={handleDownload}>Download File</button>);\n};`;
}

function generateVueDownloadCode(options) {
    const { handle, ...downloadOptions } = options;
    const params = Object.entries(downloadOptions).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    const url = `https://cdn.filestackcontent.com/${handle}${params ? '?' + params : ''}`;
    const fname = downloadOptions.filename || 'download';
    return `<template>\n  <button @click=\"handleDownload\">Download File</button>\n</template>\n\n<script>\nexport default {\n  methods: {\n    handleDownload(){\n      const link = document.createElement('a');\n      link.href = '${url}';\n      link.download = '${fname}';\n      document.body.appendChild(link);\n      link.click();\n      link.remove();\n    }\n  }\n};\n</script>`;
}

// Phishing (Workflow-only)
// (removed) Workflow-only: no code generation for Phishing Detection

// Virus (Workflow-only)
// (removed) Workflow-only: no code generation for Virus Detection

function generateURLDownloadCode(options) {
    const { handle, ...downloadOptions } = options;
    const params = Object.entries(downloadOptions).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    return `// Direct download URL\nconst downloadUrl = 'https://cdn.filestackcontent.com/${handle}${params ? '?' + params : ''}';\n\n// Use with fetch or create download link\nconst link = document.createElement('a');\nlink.href = downloadUrl;\nlink.download = '${downloadOptions.filename || 'download'}';\nlink.click();`;
}

function testDownload() {
    const handle = document.getElementById('downloadHandle');
    if (!handle) {
        showNotification('Please enter a file handle or URL', 'error');
        return;
    }

    showNotification('Download functionality would be tested here with a real API key', 'info');
}

// Intelligence Functions
function generateSfwCode() {
    // Get input type and values
    const inputType = document.querySelector('input[name="sfwInputType"]:checked')?.value || 'handle';
    const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
    const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
    const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_FILESTACK_API_KEY';

    let source = '';
    let needsApiKey = false;

    // Determine source based on input type
    switch (inputType) {
        case 'handle':
            source = document.getElementById('sfwHandle')?.value || 'YOUR_FILE_HANDLE';
            break;
        case 'external':
            source = document.getElementById('sfwExternalUrl')?.value || 'https://example.com/image.jpg';
            needsApiKey = true;
            break;
        case 'storage':
            const alias = document.getElementById('sfwStorageAlias')?.value || 'STORAGE_ALIAS';
            const path = document.getElementById('sfwStoragePath')?.value || '/path/to/image.jpg';
            source = `src://${alias}${path}`;
            needsApiKey = true;
            break;
    }

    // Build transformation chain
    const enableChaining = document.getElementById('sfwEnableChaining')?.checked || false;
    let transformChain = '';

    if (enableChaining) {
        const preSteps = document.querySelectorAll('#sfwPreChainBuilder .chain-step');
        const preTransforms = [];

        preSteps.forEach(step => {
            const operation = step.querySelector('.chain-operation').value;
            const params = step.querySelector('.chain-params').value;
            if (operation) {
                if (params) {
                    preTransforms.push(`${operation}=${params}`);
                } else {
                    preTransforms.push(operation);
                }
            }
        });

        if (preTransforms.length > 0) {
            transformChain = preTransforms.join('/') + '/';
        }
    }

    // Build security part only if both policy and signature are provided
    const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
    const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
    const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';

    // Build final URL
    let url;
    if (needsApiKey) {
        url = `https://cdn.filestackcontent.com/${apiKey}/${sec}${transformChain}sfw/${source}`;
    } else {
        url = `https://cdn.filestackcontent.com/${sec}${transformChain}sfw/${source}`;
    }

    const tab = getCurrentTab();
    let code = '';

    if (tab === 'javascript') {
        code = `// Safe for Work detection via Processing API\nfetch('${url}')\n  .then(r => r.json())\n  .then(data => console.log('SFW analysis:', data))\n  .catch(err => console.error('SFW analysis failed:', err));`;

        if (transformChain) {
            code += `\n\n// This URL includes pre-processing transformations before SFW analysis`;
        }

        code += `\n\n// Usage Examples:\n// Basic handle: https://cdn.filestackcontent.com/security=p:<POLICY>,s:<SIGNATURE>/sfw/<HANDLE>\n// External URL: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/sfw/<EXTERNAL_URL>\n// Storage Alias: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/sfw/src://<ALIAS>/<PATH>`;

    } else if (tab === 'react') {
        code = `const SFW = () => {\n  const run = async () => {\n    const res = await fetch('${url}');\n    const data = await res.json();\n    console.log('SFW analysis:', data);\n  };\n  return (<button onClick={run}>Analyze SFW</button>);\n};`;

        if (transformChain) {
            code += `\n\n// This URL includes pre-processing transformations before SFW analysis`;
        }

    } else if (tab === 'vue') {
        code = `<template><button @click="run">Analyze SFW</button></template>\n<script>export default { methods:{ async run(){ const r=await fetch('${url}'); console.log('SFW analysis:', await r.json()); } } }</script>`;

        if (transformChain) {
            code += `\n\n<!-- This URL includes pre-processing transformations before SFW analysis -->`;
        }

    } else if (tab === 'url') {
        code = `// SFW URL\nconst url = '${url}';`;

        if (transformChain) {
            code += `\n\n// This URL includes pre-processing transformations before SFW analysis`;
        }

        code += `\n\n// URL Format Examples:\n// Basic handle: https://cdn.filestackcontent.com/security=p:<POLICY>,s:<SIGNATURE>/sfw/<HANDLE>\n// External URL: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/sfw/<EXTERNAL_URL>\n// Storage Alias: https://cdn.filestackcontent.com/<API_KEY>/security=p:<POLICY>,s:<SIGNATURE>/sfw/src://<ALIAS>/<PATH>`;
    }

    updateCodeDisplay(code, tab);
}

function collectSfwOptions() {
    const options = {};

    const handle = document.getElementById('sfwHandle').value;

    return { ...options, handle: handle || 'YOUR_FILE_HANDLE' };
}

function generateJavaScriptSfwCode(options) {
    const { handle } = options;
    const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
    const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
    // Build security part only if both policy and signature are provided
    const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
    const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
    const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';
    return `// Safe for Work detection via Processing API (CDN)\nconst url = 'https://cdn.filestackcontent.com/${sec}sfw/${handle}';\n\nfetch(url)\n  .then(r => r.json())\n  .then(data => {\n    console.log('SFW analysis:', data);\n  })\n  .catch(err => console.error('SFW analysis failed:', err));`;
}

function generateReactSfwCode(options) {
    const { handle } = options;
    const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
    const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
    // Build security part only if both policy and signature are provided
    const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
    const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
    const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';
    return `const SfwComponent = () => {\n  const analyzeSfw = async () => {\n    const url = 'https://cdn.filestackcontent.com/${sec}sfw/${handle}';\n    const res = await fetch(url);\n    const data = await res.json();\n    console.log('SFW analysis:', data);\n  };\n  return (<button onClick={analyzeSfw}>Analyze Content Safety</button>);\n};`;
}

function generateVueSfwCode(options) {
    const { handle } = options;
    const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
    const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
    // Build security part only if both policy and signature are provided
    const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
    const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
    const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';
    return `<template>\n  <button @click="analyzeSfw">Analyze Content Safety</button>\n</template>\n\n<script>\nexport default {\n  methods: {\n    async analyzeSfw() {\n      const url = 'https://cdn.filestackcontent.com/${sec}sfw/${handle}';\n      const res = await fetch(url);\n      const data = await res.json();\n      console.log('SFW analysis:', data);\n    }\n  }\n};\n</script>`;
}

function generateURLSfwCode(options) {
    const { handle } = options;
    const policy = document.getElementById('securityPolicy')?.value || 'YOUR_POLICY';
    const signature = document.getElementById('securitySignature')?.value || 'YOUR_SIGNATURE';
    // Build security part only if both policy and signature are provided
    const hasPolicy = policy && policy !== 'YOUR_POLICY' && policy.trim();
    const hasSignature = signature && signature !== 'YOUR_SIGNATURE' && signature.trim();
    const sec = (hasPolicy && hasSignature) ? `security=p:${policy},s:${signature}/` : '';
    return `// SFW URL (Processing API)\nconst sfwUrl = 'https://cdn.filestackcontent.com/${sec}sfw/${handle}';`;
}

function testSfw() {
    const handle = document.getElementById('sfwHandle').value;
}

// Transform Chains functionality
// Get parameter hints and constraints for transformation operations
function getParameterInfo(operation) {
    const info = {
        'resize': {
            example: 'width:300,height:200,fit:clip',
            description: 'Width (px), Height (px), Fit (clip|crop|scale|max)',
            constraints: 'Width/Height: 1-10000px'
        },
        'crop': {
            example: 'x:10,y:10,width:300,height:200',
            description: 'X position, Y position, Width, Height (all in pixels)',
            constraints: 'All values must be positive integers'
        },
        'rotate': {
            example: 'deg:90',
            description: 'Rotation angle in degrees',
            constraints: 'Degrees: 0-359 or exif'
        },
        'blur': {
            example: 'amount:5',
            description: 'Blur intensity',
            constraints: 'Amount: 0-20 (higher = more blur)'
        },
        'sharpen': {
            example: 'amount:3',
            description: 'Sharpen intensity',
            constraints: 'Amount: 0-20'
        },
        'quality': {
            example: 'value:75',
            description: 'Output quality for JPG/WebP',
            constraints: 'Value: 1-100 (higher = better quality)'
        },
        'convert': {
            example: 'format:png',
            description: 'Convert to different format',
            constraints: 'Format: jpg, png, webp, gif, bmp, tiff'
        },
        'watermark': {
            example: 'file:HANDLE,size:50,position:center',
            description: 'File handle, Size (%), Position',
            constraints: 'Size: 1-500%, Position: top|middle|bottom,left|center|right'
        },
        'sepia': {
            example: 'tone:80',
            description: 'Sepia tone intensity',
            constraints: 'Tone: 0-100'
        },
        'rounded_corners': {
            example: 'radius:10',
            description: 'Corner radius in pixels',
            constraints: 'Radius: 1-10000px'
        },
        'vignette': {
            example: 'amount:20',
            description: 'Vignette effect intensity',
            constraints: 'Amount: 0-100'
        },
        'shadow': {
            example: 'blur:4,opacity:60,vector:[4,4]',
            description: 'Blur amount, Opacity %, Vector offset [x,y]',
            constraints: 'Blur: 0-100, Opacity: 0-100, Vector: [-1000,1000]'
        },
        'border': {
            example: 'width:3,color:black',
            description: 'Border width (px) and color',
            constraints: 'Width: 1-1000px, Color: hex or name'
        },
        'upscale': {
            example: 'noise:low,style:artwork',
            description: 'AI upscaling options',
            constraints: 'Noise: none|low|medium|high, Style: artwork|photo'
        },
        'blackwhite': {
            example: '',
            description: 'No parameters needed - converts to black & white',
            constraints: ''
        },
        'flip': {
            example: '',
            description: 'No parameters needed - flips image vertically',
            constraints: ''
        },
        'flop': {
            example: '',
            description: 'No parameters needed - flips image horizontally',
            constraints: ''
        },
        'negative': {
            example: '',
            description: 'No parameters needed - inverts colors',
            constraints: ''
        },
        'circle': {
            example: '',
            description: 'No parameters needed - crops to circle',
            constraints: ''
        }
    };

    return info[operation] || {
        example: 'key:value,key2:value2',
        description: 'Custom parameters',
        constraints: ''
    };
}

// Universal function to add chain step to any builder
function addChainStepToBuilder(builderId) {
    const chainBuilder = document.getElementById(builderId);
    if (!chainBuilder) return;

    const stepDiv = document.createElement('div');
    stepDiv.className = 'chain-step';
    stepDiv.innerHTML = `
        <div class="chain-step-header">
            <select class="chain-operation">
                <option value="">Select Operation</option>
                <option value="resize">Resize</option>
                <option value="crop">Crop</option>
                <option value="rotate">Rotate</option>
                <option value="blur">Blur</option>
                <option value="sharpen">Sharpen</option>
                <option value="sepia">Sepia</option>
                <option value="blackwhite">Black & White</option>
                <option value="flip">Flip</option>
                <option value="flop">Flop</option>
                <option value="negative">Negative</option>
                <option value="circle">Circle</option>
                <option value="rounded_corners">Rounded Corners</option>
                <option value="vignette">Vignette</option>
                <option value="shadow">Shadow</option>
                <option value="border">Border</option>
                <option value="watermark">Watermark</option>
                <option value="upscale">Upscale</option>
                <option value="quality">Quality</option>
                <option value="convert">Convert Format</option>
            </select>
            <button type="button" class="btn-remove-step">×</button>
        </div>
        <input type="text" class="chain-params" placeholder="Select operation first">
        <div class="chain-param-hint" style="display:none;"></div>
    `;

    // Get elements
    const operationSelect = stepDiv.querySelector('.chain-operation');
    const paramsInput = stepDiv.querySelector('.chain-params');
    const hintDiv = stepDiv.querySelector('.chain-param-hint');
    const removeBtn = stepDiv.querySelector('.btn-remove-step');

    // Update placeholder and hint when operation changes
    operationSelect.addEventListener('change', () => {
        const paramInfo = getParameterInfo(operationSelect.value);

        if (operationSelect.value) {
            paramsInput.placeholder = paramInfo.example;

            if (paramInfo.example === '') {
                paramsInput.disabled = true;
                paramsInput.value = '';
                hintDiv.style.display = 'none';
            } else {
                paramsInput.disabled = false;
                hintDiv.innerHTML = `<strong>${paramInfo.description}</strong><br>${paramInfo.constraints}`;
                hintDiv.style.display = 'block';
            }
        } else {
            paramsInput.placeholder = 'Select operation first';
            paramsInput.disabled = false;
            hintDiv.style.display = 'none';
        }
    });

    // Add event listener for remove button
    removeBtn.addEventListener('click', () => {
        stepDiv.remove();
    });

    chainBuilder.appendChild(stepDiv);
}

function addChainStep() {
    const chainBuilder = document.getElementById('chainBuilder');
    const stepDiv = document.createElement('div');
    stepDiv.className = 'chain-step';
    stepDiv.innerHTML = `
        <select class="chain-operation">
            <option value="">Select Operation</option>
            <option value="resize">Resize</option>
            <option value="crop">Crop</option>
            <option value="rotate">Rotate</option>
            <option value="blur">Blur</option>
            <option value="sharpen">Sharpen</option>
            <option value="quality">Quality</option>
            <option value="convert">Convert Format</option>
            <option value="watermark">Watermark</option>
            <option value="sepia">Sepia</option>
            <option value="blackwhite">Black & White</option>
            <option value="flip">Flip</option>
            <option value="flop">Flop</option>
            <option value="negative">Negative</option>
            <option value="circle">Circle</option>
            <option value="rounded_corners">Rounded Corners</option>
            <option value="vignette">Vignette</option>
            <option value="shadow">Shadow</option>
            <option value="border">Border</option>
            <option value="upscale">Upscale</option>
        </select>
        <input type="text" class="chain-params" placeholder="Parameters (e.g., width:300,height:200)">
        <button type="button" class="btn-remove-step">×</button>
    `;

    // Add event listener for remove button
    const removeBtn = stepDiv.querySelector('.btn-remove-step');
    removeBtn.addEventListener('click', () => {
        stepDiv.remove();
        generateTransformChainsCode();
    });

    // Add event listeners for changes
    const operationSelect = stepDiv.querySelector('.chain-operation');
    const paramsInput = stepDiv.querySelector('.chain-params');

    operationSelect.addEventListener('change', () => {
        updateParameterPlaceholder(operationSelect, paramsInput);
        generateTransformChainsCode();
    });
    paramsInput.addEventListener('input', debounce(() => generateTransformChainsCode(), 300));

    chainBuilder.appendChild(stepDiv);
    generateTransformChainsCode();
}

function addCaptionChainStep(builderId) {
    const chainBuilder = document.getElementById(builderId);
    const stepDiv = document.createElement('div');
    stepDiv.className = 'chain-step';
    stepDiv.innerHTML = `
        <select class="chain-operation">
            <option value="">Select Operation</option>
            <option value="resize">Resize</option>
            <option value="crop">Crop</option>
            <option value="rotate">Rotate</option>
            <option value="blur">Blur</option>
            <option value="sharpen">Sharpen</option>
            <option value="quality">Quality</option>
            <option value="convert">Convert Format</option>
        </select>
        <input type="text" class="chain-params" placeholder="Parameters (e.g., width:300,height:200)">
        <button type="button" class="btn-remove-step">×</button>
    `;

    // Add event listener for remove button
    const removeBtn = stepDiv.querySelector('.btn-remove-step');
    removeBtn.addEventListener('click', () => {
        stepDiv.remove();
        generateCaptionCode();
    });

    // Add event listeners for changes
    const operationSelect = stepDiv.querySelector('.chain-operation');
    const paramsInput = stepDiv.querySelector('.chain-params');

    operationSelect.addEventListener('change', () => {
        updateParameterPlaceholder(operationSelect, paramsInput);
        generateCaptionCode();
    });
    paramsInput.addEventListener('input', debounce(() => generateCaptionCode(), 300));

    chainBuilder.appendChild(stepDiv);
    generateCaptionCode();
}

function addTaggingChainStep(builderId) {
    const chainBuilder = document.getElementById(builderId);
    const stepDiv = document.createElement('div');
    stepDiv.className = 'chain-step';
    stepDiv.innerHTML = `
        <select class="chain-operation">
            <option value="">Select Operation</option>
            <option value="resize">Resize</option>
            <option value="crop">Crop</option>
            <option value="rotate">Rotate</option>
            <option value="blur">Blur</option>
            <option value="sharpen">Sharpen</option>
            <option value="quality">Quality</option>
            <option value="convert">Convert Format</option>
        </select>
        <input type="text" class="chain-params" placeholder="Parameters (e.g., width:300,height:200)">
        <button type="button" class="btn-remove-step">×</button>
    `;

    // Add event listener for remove button
    const removeBtn = stepDiv.querySelector('.btn-remove-step');
    removeBtn.addEventListener('click', () => {
        stepDiv.remove();
        generateTaggingCode();
    });

    // Add event listeners for changes
    const operationSelect = stepDiv.querySelector('.chain-operation');
    const paramsInput = stepDiv.querySelector('.chain-params');

    operationSelect.addEventListener('change', () => {
        updateParameterPlaceholder(operationSelect, paramsInput);
        generateTaggingCode();
    });
    paramsInput.addEventListener('input', debounce(() => generateTaggingCode(), 300));

    chainBuilder.appendChild(stepDiv);
    generateTaggingCode();
}

function addOcrChainStep(builderId) {
    const chainBuilder = document.getElementById(builderId);
    const stepDiv = document.createElement('div');
    stepDiv.className = 'chain-step';
    stepDiv.innerHTML = `
        <select class="chain-operation">
            <option value="">Select Operation</option>
            <option value="resize">Resize</option>
            <option value="crop">Crop</option>
            <option value="rotate">Rotate</option>
            <option value="blur">Blur</option>
            <option value="sharpen">Sharpen</option>
            <option value="quality">Quality</option>
            <option value="convert">Convert Format</option>
        </select>
        <input type="text" class="chain-params" placeholder="Parameters (e.g., width:300,height:200)">
        <button type="button" class="btn-remove-step">×</button>
    `;

    // Add event listener for remove button
    const removeBtn = stepDiv.querySelector('.btn-remove-step');
    removeBtn.addEventListener('click', () => {
        stepDiv.remove();
        generateOcrCode();
    });

    // Add event listeners for changes
    const operationSelect = stepDiv.querySelector('.chain-operation');
    const paramsInput = stepDiv.querySelector('.chain-params');

    operationSelect.addEventListener('change', () => {
        updateParameterPlaceholder(operationSelect, paramsInput);
        generateOcrCode();
    });
    paramsInput.addEventListener('input', debounce(() => generateOcrCode(), 300));

    chainBuilder.appendChild(stepDiv);
    generateOcrCode();
}

function addSfwChainStep(builderId) {
    const chainBuilder = document.getElementById(builderId);
    const stepDiv = document.createElement('div');
    stepDiv.className = 'chain-step';
    stepDiv.innerHTML = `
        <select class="chain-operation">
            <option value="">Select Operation</option>
            <option value="resize">Resize</option>
            <option value="crop">Crop</option>
            <option value="rotate">Rotate</option>
            <option value="blur">Blur</option>
            <option value="sharpen">Sharpen</option>
            <option value="quality">Quality</option>
            <option value="convert">Convert Format</option>
        </select>
        <input type="text" class="chain-params" placeholder="Parameters (e.g., width:300,height:200)">
        <button type="button" class="btn-remove-step">×</button>
    `;

    // Add event listener for remove button
    const removeBtn = stepDiv.querySelector('.btn-remove-step');
    removeBtn.addEventListener('click', () => {
        stepDiv.remove();
        generateSfwCode();
    });

    // Add event listeners for changes
    const operationSelect = stepDiv.querySelector('.chain-operation');
    const paramsInput = stepDiv.querySelector('.chain-params');

    operationSelect.addEventListener('change', () => {
        updateParameterPlaceholder(operationSelect, paramsInput);
        generateSfwCode();
    });
    paramsInput.addEventListener('input', debounce(() => generateSfwCode(), 300));

    chainBuilder.appendChild(stepDiv);
    generateSfwCode();
}

function addSentimentChainStep(builderId) {
    const chainBuilder = document.getElementById(builderId);
    const stepDiv = document.createElement('div');
    stepDiv.className = 'chain-step';
    stepDiv.innerHTML = `
        <select class="chain-operation">
            <option value="">Select Operation</option>
            <option value="resize">Resize</option>
            <option value="crop">Crop</option>
            <option value="rotate">Rotate</option>
            <option value="blur">Blur</option>
            <option value="sharpen">Sharpen</option>
            <option value="quality">Quality</option>
            <option value="convert">Convert Format</option>
        </select>
        <input type="text" class="chain-params" placeholder="Parameters (e.g., width:300,height:200)">
        <button type="button" class="btn-remove-step">×</button>
    `;

    // Add event listener for remove button
    const removeBtn = stepDiv.querySelector('.btn-remove-step');
    removeBtn.addEventListener('click', () => {
        stepDiv.remove();
        generateSentimentCode();
    });

    // Add event listeners for changes
    const operationSelect = stepDiv.querySelector('.chain-operation');
    const paramsInput = stepDiv.querySelector('.chain-params');

    operationSelect.addEventListener('change', () => {
        updateParameterPlaceholder(operationSelect, paramsInput);
        generateSentimentCode();
    });
    paramsInput.addEventListener('input', debounce(() => generateSentimentCode(), 300));

    chainBuilder.appendChild(stepDiv);
    generateSentimentCode();
}

function updateParameterPlaceholder(operationSelect, paramsInput) {
    const operation = operationSelect.value;
    const placeholders = {
        'resize': 'width:300,height:200,fit:clip',
        'crop': 'x:10,y:10,width:300,height:200',
        'rotate': 'deg:90',
        'blur': 'amount:5',
        'sharpen': 'amount:3',
        'quality': 'value:75',
        'convert': 'format:png',
        'watermark': 'file:HANDLE,size:50,position:center',
        'sepia': 'tone:80',
        'blackwhite': '', // No parameters needed
        'flip': '', // No parameters needed
        'flop': '', // No parameters needed
        'negative': '', // No parameters needed
        'circle': '', // No parameters needed
        'rounded_corners': 'radius:10',
        'vignette': 'amount:20',
        'shadow': 'blur:4,opacity:60,vector:[4,4]',
        'border': 'width:3,color:black',
        'upscale': 'noise:low,style:artwork'
    };

    const placeholder = placeholders[operation];
    if (placeholder !== undefined) {
        if (placeholder === '') {
            paramsInput.placeholder = 'No parameters needed';
            paramsInput.disabled = true;
            paramsInput.value = '';
        } else {
            paramsInput.placeholder = placeholder;
            paramsInput.disabled = false;
        }
    } else {
        paramsInput.placeholder = 'Parameters (e.g., width:300,height:200)';
        paramsInput.disabled = false;
    }
}

function generateTransformChainsCode(tab = 'javascript') {
    const options = collectTransformChainsOptions();
    let code = '';

    switch (tab) {
        case 'javascript':
            code = generateJavaScriptTransformChainsCode(options);
            break;
        case 'react':
            code = generateReactTransformChainsCode(options);
            break;
        case 'vue':
            code = generateVueTransformChainsCode(options);
            break;
        case 'angular':
            code = generateAngularTransformChainsCode(options);
            break;
        case 'nodejs':
            code = generateNodeJSTransformChainsCode(options);
            break;
        case 'url':
            code = generateURLTransformChainsCode(options);
            break;
    }

    updateCodeDisplay(code, tab);
}

function collectTransformChainsOptions() {
    const options = {};

    // Get source handle
    options.handle = document.getElementById('chainHandle')?.value || 'YOUR_FILE_HANDLE';

    // Collect chain steps
    options.steps = [];
    const chainSteps = document.querySelectorAll('.chain-step');

    chainSteps.forEach(step => {
        const operation = step.querySelector('.chain-operation')?.value;
        const paramsInput = step.querySelector('.chain-params');
        const params = paramsInput?.value;

        if (operation) {
            const stepObj = { operation };

            if (params && params.trim()) {
                // Parse parameters string into object
                stepObj.params = {};

                // Check if it's a single value (no colons) vs key:value pairs
                if (!params.includes(':')) {
                    // Single value - use default parameter name based on operation
                    const defaultParamNames = {
                        'resize': 'width',
                        'crop': 'width',
                        'rotate': 'deg',
                        'blur': 'amount',
                        'sharpen': 'amount',
                        'quality': 'value',
                        'sepia': 'tone',
                        'vignette': 'amount',
                        'rounded_corners': 'radius'
                    };

                    const paramName = defaultParamNames[operation] || 'value';
                    const trimmedValue = params.trim();

                    if (!isNaN(trimmedValue) && trimmedValue !== '') {
                        stepObj.params[paramName] = Number(trimmedValue);
                    } else {
                        stepObj.params[paramName] = trimmedValue;
                    }
                } else {
                    // Key:value pairs format
                    const paramPairs = params.split(',').map(p => p.trim()).filter(p => p.length > 0);

                    paramPairs.forEach(pair => {
                        const colonIndex = pair.indexOf(':');
                        if (colonIndex > 0) {
                            const key = pair.substring(0, colonIndex).trim();
                            const value = pair.substring(colonIndex + 1).trim();

                            if (key && value) {
                                // Handle special cases first
                                if (value.startsWith('[') && value.endsWith(']')) {
                                    // Array notation like [4,4]
                                    try {
                                        stepObj.params[key] = JSON.parse(value);
                                    } catch {
                                        stepObj.params[key] = value;
                                    }
                                } else if (!isNaN(value) && value !== '') {
                                    // Numeric value
                                    stepObj.params[key] = Number(value);
                                } else if (value === 'true' || value === 'false') {
                                    // Boolean value
                                    stepObj.params[key] = value === 'true';
                                } else {
                                    // String value
                                    stepObj.params[key] = value;
                                }
                            }
                        }
                    });
                }
            }

            options.steps.push(stepObj);
        }
    });

    // Get conditional options
    options.conditional = document.getElementById('chainConditional')?.checked || false;
    options.optimize = document.getElementById('chainOptimize')?.checked || false;
    options.fallback = document.getElementById('chainFallback')?.checked || false;

    return options;
}

function generateJavaScriptTransformChainsCode(options) {
    const { handle, steps } = options;
    const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_APIKEY';

    if (!steps || steps.length === 0) {
        return `// Transform Chains - No operations defined
const client = filestack.init('${apiKey}');
const handle = '${handle}';

// Add transformation steps to build a chain
// Example: client.transform(handle).resize({width: 300}).blur({amount: 5}).store()`;
    }

    // Build transformation chain with proper line breaks
    let transformChain = `client.transform('${handle}')`;
    const chainParts = [];

    steps.forEach(step => {
        if (step.params && Object.keys(step.params).length > 0) {
            const paramsStr = JSON.stringify(step.params, null, 0);
            chainParts.push(`  .${step.operation}(${paramsStr})`);
        } else {
            chainParts.push(`  .${step.operation}()`);
        }
    });

    const formattedChain = transformChain + (chainParts.length > 0 ? '\n' + chainParts.join('\n') : '');

    return `// Transform Chains
const client = filestack.init('${apiKey}');

// Build transformation chain
const transformedFile = ${formattedChain};

// Get the URL of the transformed image
const transformUrl = transformedFile.getUrl();
console.log('Transform URL:', transformUrl);

// Or store the transformed result
transformedFile.store()
  .then(response => {
    console.log('Stored transformed file:', response);
  })
  .catch(error => {
    console.error('Transform error:', error);
  });`;
}

function generateReactTransformChainsCode(options) {
    const { handle, steps } = options;
    const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_APIKEY';

    if (!steps || steps.length === 0) {
        return `// React Transform Chains Component
import * as filestack from 'filestack-js';

const TransformChains = () => {
    const client = filestack.init('${apiKey}');

    const applyTransformChain = () => {
        // Add transformation steps here
        const handle = '${handle}';
        // Example: client.transform(handle).resize({width: 300}).blur({amount: 5}).store()
    };

    return (
        <button onClick={applyTransformChain}>
            Apply Transform Chain
        </button>
    );
};`;
    }

    // Build transformation chain with proper line breaks
    let transformChain = `client.transform('${handle}')`;
    const chainParts = [];

    steps.forEach(step => {
        if (step.params && Object.keys(step.params).length > 0) {
            const paramsStr = JSON.stringify(step.params, null, 0);
            chainParts.push(`      .${step.operation}(${paramsStr})`);
        } else {
            chainParts.push(`      .${step.operation}()`);
        }
    });

    const formattedChain = transformChain + (chainParts.length > 0 ? '\n' + chainParts.join('\n') : '');

    return `// React Transform Chains Component
import * as filestack from 'filestack-js';

const TransformChains = () => {
  const client = filestack.init('${apiKey}');

  const applyTransformChain = async () => {
    try {
      const transformedFile = ${formattedChain};
      const url = transformedFile.getUrl();
      console.log('Transform URL:', url);

      // Store the result
      const response = await transformedFile.store();
      console.log('Stored:', response);
    } catch (error) {
      console.error('Transform error:', error);
    }
  };

  return (
    <button onClick={applyTransformChain}>
      Apply Transform Chain
    </button>
  );
};

export default TransformChains;`;
}

function generateVueTransformChainsCode(options) {
    const { handle, steps } = options;
    const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_APIKEY';

    if (!steps || steps.length === 0) {
        return `<template>
    <button @click="applyTransformChain">Apply Transform Chain</button>
</template>

<script>
import * as filestack from 'filestack-js';

export default {
    methods: {
        applyTransformChain() {
            const client = filestack.init('${apiKey}');
            const handle = '${handle}';
            // Add transformation steps here
        }
    }
};
</script>`;
    }

    // Build transformation chain with proper line breaks
    let transformChain = `client.transform('${handle}')`;
    const chainParts = [];

    steps.forEach(step => {
        if (step.params && Object.keys(step.params).length > 0) {
            const paramsStr = JSON.stringify(step.params, null, 0);
            chainParts.push(`        .${step.operation}(${paramsStr})`);
        } else {
            chainParts.push(`        .${step.operation}()`);
        }
    });

    const formattedChain = transformChain + (chainParts.length > 0 ? '\n' + chainParts.join('\n') : '');

    return `<template>
  <button @click="applyTransformChain">
    Apply Transform Chain
  </button>
</template>

<script>
import * as filestack from 'filestack-js';

export default {
  methods: {
    async applyTransformChain() {
      try {
        const client = filestack.init('${apiKey}');
        const transformedFile = ${formattedChain};
        const url = transformedFile.getUrl();
        console.log('Transform URL:', url);

        const response = await transformedFile.store();
        console.log('Stored:', response);
      } catch (error) {
        console.error('Transform error:', error);
      }
    }
  }
};
</script>`;
}

function generateAngularTransformChainsCode(options) {
    const { handle, steps } = options;
    const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_APIKEY';

    if (!steps || steps.length === 0) {
        return `// Angular Transform Chains Component
import { Component } from '@angular/core';
import * as filestack from 'filestack-js';

@Component({
    selector: 'app-transform-chains',
    template: '<button (click)="applyTransformChain()">Apply Transform Chain</button>'
})
export class TransformChainsComponent {
    private client = filestack.init('${apiKey}');

    applyTransformChain() {
        const handle = '${handle}';
        // Add transformation steps here
    }
}`;
    }

    // Build transformation chain with proper line breaks
    let transformChain = `this.client.transform('${handle}')`;
    const chainParts = [];

    steps.forEach(step => {
        if (step.params && Object.keys(step.params).length > 0) {
            const paramsStr = JSON.stringify(step.params, null, 0);
            chainParts.push(`        .${step.operation}(${paramsStr})`);
        } else {
            chainParts.push(`        .${step.operation}()`);
        }
    });

    const formattedChain = transformChain + (chainParts.length > 0 ? '\n' + chainParts.join('\n') : '');

    return `// Angular Transform Chains Component
import { Component } from '@angular/core';
import * as filestack from 'filestack-js';

@Component({
    selector: 'app-transform-chains',
    template: '<button (click)="applyTransformChain()">Apply Transform Chain</button>'
})
export class TransformChainsComponent {
    private client = filestack.init('${apiKey}');

    async applyTransformChain() {
        try {
            const transformedFile = ${formattedChain};
            const url = transformedFile.getUrl();
            console.log('Transform URL:', url);

            const response = await transformedFile.store();
            console.log('Stored:', response);
        } catch (error) {
            console.error('Transform error:', error);
        }
    }
}`;
}

function generateNodeJSTransformChainsCode(options) {
    const { handle, steps } = options;
    const apiKey = document.getElementById('globalApikey')?.value || 'YOUR_APIKEY';

    if (!steps || steps.length === 0) {
        return `// Node.js Transform Chains
const filestack = require('filestack-js');

const client = filestack.init('${apiKey}');
const handle = '${handle}';

// Add transformation steps to build a chain
// Example: client.transform(handle).resize({width: 300}).blur({amount: 5}).store()`;
    }

    // Build transformation chain with proper line breaks
    let transformChain = `client.transform('${handle}')`;
    const chainParts = [];

    steps.forEach(step => {
        if (step.params && Object.keys(step.params).length > 0) {
            const paramsStr = JSON.stringify(step.params, null, 0);
            chainParts.push(`  .${step.operation}(${paramsStr})`);
        } else {
            chainParts.push(`  .${step.operation}()`);
        }
    });

    const formattedChain = transformChain + (chainParts.length > 0 ? '\n' + chainParts.join('\n') : '');

    return `// Node.js Transform Chains
const filestack = require('filestack-js');

const client = filestack.init('${apiKey}');

async function applyTransformChain() {
    try {
        const transformedFile = ${formattedChain};
        const url = transformedFile.getUrl();
        console.log('Transform URL:', url);

        const response = await transformedFile.store();
        console.log('Stored transformed file:', response);
        return response;
    } catch (error) {
        console.error('Transform chain error:', error);
        throw error;
    }
}

applyTransformChain();`;
}

function generateURLTransformChainsCode(options) {
    const { handle, steps } = options;

    if (!steps || steps.length === 0) {
        return `// Transform Chain URL
// Base URL: https://cdn.filestackapi.com/
// Add transformation steps to the URL path
// Example: https://cdn.filestackapi.com/resize=w:300/blur=a:5/${handle}`;
    }

    const transformParts = steps.map(step => {
        if (step.params && Object.keys(step.params).length > 0) {
            // Map common parameter names to URL shorthand
            const urlParamMap = {
                'width': 'w',
                'height': 'h',
                'amount': 'a',
                'value': 'v',
                'deg': 'd',
                'degrees': 'd',
                'format': 'f'
            };

            const paramPairs = Object.entries(step.params).map(([key, value]) => {
                const urlKey = urlParamMap[key] || key;
                // Handle arrays specially
                if (Array.isArray(value)) {
                    return `${urlKey}:${JSON.stringify(value)}`;
                }
                return `${urlKey}:${value}`;
            }).join(',');
            return `${step.operation}=${paramPairs}`;
        } else {
            return step.operation;
        }
    });

    const transformPath = transformParts.join('/');
    const transformUrl = `https://cdn.filestackapi.com/${transformPath}/${handle}`;

    return `// Transform Chain URL
const transformUrl = '${transformUrl}';

// Use this URL directly in img tags, CSS, or anywhere you need the transformed image
// Example usage:
// <img src="\${transformUrl}" alt="Transformed image" />
//
// Or as CSS background:
// background-image: url('\${transformUrl}');`;
}
