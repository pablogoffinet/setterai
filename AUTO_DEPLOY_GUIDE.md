# 🚀 Guide de Déploiement Automatique - LinkedIn Prospector

## ✅ Configuration Prête

Votre projet est maintenant **100% configuré** pour le déploiement automatique !

## 🎯 URLs de Déploiement

### Backend API (Déjà déployé)
- **URL** : https://setterai-729q.onrender.com
- **Status** : ✅ Fonctionnel
- **Health Check** : https://setterai-729q.onrender.com/health

### Frontend Next.js (À déployer)
- **URL** : https://linkedin-prospector-frontend.onrender.com
- **Configuration** : ✅ Prête

## 🚀 Options de Déploiement Automatique

### Option 1: Déploiement Manuel (Recommandé)
```bash
# Exécuter le script de vérification
./deploy-frontend-auto.sh
```

Puis suivre les instructions affichées.

### Option 2: Déploiement via API Render
```bash
# 1. Créer un token API sur https://render.com/account/api-keys
# 2. Exporter le token
export RENDER_API_TOKEN='votre_token_ici'

# 3. Déployer automatiquement
./deploy-render-api.sh
```

## 📋 Étapes de Déploiement Manuel

### 1. 🌐 Accès à Render
- Ouvrez : https://render.com
- Connectez-vous à votre compte

### 2. 📁 Nouveau Blueprint
- Cliquez sur **"New"**
- Sélectionnez **"Blueprint"**

### 3. 🔗 Connexion GitHub
- Connectez votre repository : `https://github.com/pablogoffinet/setterai.git`
- Render détectera automatiquement le fichier `render.yaml`

### 4. 🔧 Configuration Automatique
Le fichier `render.yaml` contient :
```yaml
services:
  # Backend API (déjà déployé)
  - name: linkedin-prospector-api
    # ... configuration backend

  # Frontend Next.js (à déployer)
  - name: linkedin-prospector-frontend
    buildCommand: cd frontend && npm install && npm run build
    startCommand: cd frontend && npm start
    envVars:
      - NEXT_PUBLIC_API_URL: https://setterai-729q.onrender.com
```

### 5. ✅ Lancement
- Cliquez sur **"Apply"**
- Attendez 5-10 minutes

## 🎨 Interface Utilisateur

Une fois déployé, votre interface web inclura :

### Dashboard Principal
- **Statistiques en temps réel**
- **Activités récentes**
- **Canaux connectés**

### Navigation Complète
- **Campagnes** - Gestion des campagnes de prospection
- **Prospects** - Base de données des prospects
- **Analytics** - Statistiques et métriques
- **Configuration IA** - Paramètres des modèles IA
- **Paramètres** - Configuration générale

## 🔧 Configuration Technique

### Frontend (Next.js)
- **Framework** : Next.js 15.4.1
- **UI** : Tailwind CSS + Lucide React
- **Port** : 3000
- **API Backend** : https://setterai-729q.onrender.com

### Backend (Node.js)
- **Framework** : Express.js
- **Database** : PostgreSQL
- **AI Integration** : OpenAI, Claude, Mistral
- **Status** : ✅ Déployé et fonctionnel

## 🔗 Test de Connexion

### Avant le déploiement
```bash
# Test du backend
curl https://setterai-729q.onrender.com/health

# Test du script de déploiement
./deploy-frontend-auto.sh
```

### Après le déploiement
```bash
# Test du frontend
curl https://linkedin-prospector-frontend.onrender.com

# Test de l'API depuis le frontend
curl https://linkedin-prospector-frontend.onrender.com/api/health
```

## 🚀 Scripts Disponibles

### `deploy-frontend-auto.sh`
- ✅ Vérification du backend
- ✅ Instructions de déploiement
- ✅ Configuration automatique

### `deploy-render-api.sh`
- ✅ Déploiement via API Render
- ✅ Monitoring automatique
- ✅ Statut en temps réel

## 🎉 Résultat Final

Votre plateforme LinkedIn Prospector aura :

```
🌐 Interface Web
├── https://linkedin-prospector-frontend.onrender.com
└── → API Backend
    └── https://setterai-729q.onrender.com
        ├── /health
        ├── /campaigns
        ├── /prospects
        ├── /analytics
        └── /ai-config
```

## 🔄 Mise à Jour Automatique

Pour mettre à jour votre application :
1. **Poussez les changements** sur GitHub
2. **Render redéploiera automatiquement**
3. **Ou déclenchez manuellement** un redéploiement

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs sur Render
2. Testez la connexion au backend
3. Vérifiez la configuration dans `render.yaml`

---

*Configuration automatique prête - Déploiement en un clic !* 🚀 