import axios from 'axios';

const downloadFile = async () => {
  const response = await axios.get('https://example.com/api/file', {
    responseType: 'blob', // Ensures the file is downloaded as a binary
  });
  saveAs(response.data, 'filename.extension');
};
