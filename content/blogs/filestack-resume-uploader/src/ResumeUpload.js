import React from 'react';
import * as filestack from 'filestack-js';

const client = filestack.init('YOUR_API_KEY'); // Replace with your Filestack API key 

const ResumeUpload = () => {
  const openPicker = () => {
    const options = {
      accept: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], // PDF & DOCX
      maxSize: 5 * 1024 * 1024, // 5MB
      maxFiles: 1,
      fromSources: ['local_file_system', 'googledrive', 'dropbox'],
      onUploadDone: (res) => {
        alert('Upload successful! ✅');
        console.log('Uploaded files:', res.filesUploaded);
      },
    };

    client.picker(options).open();
  };

  return (
    <div style={styles.container}>
      <h2>Upload Your Resume</h2>
      <p>Supported formats: PDF, DOCX. Max size: 5MB</p>
      <button style={styles.button} onClick={openPicker}>Upload Resume</button>
      <p style={styles.note}>We’ll confirm your upload right after you select the file.</p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '30px',
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '10px',
    background: '#f9f9f9',
    fontFamily: 'Arial, sans-serif'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  note: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#555'
  }
};

export default ResumeUpload;
