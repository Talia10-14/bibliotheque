const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const Utilisateur = require('../models/utilisateur');

// Obtenir tous les utilisateurs
router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Supprimer un utilisateur
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await Utilisateur.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Modifier le rôle d’un utilisateur
router.put('/:id/role', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.json(utilisateur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
