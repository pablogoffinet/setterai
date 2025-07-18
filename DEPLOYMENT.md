# 🚀 Guide de Déploiement - LinkedIn Prospector

## 📋 Prérequis

- Compte Render.com
- Clés API Unipile
- Clés API IA (Azure OpenAI, Claude, Mistral)
- Base de données PostgreSQL
- Redis

## 🎯 Déploiement sur Render

### 1. **Préparation du Repository**

Assurez-vous que votre code est sur GitHub avec la structure suivante :
```
LinkedInProspector/
├── backend/
├── frontend/
├── ai-engine/
├── queue-service/
├── render.yaml
└── env.example
```

### 2. **Configuration Render**

#### Option A : Déploiement Automatique (Recommandé)

1. Connectez-vous à [Render.com](https://render.com)
2. Cliquez sur "New" → "Blueprint"
3. Connectez votre repository GitHub
4. Render détectera automatiquement le fichier `render.yaml`
5. Configurez les variables d'environnement (voir ci-dessous)

#### Option B : Déploiement Manuel

Créez 4 services web séparés :

**Backend API :**
- Build Command: `cd backend && npm install && npx prisma generate`
- Start Command: `cd backend && npm run start`
- Port: 3001

**Frontend :**
- Build Command: `cd frontend && npm install && npm run build`
- Start Command: `cd frontend && npm start`
- Port: 4200

**AI Engine :**
- Build Command: `cd ai-engine && npm install`
- Start Command: `cd ai-engine && npm run start`
- Port: 3002

**Queue Service :**
- Build Command: `cd queue-service && npm install`
- Start Command: `cd queue-service && npm run start`
- Port: 3003

### 3. **Variables d'Environnement**

#### Backend API
```
NODE_ENV=production
DATABASE_URL=<from-database>
REDIS_URL=<from-redis>
JWT_SECRET=<generate>
UNIPILE_API_KEY=<your-key>
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_ENDPOINT=<your-endpoint>
ANTHROPIC_API_KEY=<your-key>
MISTRAL_API_KEY=<your-key>
PORT=3001
```

#### Frontend
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
PORT=4200
```

#### AI Engine
```
NODE_ENV=production
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_ENDPOINT=<your-endpoint>
ANTHROPIC_API_KEY=<your-key>
MISTRAL_API_KEY=<your-key>
PORT=3002
```

#### Queue Service
```
NODE_ENV=production
REDIS_URL=<from-redis>
PORT=3003
```

### 4. **Base de Données PostgreSQL**

1. Créez une base de données PostgreSQL sur Render
2. Notez l'URL de connexion
3. Ajoutez-la comme variable `DATABASE_URL` dans le backend

### 5. **Redis**

1. Créez un service Redis sur Render
2. Notez l'URL de connexion
3. Ajoutez-la comme variable `REDIS_URL` dans le backend et queue service

### 6. **Migration de la Base de Données**

Après le premier déploiement, exécutez :
```bash
# Dans le backend
npx prisma migrate deploy
npx prisma generate
```

## 🔧 Configuration des APIs

### Unipile API
1. Créez un compte sur [Unipile.com](https://unipile.com)
2. Obtenez votre clé API
3. Configurez les connexions LinkedIn, Email, WhatsApp

### Azure OpenAI
1. Créez une ressource Azure OpenAI
2. Déployez un modèle GPT-4
3. Notez l'endpoint et la clé API

### Anthropic Claude
1. Créez un compte sur [Anthropic.com](https://anthropic.com)
2. Obtenez votre clé API

### Mistral AI
1. Créez un compte sur [Mistral.ai](https://mistral.ai)
2. Obtenez votre clé API

## 🌐 URLs Finales

Après déploiement, vous aurez :
- **Frontend** : `https://linkedin-prospector-frontend.onrender.com`
- **Backend** : `https://linkedin-prospector-backend.onrender.com`
- **AI Engine** : `https://linkedin-prospector-ai-engine.onrender.com`
- **Queue Service** : `https://linkedin-prospector-queue.onrender.com`

## 🔍 Vérification

1. Testez le frontend : `https://linkedin-prospector-frontend.onrender.com`
2. Testez l'API : `https://linkedin-prospector-backend.onrender.com/health`
3. Vérifiez les logs dans Render Dashboard

## 🚨 Dépannage

### Erreurs Communes

**Build Failed :**
- Vérifiez les dépendances dans `package.json`
- Assurez-vous que TypeScript compile correctement

**Database Connection :**
- Vérifiez l'URL de la base de données
- Assurez-vous que les migrations sont appliquées

**API Keys :**
- Vérifiez que toutes les clés API sont correctes
- Testez les APIs individuellement

### Logs

Consultez les logs dans le Dashboard Render pour diagnostiquer les problèmes.

## 📞 Support

En cas de problème :
1. Vérifiez les logs Render
2. Testez localement avec les mêmes variables d'environnement
3. Vérifiez la documentation des APIs tierces 