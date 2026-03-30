# Notes de déploiement Vercel

## Problèmes identifiés et résolus ✅

### 1. **Backend/index.js ne montait pas les routes**
- **Problème**: Le serveur ne connectait pas MongoDB et n'incluait pas les routes API (`/api/auth`, `/api/livres`, etc.)
- **Solution**: 
  - ✅ Ajouté `require('mongoose')` et `require('cors')`
  - ✅ Ajouté connexion MongoDB avec `process.env.MONGO_URI`
  - ✅ Monté toutes les routes API: `/api/auth`, `/api/livres`, `/api/emprunts`, `/api/utilisateurs`

### 2. **URLs frontend pointaient vers localhost:5000**
- **Problème**: Tous les fichiers HTML/JS utilisaient `http://localhost:5000/api/...` - ça ne fonctionne pas en production
- **Solution**:
  - ✅ Remplacé toutes les URLs hardcoded par des URLs relatives: `/api/...`
  - ✅ Remplacé `/uploads/...` par des URLs relatives

## ⚠️ Problème CRITIQUE : Uploads de fichiers sur Vercel

### Le problème
**Vercel est une plateforme serverless** - le système de fichiers est **éphémère**. Cela signifie:
- Les fichiers uploadés ne persisteront **que pendant la requête en cours**
- À chaque redéploiement, tous les fichiers sont supprimés
- Entre deux requêtes, les fichiers peuvent être perdus

### Solutions possibles

**Option 1: Utiliser AWS S3, Cloudinary, ou un service cloud similaire (RECOMMANDÉ)**
```javascript
// Exemple avec AWS S3:
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

// Au lieu de sauvegarder localement:
await s3.upload({
  Bucket: process.env.AWS_BUCKET,
  Key: filename,
  Body: buffer
}).promise();
```

**Option 2: Utiliser Cloudinary**
```javascript
const cloudinary = require('cloudinary').v2;
cloudinary.uploader.upload(filePath).then(result => {
  // Le fichier est maintenant sur Cloudinary
  // Store result.secure_url dans la base de données
});
```

**Option 3: Stockage en base de données (pour petits fichiers)**
- Convertir le fichier en Base64
- Stocker directement dans MongoDB
- ⚠️ À faire seulement pour des petits fichiers

## À faire AVANT le prochain déploiement

1. **Configurer une solution de stockage cloud**:
   - Créer un compte AWS S3 / Cloudinary / Firebase Storage
   - Ajouter les credentials dans les variables Vercel
   - Modifier la route d'upload pour utiliser le service cloud

2. **Variables d'environnement Vercel à ajouter**:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=votre_clé_secrète
   CORS_ORIGIN=https://votre-domaine.vercel.app
   
   # Pour S3 (si choix Option 1):
   AWS_ACCESS_KEY=
   AWS_SECRET_KEY=
   AWS_BUCKET=
   
   # Ou pour Cloudinary (si choix Option 2):
   CLOUDINARY_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```

## Vérification post-déploiement

Après chaque déploiement sur Vercel, vérifiez:
1. ✅ `/api/health` retourne `{ ok: true }`
2. ✅ Les routes API répondent (ex: `/api/auth/inscription`)
3. ✅ MongoDB est connectée
4. ✅ Les uploads fonctionnent (avec la solution cloud configurée)

## Command de test local

```bash
# Dans le dossier backend
npm install
node -r dotenv/config index.js

# Vérifier:
curl http://localhost:5000/api/health
```

## Logs Vercel

Pour voir les logs détaillés sur Vercel:
1. Allez à https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Onglet "Deployments" → Cliquez sur le déploiement
4. Onglet "Functions" ou "Logs" pour voir les erreurs
