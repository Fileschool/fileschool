import { state } from './config.js';
import { updateCode } from './codegen.js';

// Generate transform options object for JavaScript code
export function generateTransformOptions(activeTransformations, values) {
    const options = {};

    activeTransformations.forEach(key => {
        const transformation = TRANSFORMATIONS[key];
        if (!transformation) return;

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
            case 'autoImage':
            case 'enhance':
            case 'upscale':
            case 'redeye':
            case 'ascii':
                options[transformation.jsKey || key] = true;
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
        }
    });

    return options;
}

// Transformation definitions with their configuration
const TRANSFORMATIONS = {
