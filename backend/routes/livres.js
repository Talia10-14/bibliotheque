// routes/livres.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Livre = require('../models/livre');
const { verifyToken, requireRole } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Route POST avec upload et vérification d'authentification & rôle
router.post('/', verifyToken, requireRole(['admin', 'biblio']), upload.single('fichier'), async (req, res) => {
  try {
    const livreData = {
      titre: req.body.titre,
      auteur: req.body.auteur,
      annee: req.body.annee,
      categorie: req.body.categorie,
      fichier: req.file ? req.file.filename : null,  // Stocker juste le nom du fichier
      isbn: req.body.isbn,
      edition: req.body.edition
    };

    const nouveauLivre = new Livre(livreData);
    await nouveauLivre.save();

    res.status(201).json({ message: 'Livre ajouté avec succès', livre: nouveauLivre });
  } catch (err) {
    console.error('❌ Erreur lors de l\'ajout du livre :', err);
    res.status(400).json({ erreur: 'Erreur lors de l\'ajout du livre' });
  }
});


// 📚 Voir tous les livres
router.get('/', async (req, res) => {
  try {
    const livres = await Livre.find();
    res.json(livres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Modifier un livre
router.put('/:id',verifyToken,(req,res,next)=>{
    const { role } = req.user;
    if (role === 'admin' || role === 'biblio') return next();
    return res.status(403).json({ message: 'Seul un admin ou un bibliothécaire peut modifier des livres.' });
}, async (req, res) => {
    try {
      const livre = await Livre.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!livre) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
      res.status(200).json(livre);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
// Supprimer un livre
router.delete('/:id',verifyToken,requireRole('admin'), async (req, res) => {
    try {
      const livre = await Livre.findByIdAndDelete(req.params.id);
      if (!livre) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
      res.status(200).json({ message: 'Livre supprimé' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
