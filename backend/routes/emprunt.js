const express = require('express');
const router = express.Router(); 
const Emprunt = require('../models/emprunt');
const { verifyToken } = require('../middleware/auth');

router.post('/',verifyToken, async (req, res) => {
    try {
      const { livre } = req.body;
  
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
      res.status(201).json({
        message: 'Livre emprunté avec succès',
        emprunt: nouvelEmprunt
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  module.exports = router;
