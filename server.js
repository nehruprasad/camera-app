const express = require('express');
const mysql = require('mysql2'); // or use MongoDB if preferred
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Parse JSON
app.use(bodyParser.json({ limit: '10mb' })); // allow big base64 image

// Serve public folder
app.use(express.static('public'));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'camera_app'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to database!');
});

// Endpoint to upload photo
app.post('/upload', (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).send('No image data');
  }

  // Strip the base64 header
  const base64Data = image.replace(/^data:image\/png;base64,/, "");

  // Save in DB (as BLOB)
  db.query('INSERT INTO photos (image) VALUES (?)', [base64Data], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('DB error');
    }
    res.send('Image saved successfully!');
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
