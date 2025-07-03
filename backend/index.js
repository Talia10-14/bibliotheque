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
app.use(cors());
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



// Route test
app.get('/', (req, res) => {
  res.send('API en ligne ✅');
});
console.log('✔️ Routes auth chargées');

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});

