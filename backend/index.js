// index.js - Simplified for Vercel

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// Load routes safely
try {
  app.use('/api/auth', require('./routes/auth'));
} catch (e) {
  console.warn('⚠️ Auth failed:', e.message);
}

try {
  app.use('/api/livres', require('./routes/livres'));
} catch (e) {
  console.warn('⚠️ Livres failed:', e.message);
}

try {
  app.use('/api/utilisateurs', require('./routes/utilisateurs'));
} catch (e) {
  console.warn('⚠️ Utilisateurs failed:', e.message);
}

try {
  app.use('/api/emprunts', require('./routes/emprunt'));
} catch (e) {
  console.warn('⚠️ Emprunt failed:', e.message);
}

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'accueil.html'));
});

// SPA fallback
app.use('*', (req, res) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(frontendPath, 'accueil.html'));
});

console.log('✅ App ready');

module.exports = app;

// Local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Listening on ${PORT}`));
}
