import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import axios from 'axios';

const FileDownload = () => {
  const [isLoading, setIsLoading] = useState(false);

  const downloadFile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://example.com/api/file', {
        responseType: 'blob',
      });
      saveAs(response.data, 'example-file.pdf');
    } catch (error) {
      console.error('Error downloading the file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={downloadFile} disabled={isLoading}>
        {isLoading ? 'Downloading...' : 'Download File'}
      </button>
      {isLoading && <div className="spinner">Loading...</div>}
    </div>
  );
};

export default FileDownload;
