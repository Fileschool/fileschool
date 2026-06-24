const downloadFile = async () => {
  try {
    const response = await axios.get('https://example.com/api/file', {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    });
    saveAs(response.data, 'sensitive-file.pdf');
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};
