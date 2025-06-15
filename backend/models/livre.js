// models/Livre.js
const mongoose = require('mongoose');

const livreSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  auteur: {
    type: String,
    required: true
  },
  annee: {
    type: Date,
    required: true
  },
  categorie: {
    type: String,
    enum: ['classique', 'science', 'technologie', 'arts' , 'histoire'],
    required: true
  },
  ficher: {
    type: String,
/*     required: true
 */  },
  isbn:{
    type: String,
  },
  edition: {
    type: String,
  },
  // ajouter une description
  disponible: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Livre', livreSchema);
