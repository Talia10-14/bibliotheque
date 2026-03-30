# 📚 Bibliotech - Library Management System

Une application complète de gestion de bibliothèque avec authentification utilisateur, gestion des emprunts et catalogue numérique.

## 🎯 Fonctionnalités

- ✅ **Authentification** - Inscription & Connexion sécurisées avec JWT
- ✅ **Gestion des Livres** - Consultation du catalogue physique et numérique
- ✅ **Emprunts** - Système de demande et retour de livres
- ✅ **Dashboards** - Interfaces pour utilisateurs, bibliothécaires et administrateurs
- ✅ **Design Responsive** - Support mobile, tablette et desktop
- ✅ **API Google Books** - Intégration avec fallback gracieux

## 🛠 Stack Technique

**Backend:**
- Node.js + Express 5.1.0
- MongoDB (Atlas)
- JWT pour l'authentification
- Bcrypt pour le hachage des mots de passe

**Frontend:**
- HTML5 / CSS3 / JavaScript vanilla
- Bootstrap 5.3.3
- Font Awesome 6.0.0
- Google Books API

## 🚀 Déploiement

### Prérequis

1. **Compte GitHub** - Créer un repo public
2. **Compte Vercel** - Connecté à GitHub (gratuit)
3. **MongoDB Atlas** - Accès à la base de données

### Étapes de déploiement

1. **Créer un repository sur GitHub**
   - Aller sur https://github.com/new
   - Créer un repo "bibliotech"
   - NE PAS initialiser avec README

2. **Pousser le code local**
   ```bash
   cd /home/justalie/Téléchargements/bibliotheque-main
   git remote add origin https://github.com/VOTRE_USERNAME/bibliotech.git
   git branch -M main
   git add .
   git commit -m "Initial commit: Bibliotech application"
   git push -u origin main
   ```

3. **Déployer sur Vercel**
   - Aller sur https://vercel.com/new
   - Sélectionner le repo "bibliotech"
   - Cliquer "Deploy"
   - Aller à "Settings" → "Environment Variables"
   - Ajouter les variables:
     - `MONGO_URI`: Votre URI MongoDB Atlas
     - `JWT_SECRET`: Une clé secrète forte
     - `FRONTEND_URL`: URL du déploiement Vercel

4. **Redéployer après chaque changement**
   ```bash
   git add .
   git commit -m "Description du changement"
   git push origin main
   ```

## 📝 Configuration

Créer un fichier `.env` dans le dossier `backend/`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bibliotech
JWT_SECRET=votre_clé_secrète_très_très_longue
FRONTEND_URL=https://votre-domaine.vercel.app
```

## 🎮 Commandes Locales

```bash
# Backend
cd backend
npm install
npm run dev      # Développement avec nodemon
npm start        # Production

# Frontend
# Les fichiers HTML/CSS/JS sont servis directement
```

## 📱 Responsive Design

L'application s'adapte à tous les écrans:
- 📱 Mobile (< 480px)
- 📱 Tablet (480px - 768px)
- 💻 Desktop (> 768px)

## 👥 Rôles Utilisateurs

- **User** - Consulter livres, faire des demandes d'emprunt
- **Biblio** - Gérer les emprunts, statut des livres
- **Admin** - Ajouter/modifier/supprimer livres, gérer utilisateurs

## 📚 API Endpoints

### Authentification
- `POST /api/auth/inscription` - Créer un compte
- `POST /api/auth/connexion` - Se connecter

### Livres
- `GET /api/livres` - Lister les livres
- `POST /api/livres` - Ajouter un livre (admin/biblio)

### Emprunts
- `GET /api/emprunts` - Voir mes emprunts
- `POST /api/emprunts/:id/reclamer` - Demander un livre

## 🐛 Dépannage

**Les livres ne chargent pas?**
- Vérifier la limite de requêtes Google Books API
- Fallback avec données mockées en place

**Erreur MongoDB?**
- Vérifier IP whitelisted sur MongoDB Atlas
- Vérifier MONGO_URI dans variables d'environnement

**Autres issues?**
- Vérifier les logs du backend
- Vérifier la console navigateur (F12)

## 📄 Licence

ISC

## 👨‍💻 Développeur

Bibliotech Team
