// src/ImageProcessor.js
import React, { useState } from 'react';
import { client } from './filestackConfig';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

const ImageProcessor = () => {
  const [originalImage, setOriginalImage] = useState('');
  const [processedImage, setProcessedImage] = useState('');

  const processImage = async () => {
    try {
      const options = {
        fromSources: ['local_file_system', 'url'],
        transformations: {
          crop: true, // Enable cropping
          rotate: true, // Enable rotation
        },
        uploadInBackground: false, // Disable background uploads
        onUploadDone: (result) => {
          console.log('Upload Result:', result);

          // Check if filesUploaded exists and has at least one file
          if (result && result.filesUploaded && result.filesUploaded.length > 0) {
            const uploadedUrl = result.filesUploaded[0].url;
            console.log('Uploaded Image URL:', uploadedUrl);
            setOriginalImage(uploadedUrl);

            // Construct URL for face detection and blurring
            const fileHandle = uploadedUrl.split('/').pop(); // Extract file handle
            const processedUrl = `https://cdn.filestackcontent.com/blur_faces=amount:20/detect_faces/${fileHandle}`;
            console.log('Processed Image URL:', processedUrl);
            setProcessedImage(processedUrl);
          } else {
            console.warn('No files were uploaded.');
          }
        },
      };

      // Open the Filestack picker
      client.picker(options).open();
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <button
        onClick={processImage}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
        }}
      >
        Process Image
      </button>

      {originalImage && (
        <div>
          <h3>Original Image:</h3>
          <img src={originalImage} alt="Original" style={{ maxWidth: '30%' }} />
        </div>
      )}

      {processedImage && (
        <div>
          <h3>Processed Image:</h3>
          <img src={processedImage} alt="Processed" style={{ maxWidth: '30%' }} />
        </div>
      )}
    </div>
  );
};

export default ImageProcessor;
