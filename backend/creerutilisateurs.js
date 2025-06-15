const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Utilisateur = require('./models/utilisateur');

const MONGO_URI = 'mongodb+srv://mahoussitchogbe06:5gDbiH7lznxf5HrT@cluster0.layd9pi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // ou ton URI MongoDB Atlas

async function creerUtilisateur(nom, prenom, email, motdepasse, role) {
  try {
    const existant = await Utilisateur.findOne({ email });
    if (existant) {
      console.log('Un utilisateur avec cet email existe déjà.');
      return;
    }

    const hashedPassword = await bcrypt.hash(motdepasse, 10);

    const nouvelUtilisateur = new Utilisateur({
      nom,
      prenom,
      email,
      motdepasse: hashedPassword,
      role,
    });

    await nouvelUtilisateur.save();
    console.log(`${role} créé avec succès !`);
    mongoose.disconnect();
  } catch (err) {
    console.error('Erreur lors de la création :', err);
  }
}

async function creerTous() {
    try {
      await mongoose.connect(MONGO_URI);
  
      await creerUtilisateur('Admin', 'Principal', 'admin@example.com', 'admin123', 'admin');
      await creerUtilisateur('Biblio', 'Teka', 'biblio@example.com', 'biblio123', 'biblio');
    } catch (err) {
      console.error('Erreur globale :', err);
    } finally {
      mongoose.disconnect();
    }
  }
  
  creerTous();