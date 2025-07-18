# SetterAI - Plateforme SaaS de Messagerie Multi-Canaux 🚀

Plateforme SaaS de messagerie multi-canaux avec IA et intégration Unipile. Une solution complète pour gérer les conversations sur LinkedIn, email, WhatsApp, Telegram, Slack, Discord et plus.

## 🏗️ Architecture

### Structure Microservices

```
setterai/
├── backend/                  # API Gateway principal (Express + TypeScript)
├── ai-engine/               # Moteur IA centralisé (OpenAI, Claude, Mistral)
├── queue-service/           # Service de queues (BullMQ + Redis)
├── frontend/                # Interface utilisateur (Next.js + React)
├── monitoring/              # Observabilité et monitoring
├── infrastructure/          # Configuration Docker/Kubernetes
└── docs/                    # Documentation technique
```

### Stack Technique

- **Backend**: Express.js + TypeScript + Prisma ORM
- **Base de données**: PostgreSQL
- **Cache/Queues**: Redis + BullMQ
- **IA**: OpenAI GPT-4, Claude, Mistral
- **Frontend**: Next.js 14 + React + Tailwind CSS
- **Intégration**: Unipile API (multi-canaux)
- **Monitoring**: Winston + Sentry
- **Déploiement**: Docker + Docker Compose

## 🚀 Installation Rapide

### Prérequis

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (ou via Docker)
- Redis (ou via Docker)

### Setup Développement

1. **Cloner et installer**
```bash
git clone https://github.com/pablogoffinet/setterai.git
cd setterai
npm run setup
```

2. **Configuration**
```bash
cp default.env .env
# Éditer .env avec vos clés API
```

3. **Démarrer avec Docker**
```bash
npm run docker:up
```

4. **Démarrer en mode développement**
```bash
npm run dev
```

### URLs de développement

- **Backend API**: http://localhost:3000
- **Documentation API**: http://localhost:3000/api/docs
- **AI Engine**: http://localhost:3001  
- **Queue Service**: http://localhost:3002
- **Frontend**: http://localhost:4200

## 🔧 Configuration

### Variables d'Environnement

Copiez `default.env` vers `.env` et configurez :

```bash
# Base de données
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/setterai

# APIs IA
OPENAI_API_KEY=sk-your-openai-key
CLAUDE_API_KEY=your-claude-key

# Unipile (multi-canaux)
UNIPILE_API_KEY=your-unipile-key
UNIPILE_API_URL=https://api.unipile.com/v1

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
```

### Base de Données

```bash
# Migration et génération Prisma
cd backend
npx prisma migrate dev
npx prisma generate

# Interface Prisma Studio
npx prisma studio
```

## 📚 Fonctionnalités

### ✅ Canaux Supportés
- **LinkedIn** (messages directs, commentaires)
- **Email** (SMTP/IMAP)
- **WhatsApp Business**
- **Telegram** 
- **Slack**
- **Discord**
- **SMS**
- **Chat Website**

### 🤖 IA Intégrée
- **Multi-providers**: OpenAI, Claude, Mistral
- **Agents spécialisés**: Support, Ventes, Marketing
- **Personnalisation**: Prompts, température, tokens
- **Analyse**: Sentiment, intention, classification

### 💬 Gestion Conversations
- **Unified Inbox**: Toutes les conversations centralisées
- **Auto-routing**: Assignation automatique aux agents IA
- **Historique complet**: Recherche et filtrage avancés
- **Priorités**: Urgence et étiquetage

### 📊 Analytics & Reporting
- **Métriques temps réel**: Taux de réponse, satisfaction
- **Performance agents**: Comparaison des modèles IA
- **ROI conversations**: Tracking des conversions
- **Exports**: CSV, PDF, intégrations

## 🔄 Flux de Données

1. **Reception**: Webhook Unipile → Queue Service
2. **Traitement**: AI Engine → Analyse + Génération de réponse
3. **Stockage**: Backend → PostgreSQL
4. **Envoi**: Queue Service → Unipile → Canal externe
5. **Monitoring**: Logs → Analytics → Dashboard

## 🛠️ Développement

### Scripts Disponibles

```bash
# Développement
npm run dev                  # Tous les services
npm run dev:backend         # Backend seul
npm run dev:ai              # AI Engine seul
npm run dev:queue           # Queue Service seul
npm run dev:frontend        # Frontend seul

# Build
npm run build               # Build complet
npm run test                # Tests complets

# Base de données
npm run db:migrate          # Migrations
npm run db:seed             # Données de test
npm run db:studio           # Interface Prisma

# Docker
npm run docker:up           # Démarrer containers
npm run docker:down         # Arrêter containers
npm run docker:build        # Rebuild images
```

### Tests

```bash
# Tests par service
npm run test:backend
npm run test:ai
npm run test:queue
npm run test:frontend

# Coverage
npm run test:coverage
```

## 📖 Documentation API

Une fois le backend démarré, accédez à la documentation Swagger :
**http://localhost:3000/api/docs**

### Endpoints Principaux

- `POST /api/auth/login` - Authentification
- `GET /api/conversations` - Liste des conversations
- `POST /api/agents` - Créer un agent IA
- `POST /api/channels` - Connecter un canal
- `POST /api/webhooks/unipile` - Webhook Unipile

## 🔐 Sécurité

- **JWT Authentication** avec rotation des tokens
- **Rate Limiting** configuré par IP
- **Validation** stricte des entrées (Joi)
- **Chiffrement** des credentials canaux
- **Logs** sécurisés et auditables

## 🚀 Déploiement

### Production Docker

```bash
# Build pour production
NODE_ENV=production npm run build

# Démarrer en production
docker-compose -f docker-compose.prod.yml up -d
```

### Variables Production

Configurez obligatoirement :
- `JWT_SECRET` (32+ caractères aléatoires)
- `DATABASE_URL` (PostgreSQL production)
- Clés API des services externes
- `SENTRY_DSN` pour monitoring erreurs

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.

## 🆘 Support

- 📧 Email: support@setterai.com
- 📖 Documentation: [docs.setterai.com](https://docs.setterai.com)
- 🐛 Issues: [GitHub Issues](https://github.com/pablogoffinet/setterai/issues)

---

**Développé avec ❤️ par l'équipe SetterAI**
