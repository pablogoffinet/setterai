# Guide de Démarrage - SaaS Messaging Platform

## 🚀 Installation Rapide

### Option 1: Script Automatisé (Recommandé)

```bash
# Exécuter le script de setup automatisé
./scripts/setup.sh
```

Le script va :
- ✅ Vérifier et installer Node.js (≥18) si nécessaire
- ✅ Créer le fichier `.env` depuis `.env.example`
- ✅ Installer toutes les dépendances des microservices
- ✅ Configurer Prisma et la base de données

### Option 2: Installation Manuelle

#### 1. Installer Node.js

**macOS (avec Homebrew):**
```bash
brew install node@18
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows:**
Téléchargez depuis [nodejs.org](https://nodejs.org/)

#### 2. Vérifier l'installation
```bash
node --version  # Doit être ≥ v18
npm --version
```

#### 3. Installer les dépendances
```bash
# Dépendances racine
npm install

# Chaque microservice
cd backend && npm install && cd ..
cd ai-engine && npm install && cd ..
cd queue-service && npm install && cd ..
cd frontend && npm install && cd ..
```

## ⚙️ Configuration

### 1. Variables d'Environnement

```bash
# Copier le template
cp .env.example .env
```

Éditer `.env` avec vos clés :

```env
# 🔑 OBLIGATOIRE - JWT Secret (32+ caractères)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-32chars

# 🤖 APIs IA (au moins une requise)
OPENAI_API_KEY=sk-proj-xxxxx  # Pour GPT-4
CLAUDE_API_KEY=xxxxx          # Pour Claude
MISTRAL_API_KEY=xxxxx         # Pour Mistral

# 📞 Unipile (multi-canaux) - OBLIGATOIRE
UNIPILE_API_KEY=xxxxx
UNIPILE_API_URL=https://api.unipile.com/v1
UNIPILE_WEBHOOK_SECRET=xxxxx

# 🗄️ Base de données
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/saas_messaging
```

### 2. Génération Clé JWT

```bash
# Générer une clé aléatoire sécurisée
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Configuration Unipile

1. Créez un compte sur [Unipile](https://unipile.com)
2. Obtenez votre API key
3. Configurez les webhooks pointant vers `http://votre-domaine.com/api/webhooks/unipile`

## 🐳 Démarrage avec Docker (Recommandé)

### 1. Démarrer l'infrastructure
```bash
# PostgreSQL + Redis + PgAdmin
npm run docker:up
```

### 2. Initialiser la base de données
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed  # Données de test (optionnel)
```

### 3. Démarrer les services
```bash
# Tous les microservices
npm run dev

# Ou individuellement
npm run dev:backend    # Port 3000
npm run dev:ai         # Port 3001  
npm run dev:queue      # Port 3002
npm run dev:frontend   # Port 3003
```

## 🖥️ Démarrage sans Docker

### 1. Installer PostgreSQL
**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Installer Redis
**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu:**
```bash
sudo apt install redis-server
sudo systemctl start redis
```

### 3. Créer la base de données
```bash
# Se connecter à PostgreSQL
psql postgres

# Créer la base
CREATE DATABASE saas_messaging;
CREATE USER postgres WITH PASSWORD 'postgres123';
GRANT ALL PRIVILEGES ON DATABASE saas_messaging TO postgres;
\q
```

### 4. Configurer l'URL de base
Modifier `.env` :
```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/saas_messaging
REDIS_URL=redis://localhost:6379
```

## 🎯 Première Utilisation

### 1. Vérifier que tout fonctionne

**Health checks:**
```bash
curl http://localhost:3000/health  # Backend
curl http://localhost:3001/health  # AI Engine
curl http://localhost:3002/health  # Queue Service
open http://localhost:3003         # Frontend
```

### 2. Accéder à la documentation
**Swagger API:** http://localhost:3000/api/docs

### 3. Interface d'administration base de données
**Prisma Studio:** 
```bash
cd backend && npx prisma studio
```
Accessible sur http://localhost:5555

### 4. Créer votre premier utilisateur

**Via API:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

## 🔗 Connecter vos premiers canaux

### 1. LinkedIn via Unipile
```bash
curl -X POST http://localhost:3000/api/channels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Mon LinkedIn Pro",
    "type": "LINKEDIN", 
    "provider": "unipile",
    "credentials": {
      "account_id": "your_unipile_linkedin_account_id"
    }
  }'
```

### 2. Email
```bash
curl -X POST http://localhost:3000/api/channels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Email Pro",
    "type": "EMAIL",
    "provider": "smtp",
    "credentials": {
      "host": "smtp.gmail.com",
      "port": 587,
      "username": "your-email@gmail.com", 
      "password": "app-password"
    }
  }'
```

## 🤖 Configurer votre premier agent IA

```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Assistant Commercial",
    "type": "SALES",
    "description": "Agent spécialisé dans la prospection commerciale",
    "prompt": "Tu es un assistant commercial expert. Réponds de manière professionnelle et persuasive tout en étant authentique et utile.",
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 500
  }'
```

## 📊 Monitoring et Logs

### Logs en temps réel
```bash
# Backend
cd backend && npm run dev

# Logs Docker
docker-compose logs -f backend
docker-compose logs -f ai-engine
```

### Métriques Redis
```bash
redis-cli monitor
```

### Stats des queues
```bash
curl http://localhost:3002/queues/stats
```

## 🚨 Dépannage

### Problèmes courants

**1. Erreur "Cannot find module"**
```bash
# Réinstaller les dépendances
npm run setup
```

**2. Erreur de connexion PostgreSQL**
```bash
# Vérifier que PostgreSQL fonctionne
psql postgres -c "SELECT version();"

# Recréer la base si nécessaire
cd backend && npx prisma migrate reset
```

**3. Erreur Redis**
```bash
# Vérifier Redis
redis-cli ping  # Doit retourner "PONG"

# Redémarrer Redis
brew services restart redis  # macOS
sudo systemctl restart redis  # Linux
```

**4. Erreur de clés API**
```bash
# Vérifier le fichier .env
cat .env | grep API_KEY

# Tester OpenAI
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

### Remise à zéro complète
```bash
# Arrêter tous les services
npm run docker:down

# Nettoyer les volumes Docker
docker-compose down -v

# Réinitialiser la base
cd backend && npx prisma migrate reset --force

# Redémarrer
npm run docker:up
npm run dev
```

## ✅ Checklist de Validation

- [ ] Node.js ≥ 18 installé
- [ ] Toutes les dépendances installées sans erreur
- [ ] Fichier `.env` configuré avec vos clés
- [ ] PostgreSQL accessible 
- [ ] Redis accessible
- [ ] Backend répond sur http://localhost:3000/health
- [ ] AI Engine répond sur http://localhost:3001/health  
- [ ] Queue Service répond sur http://localhost:3002/health
- [ ] Frontend accessible sur http://localhost:3003
- [ ] Documentation API visible sur http://localhost:3000/api/docs
- [ ] Premier utilisateur créé
- [ ] Au moins un canal connecté
- [ ] Au moins un agent IA configuré

## 🆘 Besoin d'aide ?

- 📖 **Documentation complète:** `/docs`
- 🐛 **Signaler un bug:** GitHub Issues
- 💬 **Support:** support@saas-messaging.com
- 📺 **Vidéos tutoriels:** [YouTube Channel]

---

**Prêt à révolutionner vos conversations ! 🚀** 