import React from 'react';
import ImageProcessor from './ImageProcessor';

const App = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
        Face Detection and Blurring with Filestack
      </h1>
      <ImageProcessor />
    </div>
  );
};

export default App;
