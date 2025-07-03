const mongoose = require('mongoose');


const utilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motdepasse: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin','biblio'], default: 'user' }  // rôle par défaut = user
});

module.exports = mongoose.model('Utilisateur', utilisateurSchema);
