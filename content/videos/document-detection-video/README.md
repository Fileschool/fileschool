# Document Detection & OCR Demo

An interactive demo showcasing Filestack's document detection and OCR (Optical Character Recognition) capabilities. This demo allows users to upload document images and see how Filestack processes, straightens, and extracts text from them.

## Features

- **Document Upload**: Drag-and-drop or click to upload document images (receipts, IDs, invoices, etc.)
- **Document Detection**: Automatically detects and straightens skewed or perspective-distorted documents
- **Image Preprocessing**: Applies denoising and contrast enhancement for better text recognition
- **OCR Text Extraction**: Extracts text from the processed document
- **Bounding Box Visualization**: Displays detected text areas, lines, and words with color-coded overlays
- **API URL Display**: Shows the exact transformation URLs used for each processing step

## Setup Instructions

### Prerequisites

- A Filestack account ([Sign up here](https://www.filestack.com))
- Filestack API key
- Security policy and signature (for production use)

### Configuration

1. Open [index.html](index.html) in a text editor
2. Locate the configuration section (around line 589-592):

```javascript
const API_KEY = '1';
const POLICY = '2';
const SIGNATURE = '3';
```

3. Replace the placeholder values:
   - `API_KEY`: Your Filestack API key
   - `POLICY`: Your security policy (base64 encoded)
   - `SIGNATURE`: Your security signature

### Getting Security Credentials

Security credentials are required for production use. To generate them:

1. Log in to your [Filestack Dashboard](https://dev.filestack.com)
2. Navigate to Security settings
3. Generate a policy and signature pair
4. Copy these values into the configuration section

## How to Use

1. **Open the Demo**
   - Open [index.html](index.html) in a web browser
   - Or serve it using a local web server

2. **Upload a Document**
   - Click the upload area or drag and drop a document image
   - Supported formats: JPG, PNG, and other image formats
   - Best results with: receipts, invoices, ID cards, forms, printed documents

3. **Process the Document**
   - Click the "Process Document" button
   - Wait for the processing to complete (typically 2-5 seconds)

4. **View Results**
   - **Warped Mode**: Document straightened with original colors preserved
   - **Preprocessed Image**: Straightened + denoised + contrast enhanced
   - **OCR Bounding Boxes**: Visual representation of detected text areas
   - **Extracted Text**: Plain text extracted from the document
   - **API Response**: Full JSON response from the OCR API

## Filestack Transformations Used

### Document Detection (Warped)
```
https://cdn.filestackcontent.com/doc_detection=preprocess:false/{handle}
```
Straightens the document while preserving original colors.

### Document Detection (Preprocessed)
```
https://cdn.filestackcontent.com/doc_detection=preprocess:true/{handle}
```
Straightens the document and applies preprocessing (denoising, contrast enhancement).

### OCR (Text Extraction)
```
https://cdn.filestackcontent.com/doc_detection=preprocess:true/ocr/{handle}
```
Extracts text from the preprocessed document and returns structured OCR data.

## Technical Details

### Processing Pipeline

1. **Upload**: Image is uploaded to Filestack via the picker or drag-and-drop
2. **Document Detection**: The `doc_detection` transformation identifies document boundaries and perspective
3. **Warping**: Document is straightened using the detected corners
4. **Preprocessing** (optional): Denoising and contrast enhancement are applied
5. **OCR**: Text is extracted with bounding box coordinates for:
   - Text areas (orange boxes)
   - Lines (blue boxes)
   - Words (green boxes)

### API Response Structure

The OCR endpoint returns a JSON object containing:
- `text`: Extracted plain text
- `document.text_areas[]`: Array of detected text regions
  - `bounding_box[]`: Polygon coordinates for the text area
  - `lines[]`: Array of text lines within the area
    - `bounding_box[]`: Polygon coordinates for the line
    - `text`: Line text content
    - `words[]`: Array of words within the line
      - `bounding_box[]`: Polygon coordinates for the word
      - `text`: Word text content
- `page_width` & `page_height`: Dimensions of the processed image

## Browser Compatibility

- Chrome/Edge: Fully supported
- Firefox: Fully supported
- Safari: Fully supported
- Mobile browsers: Fully supported (responsive design)

## Troubleshooting

### Upload fails
- Verify your API key is correct
- Check that the file is a valid image format
- Ensure you have a stable internet connection

### Processing fails
- Verify your security policy and signature are valid
- Check that the policy hasn't expired
- Ensure the document is clearly visible in the image

### No text extracted
- Try using a higher quality image
- Ensure the document has clearly visible text
- Check that the document is not too blurry or low contrast
- Try preprocessing: `doc_detection=preprocess:true` improves OCR accuracy

## Additional Resources

- [Filestack Documentation](https://www.filestack.com/docs/)
- [Document Detection API](https://www.filestack.com/docs/api/processing/#document-detection)
- [OCR API](https://www.filestack.com/docs/api/processing/#ocr)
- [Security Documentation](https://www.filestack.com/docs/security/)

## License

This demo is provided as-is for demonstration purposes.
