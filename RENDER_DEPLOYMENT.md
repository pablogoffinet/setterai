# 🚀 Guide de Déploiement sur Render

## 📋 Prérequis

1. **Compte Render** : Créez un compte sur [render.com](https://render.com)
2. **Repository Git** : Votre code doit être sur GitHub/GitLab
3. **Clés API** : Préparez vos clés API (OpenAI, Claude, etc.)

## 🔧 Configuration

### 1. Variables d'Environnement sur Render

Dans votre dashboard Render, configurez ces variables :

#### Variables OBLIGATOIRES :
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=votre-super-secret-jwt-32-caracteres-minimum
DATABASE_URL=postgresql://... (fourni par Render)
REDIS_URL=redis://... (fourni par Render)
```

#### Variables API (au moins une requise) :
```env
OPENAI_API_KEY=sk-proj-xxxxx
CLAUDE_API_KEY=sk-ant-xxxxx
MISTRAL_API_KEY=xxxxx
```

#### Variables Unipile (OBLIGATOIRES) :
```env
UNIPILE_API_KEY=F3ycCpCT.sF+Tp4gkJ6r0qkbXmS8dVTuO6f0my99AWv9UcyNBmMc=
UNIPILE_API_URL=https://api8.unipile.com:13813/api/v1
UNIPILE_WEBHOOK_SECRET=97GMEpPEQzgMEe15gkX0grhxTyZErfk10jEz1-7_b88
```

### 2. Déploiement Automatique

#### Option A : Via render.yaml (Recommandé)
1. Poussez votre code avec le fichier `render.yaml`
2. Connectez votre repo à Render
3. Render détectera automatiquement la configuration

#### Option B : Manuel
1. Créez un nouveau **Web Service** sur Render
2. Connectez votre repository Git
3. Configuration :
   - **Environment** : Docker
   - **Build Command** : `npm run build`
   - **Start Command** : `npm start`
   - **Port** : 3000

## 🗄️ Base de Données

### PostgreSQL
1. Créez une **PostgreSQL Database** sur Render
2. Copiez l'URL de connexion
3. Ajoutez-la comme variable `DATABASE_URL`

### Redis
1. Créez un **Redis Database** sur Render
2. Copiez l'URL de connexion
3. Ajoutez-la comme variable `REDIS_URL`

## 🔄 Migrations de Base de Données

Après le premier déploiement, exécutez les migrations :

```bash
# Via Render Shell ou en local avec la DB de production
cd backend
npx prisma migrate deploy
npx prisma generate
```

## 🌐 URLs de Production

Une fois déployé, vos URLs seront :
- **API Backend** : `https://linkedin-prospector-api.onrender.com`
- **Frontend** : `https://linkedin-prospector-frontend.onrender.com`
- **Documentation API** : `https://linkedin-prospector-api.onrender.com/api/docs`

## 🔧 Configuration Webhook Unipile

1. Allez dans votre dashboard Unipile
2. Configurez le webhook vers : `https://linkedin-prospector-api.onrender.com/api/webhooks/unipile`
3. Utilisez le secret configuré dans vos variables d'environnement

## 🚀 Développement Local

Pour continuer le développement localement :

```bash
# Copier la configuration locale
cp default.env .env.local

# Installer les dépendances
npm install

# Démarrer les services locaux
npm run dev

# URLs locales
# Backend: http://localhost:3000
# AI Engine: http://localhost:3001
# Queue Service: http://localhost:3002
# Frontend: http://localhost:4200
```

## 🔍 Monitoring

### Health Checks
- **Backend** : `https://linkedin-prospector-api.onrender.com/health`
- **AI Engine** : `https://linkedin-prospector-api.onrender.com:3001/health`
- **Queue Service** : `https://linkedin-prospector-api.onrender.com:3002/health`

### Logs
Accédez aux logs via le dashboard Render pour chaque service.

## 🛠️ Dépannage

### Erreurs Communes

1. **Port déjà utilisé** : Vérifiez que le port 3000 est libre
2. **Variables d'environnement manquantes** : Vérifiez toutes les variables requises
3. **Base de données non connectée** : Vérifiez l'URL de connexion PostgreSQL
4. **Build échoue** : Vérifiez les logs de build dans Render

### Commandes Utiles

```bash
# Vérifier la santé des services
curl https://linkedin-prospector-api.onrender.com/health

# Tester l'API
curl https://linkedin-prospector-api.onrender.com/api/test

# Vérifier la documentation
open https://linkedin-prospector-api.onrender.com/api/docs
```

## 📞 Support

En cas de problème :
1. Vérifiez les logs dans le dashboard Render
2. Testez les health checks
3. Vérifiez la configuration des variables d'environnement
4. Consultez la documentation API

## 🔄 Mise à Jour

Pour mettre à jour votre application :
1. Poussez vos changements sur Git
2. Render redéploiera automatiquement
3. Vérifiez que tout fonctionne après le déploiement 