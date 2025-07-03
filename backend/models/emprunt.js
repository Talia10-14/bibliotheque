const mongoose = require('mongoose');

const empruntSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  livre: { type: mongoose.Schema.Types.ObjectId, ref: 'Livre', required: true },
  dateEmprunt: { type: Date, default: Date.now },
  dateRetourPrevue: { type: Date }, // <-- Date prévue automatiquement
  dateRetour: { type: Date }, // Date réelle si rendu
  rendu: { type: Boolean, default: false },
  reclamation: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Emprunt', empruntSchema);
