const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

// JUST A TEST - No routes, no cors, nothing
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'accueil.html'));
});

app.use('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'accueil.html'));
});

module.exports = app;
