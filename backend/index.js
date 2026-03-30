// index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Charger les modèles
let mongoConnected = false;

try {
  const User = require('./models/utilisateur');
  const Livre = require('./models/livre');
} catch (err) {
  console.warn('⚠️ Modèles non disponibles au démarrage:', err.message);
}

// Connexion à MongoDB (async, non-bloquant)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    mongoConnected = true;
    console.log('✅ Connecté à MongoDB');
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB non disponible:', err.message);
  });
} else {
  console.warn('⚠️ MONGO_URI non défini');
}

// Routes
const authRoutes = require('./routes/auth');
const empruntRoutes = require('./routes/emprunt');
const livresRoute = require('./routes/livres');
const utilisateursRoute = require('./routes/utilisateurs');

app.use('/api/utilisateurs', utilisateursRoute);

app.use('/api/utilisateurs', utilisateursRoute);
app.use('/api/livres', livresRoute);
app.use('/api/auth', authRoutes);
app.use('/api/emprunts', empruntRoutes);

// Serveur statique pour uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Servir les fichiers statiques du frontend
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'API en ligne ✅',
    mongoConnected: mongoConnected
  });
});

// Route racine
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'accueil.html'));
});

// Fallback pour SPA
app.use('*', (req, res) => {
  if (req.url.startsWith('/api')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.sendFile(path.join(frontendPath, 'accueil.html'));
  }
});

console.log('✔️ Routes chargées');

// Exporter pour Vercel
module.exports = app;

// Lancer localement seulement
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${PORT}`);
  });
}

// Lancer le serveur (local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${PORT}`);
  });
}

