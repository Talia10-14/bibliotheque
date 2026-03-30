console.log('Route /api/emprunts chargée');

const express = require('express');
const router = express.Router(); 
const Utilisateur = require('../models/utilisateur');
const Livre = require('../models/livre');
const Emprunt = require('../models/emprunt');
const { verifyToken } = require('../middleware/auth');

router.post('/',verifyToken, async (req, res) => {
    try {
      const { livre } = req.body;

      // Vérifier si le livre existe et est disponible
      const livreExistant = await Livre.findById(livre);
      if (!livreExistant) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
      if (!livreExistant.disponible) {
        return res.status(409).json({ message: 'Ce livre n\'est pas disponible actuellement' });
      }
  
      const dateEmprunt = new Date();
      const dateRetourPrevue = new Date(dateEmprunt);
      dateRetourPrevue.setDate(dateRetourPrevue.getDate() + 7); 
  
      const nouvelEmprunt = new Emprunt({
        user: req.user.id,
        livre,
        dateEmprunt,
        dateRetourPrevue
      });
  
      await nouvelEmprunt.save();

      // Marquer le livre comme non disponible
      livreExistant.disponible = false;
      await livreExistant.save();

      res.status(201).json({
        message: 'Livre emprunté avec succès',
        emprunt: nouvelEmprunt
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  router.get('/', verifyToken, async (req, res) => {
    try {
      const role = req.user.role;
  
      let emprunts;
  
      if (role === 'admin' || role === 'biblio') {
        emprunts = await Emprunt.find()
          .populate('livre')
          .populate('user', 'nom email role')
          .sort({ dateEmprunt: -1 });
      } else {
        emprunts = await Emprunt.find({ user: req.user.id })
          .populate('livre')
          .sort({ dateEmprunt: -1 });
      }
  
      res.json(emprunts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  router.post('/:id/rendu', verifyToken, async (req, res) => {
    try {
      const emprunt = await Emprunt.findById(req.params.id).populate('livre');
      if (!emprunt) return res.status(404).json({ message: 'Emprunt non trouvé' });
  
      emprunt.rendu = true;
      await emprunt.save();

      // Marquer le livre comme disponible à nouveau
      if (emprunt.livre) {
        emprunt.livre.disponible = true;
        await emprunt.livre.save();
      }
  
      res.json({ message: '📗 Livre marqué comme rendu.' });
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
    }
  });
  
// POST /api/emprunts/:id/reclamer
router.post('/:id/reclamer', verifyToken, async (req, res) => {
  console.log('Route reclamer appelée');

  try {
    console.log('Requête de réclamation reçue pour emprunt id:', req.params.id);
    const emprunt = await Emprunt.findById(req.params.id).populate(['user', 'livre']);

    console.log('Emprunt complet:', JSON.stringify(emprunt, null, 2));

    if (!emprunt) {
      console.log('Emprunt non trouvé');

      return res.status(404).json({ message: 'Emprunt non trouvé' });
    }
    if (!emprunt.user || !emprunt.livre) {
      console.log('Utilisateur ou livre lié manquant');
      return res.status(404).json({ message: 'Utilisateur ou livre lié à cet emprunt non trouvé' });
    }
    if (!emprunt.dateRetourPrevue) {
      console.log('Date de retour prévue manquante');

      return res.status(400).json({ message: 'Date de retour prévue non définie.' });
    }
    // Vérifier si l'emprunt est en retard
    const enRetard = new Date(emprunt.dateRetourPrevue) < new Date();
    if (!enRetard) {
      console.log('Emprunt pas en retard');

      return res.status(400).json({ message: 'Ce livre n’est pas encore en retard.' });
    }
    emprunt.reclamation = true;
    await emprunt.save();
    console.log(`Réclamation envoyée à ${emprunt.user.email} pour le livre ${emprunt.livre.titre}`);

    // Simuler un envoi d’email (console log ou autre)
    console.log(`📧 Réclamation envoyée à ${emprunt.user.email} pour le livre ${emprunt.livre.titre}`);

    res.json({ message: 'Réclamation envoyée avec succès !' });
  } catch (err) {
    console.error('Erreur dans /reclamer:', err.stack || err);

    res.status(500).json({ message: 'Erreur serveur' });
  }
});

  module.exports = router;
