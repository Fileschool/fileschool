class FilestackTransformations {
    constructor() {
        this.currentTransformationIndex = 0;
        this.baseUrl = 'https://cdn.filestackcontent.com';
        this.defaultHandle = 'QV2HrX6IQPen3IwlGJdu'; // Replace with your actual Filestack handle
        this.currentHandle = this.defaultHandle;

        // Define transformations with their configurations
        this.transformations = [
            {
                name: 'Original',
                transform: '',
                morphEnabled: true
            },
            {
                name: 'Rotate',
                transform: 'rotate=deg:180',
                morphEnabled: false
            },
            {
                name: 'Sepia',
                transform: 'sepia=tone:80',
                morphEnabled: true
            },
            {
                name: 'Oil Paint',
                transform: 'oil_paint=amount:4',
                morphEnabled: true
            },
            {
                name: 'Blur',
                transform: 'blur=amount:8',
                morphEnabled: false
            },
            {
                name: 'Rounded',
                transform: 'rounded_corners=radius:100',
                morphEnabled: false
            },
            {
                name: 'Detect Faces',
                transform: 'detect_faces=minsize:0.25,maxsize:0.55,color:red',
                morphEnabled: true
            },
            {
                name: 'Crop Faces',
                transform: 'crop_faces=faces:all,mode:fill,width:500,height:400',
                morphEnabled: true
            },
            {
                name: 'Polaroid',
                transform: 'polaroid',
                morphEnabled: false
            },
            {
                name: 'Monochrome',
                transform: 'monochrome',
                morphEnabled: true
            },
            {
                name: 'Resize',
                transform: 'resize=width:400,height:400,fit:crop',
                morphEnabled: false
            }
        ];

        // Store current and previous face data for morphing
        this.currentFaceData = null;
        this.previousFaceData = null;
        this.morphingCanvas = null;
        this.morphingContext = null;

        this.initializeElements();
        this.initializeEventListeners();
        this.updateUI();
        this.loadDefaultImage();
    }

    initializeElements() {
        this.mainImage = document.getElementById('mainImage');
        this.imageStack = document.querySelector('.image-stack');
        this.transformationName = document.getElementById('transformationName');
        this.transformationUrl = document.getElementById('transformationUrl');
        this.transformationLabel = document.getElementById('transformationLabel');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        // Create morphing canvas for advanced transitions
        this.morphingCanvas = document.createElement('canvas');
        this.morphingCanvas.className = 'morphing-canvas';
        this.morphingContext = this.morphingCanvas.getContext('2d');
        this.imageStack.appendChild(this.morphingCanvas);
    }

    initializeEventListeners() {
        this.nextBtn.addEventListener('click', () => this.nextTransformation());
        this.prevBtn.addEventListener('click', () => this.previousTransformation());
    }

    loadDefaultImage() {
        // Load the original image using the Filestack handle
        const originalUrl = `${this.baseUrl}/${this.currentHandle}`;
        this.mainImage.src = originalUrl;
        this.updateUrl();
    }


    getCurrentTransformationUrl() {
        const currentTransform = this.transformations[this.currentTransformationIndex];
        if (!currentTransform || currentTransform.transform === '' || this.currentTransformationIndex === -1) {
            return `${this.baseUrl}/${this.currentHandle}`;
        }

        return `${this.baseUrl}/${currentTransform.transform}/${this.currentHandle}`;
    }

    updateUrl() {
        const url = this.getCurrentTransformationUrl();
        this.highlightUrl(url);
    }

    highlightUrl(url, animate = false) {
        // Parse and highlight the URL components
        const parts = url.split('/');
        const baseUrl = parts.slice(0, 3).join('/'); // https://cdn.filestackcontent.com
        const transformation = parts[3] || '';
        const handle = parts[4] || parts[3]; // handle might be at index 3 if no transformation

        let highlighted = '';

        // Base URL in gray
        highlighted += `<span style="color: #6e6e73;">${baseUrl}/</span>`;

        if (transformation && transformation !== this.currentHandle) {
            // Transformation parameters in blue
            highlighted += `<span style="color: #0969da; font-weight: 500;">${transformation}</span>`;
            highlighted += `<span style="color: #6e6e73;">/</span>`;
            highlighted += `<span style="color: #d73a49; font-weight: 500;">${handle}</span>`;
        } else {
            // Just handle in red
            highlighted += `<span style="color: #d73a49; font-weight: 500;">${this.currentHandle}</span>`;
        }

        if (animate && transformation && transformation !== this.currentHandle) {
            this.animateUrlTyping(baseUrl, transformation, handle);
        } else {
            this.transformationUrl.innerHTML = highlighted;
        }
    }

    animateUrlTyping(baseUrl, transformation, handle) {
        // Start with base URL only
        let currentText = `<span style="color: #6e6e73;">${baseUrl}/</span>`;
        this.transformationUrl.innerHTML = currentText + '<span class="typing-cursor">|</span>';
        
        const transformationText = transformation;
        const handleText = `/${handle}`;
        
        let transformationIndex = 0;
        let handleIndex = 0;
        let isTypingTransformation = true;
        
        const typeNextChar = () => {
            if (isTypingTransformation && transformationIndex < transformationText.length) {
                // Type transformation characters only
                const typedTransformation = transformationText.substring(0, transformationIndex + 1);
                currentText = `<span style="color: #6e6e73;">${baseUrl}/</span><span style="color: #0969da; font-weight: 500;">${typedTransformation}</span>`;
                this.transformationUrl.innerHTML = currentText + '<span class="typing-cursor">|</span>';
                transformationIndex++;
                setTimeout(typeNextChar, 20 + Math.random() * 30); // Faster typing speed
            } else if (isTypingTransformation) {
                // Switch to typing handle
                isTypingTransformation = false;
                setTimeout(typeNextChar, 50); // Small pause between transformation and handle
            } else if (handleIndex < handleText.length) {
                // Type handle characters
                const typedHandle = handleText.substring(0, handleIndex + 1);
                let handleContent;
                
                if (handleIndex === 0) {
                    // Just the slash
                    handleContent = `<span style="color: #6e6e73;">${typedHandle}</span>`;
                } else {
                    // The actual handle - build it properly
                    const slashPart = '<span style="color: #6e6e73;">/</span>';
                    const handlePart = `<span style="color: #d73a49; font-weight: 500;">${typedHandle.substring(1)}</span>`;
                    handleContent = slashPart + handlePart;
                }
                
                // Only show the parts we've typed so far
                currentText = `<span style="color: #6e6e73;">${baseUrl}/</span><span style="color: #0969da; font-weight: 500;">${transformationText}</span>${handleContent}`;
                this.transformationUrl.innerHTML = currentText + '<span class="typing-cursor">|</span>';
                handleIndex++;
                setTimeout(typeNextChar, 20 + Math.random() * 30); // Faster typing speed
            } else {
                // Remove cursor when done - show final result
                const finalText = `<span style="color: #6e6e73;">${baseUrl}/</span><span style="color: #0969da; font-weight: 500;">${transformationText}</span><span style="color: #6e6e73;">/</span><span style="color: #d73a49; font-weight: 500;">${handle}</span>`;
                this.transformationUrl.innerHTML = finalText;
            }
        };
        
        // Start typing after a small delay
        setTimeout(typeNextChar, 100);
    }

    async loadImage() {
        const imageUrl = this.getCurrentTransformationUrl();

        try {
            // Create new image to preload
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                this.elegantTransition(img.src);
                // Trigger typing animation for the URL
                const url = this.getCurrentTransformationUrl();
                this.highlightUrl(url, true);
            };

            img.onerror = () => {
                console.error('Failed to load transformed image');
                this.updateUrl();
            };

            img.src = imageUrl;

        } catch (error) {
            console.error('Error loading image:', error);
        }
    }

    elegantTransition(newSrc) {
        // Disable buttons during animation
        this.nextBtn.disabled = true;
        this.prevBtn.disabled = true;

        const currentTransform = this.transformations[this.currentTransformationIndex];
        const shouldMorph = currentTransform && currentTransform.morphEnabled;

        if (shouldMorph && this.canPerformMorphTransition()) {
            this.performMorphTransition(newSrc);
        } else {
            this.performStandardTransition(newSrc);
        }
    }

    canPerformMorphTransition() {
        // Check if we have face data and the browser supports canvas
        return this.morphingCanvas && this.morphingContext && 
               typeof requestAnimationFrame !== 'undefined';
    }

    performStandardTransition(newSrc) {
        // Create transition image with proper CSS classes
        const transitionImage = document.createElement('img');
        transitionImage.className = 'transition-image';
        transitionImage.src = newSrc;

        // Add to image stack
        this.imageStack.appendChild(transitionImage);

        transitionImage.onload = () => {
            // Start fade in of new image
            requestAnimationFrame(() => {
                transitionImage.classList.add('fade-in');

                // Wait until new image is fully opaque before starting cleanup
                setTimeout(() => {
                    // Replace the source instantly (new image is already fully visible on top)
                    this.mainImage.src = newSrc;
                    // Remove the transition image overlay
                    this.imageStack.removeChild(transitionImage);
                    this.updateUrl();
                    this.updateUI();
                }, 400); // Match CSS transition duration exactly
            });
        };

        transitionImage.onerror = () => {
            // Clean up on error
            if (this.imageStack.contains(transitionImage)) {
                this.imageStack.removeChild(transitionImage);
            }
            this.updateUI();
            console.error('Failed to load transformed image');
        };
    }

    performMorphTransition(newSrc) {
        const newImage = new Image();
        newImage.crossOrigin = 'anonymous';
        
        newImage.onload = () => {
            this.createMorphingEffect(this.mainImage, newImage, () => {
                this.mainImage.src = newSrc;
                this.updateUrl();
                this.updateUI();
            });
        };

        newImage.onerror = () => {
            // Fallback to standard transition
            this.performStandardTransition(newSrc);
        };

        newImage.src = newSrc;
    }

    createMorphingEffect(fromImg, toImg, callback) {
        // Set up canvas dimensions to match the actual image
        this.morphingCanvas.width = fromImg.naturalWidth || fromImg.width;
        this.morphingCanvas.height = fromImg.naturalHeight || fromImg.height;
        
        // Position canvas to match the main image
        const mainImgStyle = window.getComputedStyle(fromImg);
        this.morphingCanvas.style.maxWidth = mainImgStyle.maxWidth;
        this.morphingCanvas.style.maxHeight = mainImgStyle.maxHeight;
        this.morphingCanvas.style.position = 'absolute';
        this.morphingCanvas.style.top = '50%';
        this.morphingCanvas.style.left = '50%';
        this.morphingCanvas.style.transform = 'translate(-50%, -50%)';
        this.morphingCanvas.style.zIndex = '10';
        this.morphingCanvas.style.borderRadius = '8px';

        let progress = 0;
        const duration = 1200; // Slower, smoother transition
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / duration, 1);

            // Very smooth easing for natural feel
            const easeProgress = progress * progress * (3.0 - 2.0 * progress); // Smoothstep

            this.drawSimpleMorph(fromImg, toImg, easeProgress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                this.morphingCanvas.style.opacity = '0';
                callback();
            }
        };

        // Show morphing canvas and start animation
        this.morphingCanvas.style.opacity = '1';
        animate();
    }

    drawSimpleMorph(fromImg, toImg, progress) {
        const ctx = this.morphingContext;
        const canvas = this.morphingCanvas;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Simple crossfade between images
        ctx.globalAlpha = 1 - progress;
        ctx.drawImage(fromImg, 0, 0, canvas.width, canvas.height);
        
        ctx.globalAlpha = progress;
        ctx.drawImage(toImg, 0, 0, canvas.width, canvas.height);
        
        // Reset alpha
        ctx.globalAlpha = 1;
    }


    nextTransformation() {
        if (this.currentTransformationIndex < this.transformations.length - 1) {
            this.currentTransformationIndex++;
            this.updateUI();
            this.loadImage();
        }
    }

    previousTransformation() {
        if (this.currentTransformationIndex > 0) {
            this.currentTransformationIndex--;
            this.updateUI();
            this.loadImage();
        }
    }

    updateUI() {
        const transformation = this.transformations[this.currentTransformationIndex] || this.transformations[0];

        this.transformationName.textContent = transformation.name;

        // Update the transformation label
        if (transformation.transform === '') {
            this.transformationLabel.textContent = 'Original Image';
        } else {
            this.transformationLabel.innerHTML = `Filestack <span style="color: #ff6900; font-weight: 600;">${transformation.name}</span> Transformation`;
        }

        // Update button states
        this.prevBtn.disabled = this.currentTransformationIndex <= 0;
        this.nextBtn.disabled = this.currentTransformationIndex >= this.transformations.length - 1;

        this.updateUrl();
    }


    // Method to set a custom Filestack handle
    setHandle(handle) {
        this.currentHandle = handle;
        this.currentTransformationIndex = -1;
        this.updateUI();
        this.loadImage();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.filestackApp = new FilestackTransformations();
});

// Helper function to set handle from console if needed
window.setFilestackHandle = (handle) => {
    if (window.filestackApp) {
        window.filestackApp.setHandle(handle);
    }
};