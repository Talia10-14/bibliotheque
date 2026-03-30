# Guide de déploiement Vercel - Bibliothèque App

## 🎯 Corrections appliquées

### ✅ Backend (index.js)
- ✅ Ajout de la connexion MongoDB
- ✅ Ajout de CORS
- ✅ Montage de toutes les routes API (`/api/auth`, `/api/livres`, `/api/emprunts`, `/api/utilisateurs`)

### ✅ Frontend (toutes les URLs)
- ✅ Remplacement des URLs `http://localhost:5000/api/...` par `/api/...`
- ✅ Remplacement des URLs d'uploads `http://localhost:5000/uploads/...` par `/uploads/...`

---

## 📋 Checklist avant déploiement

### 1. Variables d'environnement Vercel

Allez à https://vercel.com → Votre projet → Settings → Environment Variables

Ajoutez:
```
MONGO_URI = mongodb+srv://...
JWT_SECRET = bibliotheque_jwt_secret_2024_...
FRONTEND_URL = https://votre-domaine.vercel.app
```

### 2. Configuration de la racine du projet

Vercel doit pointer vers le backend comme fonction serverless:
- **Root Directory**: `.` (racine)
- **Framework**: Next.js / Node.js (auto-détecté)

### 3. Point d'entrée

Vérifiez que le fichier [vercel.json](./vercel.json) est correct:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/**",
      "use": "@vercel/static@latest"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

---

## 🚀 Déploiement

### Option 1: Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

### Option 2: Via GitHub (recommandé)
1. Poussez le code vers GitHub
2. Connectez Vercel à votre repo GitHub
3. Vercel se re-déploiera automatiquement à chaque push

---

## ⚠️ Problème CRITIQUE: Système de fichiers éphémère

**Vercel supprime tous les fichiers uploadés après chaque déploiement!**

### Solutions:
- **Option 1** (Recommandée): Utiliser **AWS S3** / **Cloudinary** / **Firebase Storage**
- **Option 2**: Stocker les images directement dans MongoDB (Base64)
- **Option 3**: Utiliser une base de données cloud pour les métadonnées + CDN pour les fichiers

### Configuration AWS S3 (exemple)

1. **Installer le package**:
   ```bash
   npm install aws-sdk
   ```

2. **Ajouter les variables Vercel**:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `AWS_BUCKET_NAME`

3. **Mettre à jour la route d'upload**:
   ```javascript
   const AWS = require('aws-sdk');
   const s3 = new AWS.S3({
     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
     region: process.env.AWS_REGION
   });
   
   router.post('/upload', async (req, res) => {
     // ... validation ...
     const result = await s3.upload({
       Bucket: process.env.AWS_BUCKET_NAME,
       Key: filename,
       Body: fileBuffer
     }).promise();
     
     // Stocker result.Location (URL) dans MongoDB
   });
   ```

---

## 🧪 Test post-déploiement

Vérifiez que tout fonctionne:

```bash
# Test de santé
curl https://votre-domaine.vercel.app/api/health

# Test d'inscription
curl -X POST https://votre-domaine.vercel.app/api/auth/inscription \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","prenom":"User","email":"test@test.com","motdepasse":"password"}'

# Test de récupération des livres
curl https://votre-domaine.vercel.app/api/livres
```

---

## 📊 Logs et debugging

### Voir les logs Vercel:
1. Allez à https://vercel.com/dashboard
2. Sélectionnez le projet
3. Onglet **Deployments**
4. Cliquez sur le déploiement
5. Onglet **Functions** pour les erreurs

### Logs en temps réel:
```bash
vercel logs your-project.vercel.app --follow
```

---

## 🔒 Sécurité - Points critiques

- [ ] `.env` n'est pas poussé sur GitHub (.gitignore)
- [ ] JWT_SECRET est fort et aléatoire
- [ ] CORS est configuré (voir backend/index.js)
- [ ] Mot de passe MongoDB est sécurisé

---

## 📚 Ressources

- [Documentation Vercel Node.js](https://vercel.com/docs/functions/nodejs)
- [Documentation MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Guide AWS S3](https://docs.aws.amazon.com/s3/)
- [Cloudinary JS SDK](https://cloudinary.com/documentation/node_sdk)

---

## 🆘 Problèmes courants

### Erreur: "Cannot find module 'mongoose'"
→ Vérifiez que `npm install` a été exécuté dans le dossier backend

### Erreur: "MONGO_URI is not defined"
→ Ajoutez la variable dans Vercel Environment Variables

### Erreur: "CORS blocked"
→ Vérifiez que CORS est activé dans backend/index.js

### Uploads ne persistent pas
→ Configurez AWS S3 ou Cloudinary (voir section ci-dessus)

---

**Créé le**: 31/03/2026  
**Dernière mise à jour**: 31/03/2026
