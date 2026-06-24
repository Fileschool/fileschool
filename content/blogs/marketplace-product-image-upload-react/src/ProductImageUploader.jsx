import React, { useState } from 'react';
import * as filestack from 'filestack-js';

const client = filestack.init('YOUR_API_KEY'); // Replace with your Filestack API key

const ProductImageUploader = () => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const openPicker = () => {
    setMessage('');
    setMessageType('');

    client.picker({
      maxFiles: 5,
      fromSources: [
        'local_file_system', 'url', 'imagesearch',
        'googledrive', 'dropbox', 'facebook', 'instagram'
      ],
      accept: ['image/*'],
      maxSize: 5 * 1024 * 1024, // 5MB
      onFileSelected: (file) => {
        if (!file.mimetype.startsWith('image/')) {
          setMessage('Error: Only image files are allowed.');
          setMessageType('error');
          return false;
        }
        return true;
      },
      onUploadDone: (res) => {
        setMessage(`Upload successful! ${res.filesUploaded.length} file(s) uploaded.`);
        setMessageType('success');
        console.log('Uploaded files:', res.filesUploaded);
      },
      onFileUploadFailed: (file, error) => {
        setMessage(`Upload failed: ${error.message}`);
        setMessageType('error');
      },
    }).open();
  };

  return (
    <div style={styles.wrapper}>
      <h2>Upload Product Images</h2>
      <p>You can upload up to 5 product photos. Only images are allowed.</p>
      <button onClick={openPicker} style={styles.button}>
        Select or Drag & Drop Files
      </button>
      {message && (
        <div
          style={{
            ...styles.message,
            color: messageType === 'error' ? 'red' : 'green',
          }}
          role="alert"
        >
          {message}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    color: '#222',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '20px',
    fontWeight: 'bold',
  },
};

export default ProductImageUploader;
