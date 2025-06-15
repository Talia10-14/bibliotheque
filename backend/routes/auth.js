const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/utilisateur');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'uneclesecretepourlejwt';

// Inscription
router.post('/inscription', async (req, res) => {
  try {
    const { nom, prenom, email, motdepasse } = req.body;

    // Validation simple des champs
    if (!nom || !prenom || !email || !motdepasse) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // Vérifier si l'email est déjà utilisé
    const existant = await Utilisateur.findOne({ email });
    if (existant) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motdepasse, 10);

    // Créer le nouvel utilisateur
    const nouvelUtilisateur = new Utilisateur({ nom, prenom, email, motdepasse: hashedPassword,role: 'user' }); // rôle par défaut = user
    await nouvelUtilisateur.save();

    res.status(201).json({ message: 'Inscription réussie !' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur lors de l’inscription', erreur: err.message });
  }
});

// Connexion
router.post('/connexion', async (req, res) => {
  try {
    const { email, motdepasse } = req.body;

    if (!email || !motdepasse) {
      return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }

    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const estValide = await bcrypt.compare(motdepasse, utilisateur.motdepasse);
    if (!estValide) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

     // Création du token JWT avec payload (id, email, role)
     const token = jwt.sign(
        { id: utilisateur._id, email: utilisateur.email, role: utilisateur.role },
        SECRET,
        { expiresIn: '1h' } // expiration d'une heure
      );

    res.status(200).json({ message: 'Connexion réussie ✅',token,role: utilisateur.role });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur lors de la connexion', erreur: err.message });
  }
});

module.exports = router;
