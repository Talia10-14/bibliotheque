const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connexion MongoDB
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.error('Erreur MongoDB:', err));
} else {
  console.warn('MONGO_URI non défini dans les variables d\'environnement');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Routes API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/livres', require('./routes/livres'));
app.use('/api/emprunts', require('./routes/emprunt'));
app.use('/api/utilisateurs', require('./routes/utilisateurs'));

// Servir le frontend statique
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Route d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'accueil.html'));
});

// Fallback pour les routes frontend (SPA)
app.use('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'accueil.html'));
});

module.exports = app;
