import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const FileDownload = () => {
  const [isLoading, setIsLoading] = useState(false);

  const downloadFile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/files/1', {
        responseType: 'blob', // Handle the response as binary data
      });

      // Use file-saver to save the file
      saveAs(response.data, 'example.pdf');
      setIsLoading(false);
    } catch (error) {
      console.error('Error downloading the file:', error);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <button
        onClick={downloadFile}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: isLoading ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          borderRadius: '5px',
        }}
      >
        {isLoading ? 'Downloading...' : 'Download File'}
      </button>
    </div>
  );
};

export default FileDownload;
