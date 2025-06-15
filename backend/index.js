// index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const livresRoute = require('./routes/livres');
const Livre = require('./models/livre'); // Importer le modèle
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  // options facultatives pour les anciennes versions, sinon tu peux les ignorer
})
.then(() => {
  console.log('✅ Connecté à MongoDB');

  // Tester l'ajout d'un livre APRES la connexion réussie
  const nouveauLivre = new Livre({
    titre: 'Les Misérables',
    auteur: 'Victor Hugo',
    année: 1862
  });

  return nouveauLivre.save();
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


// Route test
app.get('/', (req, res) => {
  res.send('API en ligne ✅');
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});

