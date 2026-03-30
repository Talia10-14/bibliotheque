// index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/utilisateur');
const empruntRoutes = require('./routes/emprunt');
const livresRoute = require('./routes/livres');
const Livre = require('./models/livre');
const multer = require('multer');
const path = require('path');

dotenv.config();

const utilisateursRoute = require('./routes/utilisateurs');

const app = express();


const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/utilisateurs', utilisateursRoute); 
// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  // options facultatives pour les anciennes versions, sinon tu peux les ignorer
})
.then(() => {
  console.log('✅ Connecté à MongoDB');

})
.then(() => {
  console.log('📚 Livre enregistré !');
})
.catch((err) => {
  console.error('❌ Erreur MongoDB :', err);
});

// Routes
const authRoutes = require('./routes/auth');

app.use('/api/livres', livresRoute);
app.use('/api/auth', authRoutes);

app.use('/api/emprunts', empruntRoutes);
app.use('/uploads', express.static('uploads'));

// Servir les fichiers statiques du frontend
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Route pour servir accueil.html par défaut
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'accueil.html'));
});

// Route test API
app.get('/api/health', (req, res) => {
  res.json({ status: 'API en ligne ✅' });
});

// Fallback pour toutes les autres routes (SPA)
app.get('*', (req, res) => {
  if (req.url.startsWith('/api')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.sendFile(path.join(frontendPath, 'accueil.html'));
  }
});

console.log('✔️ Routes auth chargées');

// Exporter pour Vercel
module.exports = app;

// Lancer le serveur (local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${PORT}`);
  });
}

