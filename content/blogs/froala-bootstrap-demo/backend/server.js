const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for communication with frontend
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to receive Froala form submission
app.post('/submit-post', (req, res) => {
  const content = req.body.content;
  console.log('Received content from Froala:', content);

  res.send(`<h2>Received Froala Content:</h2><div>${content}</div>`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
